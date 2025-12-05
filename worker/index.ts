import { renderToString } from 'react-dom/server';
import { Hono } from 'hono';
import type { ProjectMetadata } from '../src/content/projects';
import { ReactNode } from 'react';
import TurndownService from 'turndown';
// @ts-ignore: no types available
import { gfm } from 'turndown-plugin-gfm';
import { runWithTools } from '@cloudflare/ai-utils';

const projects: Record<
	string,
	{
		metadata: ProjectMetadata;
		default: () => ReactNode;
	}
> = import.meta.glob<{
	metadata: ProjectMetadata;
	default: () => ReactNode;
}>('@/content/projects/**/*.mdx', {
	eager: true,
});

const td = new TurndownService();
td.use(gfm);

function getProjects() {
	return Object.values(projects).map((mod) => ({
		...mod.metadata,
		description: td.turndown(
			renderToString(mod.metadata.description as ReactNode),
		),
	}));
}

function getProjectContent({ slug }: { slug: string }) {
	const project = Object.values(projects).find(
		(mod) => mod.metadata.slug === slug,
	);
	if (!project) return;

	const content = td.turndown(renderToString(project.default()));
	return content;
}

export interface Env {
	AI: Ai;
	DB: D1Database;
}

const app = new Hono<{
	Bindings: {
		AI: Ai;
		DB: D1Database;
	};
}>();

interface SessionPayload {
	type: 'session';
	id: string;
	deviceType: string;
	browser: string;
	browserVersion: string;
	os: string;
	screenWidth: number;
	screenHeight: number;
	referrer: string | null;
	utmSource: string | null;
	utmMedium: string | null;
	utmCampaign: string | null;
}

interface PageViewPayload {
	type: 'pageview';
	sessionId: string;
	path: string;
	timestamp: number;
	duration?: number;
	referrerPath?: string;
}

interface WebVitalPayload {
	type: 'webvital';
	sessionId: string;
	path: string;
	timestamp: number;
	name: string;
	value: number;
	rating: string;
	id: string;
	navigationType: string;
}

type AnalyticsPayload = SessionPayload | PageViewPayload | WebVitalPayload;

app.post('/api/analytics', async (c) => {
	const db = c.env.DB;
	const batch: AnalyticsPayload[] = await c.req.json();

	const country = c.req.header('cf-ipcountry') || null;
	const cfData = (c.req.raw as Request & { cf?: { region?: string } }).cf;
	const region = cfData?.region || null;

	const statements: D1PreparedStatement[] = [];

	for (const event of batch) {
		switch (event.type) {
			case 'session':
				statements.push(
					db
						.prepare(
							`INSERT INTO sessions (
							id, started_at, country, region, device_type,
							browser, browser_version, os, screen_width, screen_height,
							referrer, utm_source, utm_medium, utm_campaign
						) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
						ON CONFLICT(id) DO NOTHING`,
						)
						.bind(
							event.id,
							Date.now(),
							country,
							region,
							event.deviceType,
							event.browser,
							event.browserVersion,
							event.os,
							event.screenWidth,
							event.screenHeight,
							event.referrer,
							event.utmSource,
							event.utmMedium,
							event.utmCampaign,
						),
				);
				break;

			case 'pageview':
				statements.push(
					db
						.prepare(
							`INSERT INTO page_views (
							session_id, path, timestamp, duration, referrer_path
						) VALUES (?, ?, ?, ?, ?)`,
						)
						.bind(
							event.sessionId,
							event.path,
							event.timestamp,
							event.duration || null,
							event.referrerPath || null,
						),
				);
				statements.push(
					db
						.prepare(`UPDATE sessions SET ended_at = ? WHERE id = ?`)
						.bind(event.timestamp, event.sessionId),
				);
				break;

			case 'webvital':
				statements.push(
					db
						.prepare(
							`INSERT INTO web_vitals (
							session_id, path, timestamp, metric_name,
							metric_value, metric_rating, metric_id, navigation_type
						) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
						)
						.bind(
							event.sessionId,
							event.path,
							event.timestamp,
							event.name,
							event.value,
							event.rating,
							event.id,
							event.navigationType,
						),
				);
				break;
		}
	}

	if (statements.length > 0) {
		await db.batch(statements);
	}

	return c.json({ success: true });
});

const SYSTEM_PROMPT = `You are Adam Grady, a Senior Software Engineer. You speak in first person about your own experience, projects, and skills. Be conversational, helpful, and enthusiastic about your work.

## About Me
Name: Adam Grady
Title: Senior Software Engineer
Email: adam.grady@live.com
Phone: 402.616.5375

Experienced Software Engineer specializing in full-stack web development with React, TypeScript, and modern web technologies. Passionate about building performant, accessible applications.

## My Experience

### Solarity Health - Senior Software Engineer
May 2019 - Present | Sioux Falls, SD (Current)
- Full-stack web developer working with JavaScript, TypeScript, React, CSS, HTML, C#, and SQL
- Led migration to modern tech stack, championing TypeScript and React adoption
- Created internal full-stack web application for billing and operating system configuration using ASP.NET Core and Vue

### Grady Development - Founder
Jan 2022 - Present | Vermillion, SD (Current)
- Founded software development company providing custom solutions to small businesses
- Developed SEO-optimized websites achieving first-page search rankings
- Created wMammogram, an interactive course that substantially increased mammogram awareness
- Deployed applications across AWS, Azure, Google Cloud, and Cloudflare

## My Research

### University of South Dakota - Graduate Assistant
Jan 2021 - Jun 2022 | Vermillion, SD
Built CodingStub, a full-stack online coding environment using containerized microservices. Taught lectures and mentored students.

### University of South Dakota - Research Assistant
Jan 2019 - May 2020 | Vermillion, SD
Researched Software-Defined Networking in cloud environments. Presented findings at 2020 IETC Conference and USD Research Fair.

## My Education
- Masters in Computer Science from University of South Dakota (Dec 2021)
- BS in Computer Science from University of South Dakota (May 2021)

## My Skills
**Languages:** JavaScript, TypeScript, C#, Python, Rust, Go, SQL
**Frontend:** React, Svelte, Vue, HTML, CSS, Tailwind
**Backend:** Node.js, ASP.NET Core, REST APIs, GraphQL
**Tools:** Docker, Git, CI/CD, AWS, Azure, Google Cloud, Cloudflare

## How to Respond
- Always speak in first person as Adam (use "I", "my", "me")
- Be conversational, friendly, and show enthusiasm for technology
- Share specific details about projects and experiences when relevant
- If asked about something not related to my portfolio/career, politely redirect
- Keep responses concise but informative
- Feel free to ask follow-up questions to better help the visitor

## Available Tools
You have access to the following tools to help answer questions about my projects:
- getProjects: Get a list of projects with their metadata.
- getProjectContent: Get the full content of a project by its slug.
Use these tools as needed to provide accurate and detailed responses.`;

app.post('/api/chat', async (c) => {
	const { messages } = await c.req.json();

	console.log('Received messages:', messages);

	const systemMessage = {
		role: 'system',
		content: SYSTEM_PROMPT,
	};

	const response = await runWithTools(
		// @ts-ignore: types not yet available
		c.env.AI,
		'@hf/nousresearch/hermes-2-pro-mistral-7b',
		{
			tools: [
				{
					name: 'getProjects',
					description: 'Get a list of projects with their metadata.',
					parameters: {
						type: 'object',
						properties: {},
						required: [],
					},
					function: getProjects,
				},
				{
					name: 'getProjectContent',
					description: 'Get the full content of a project by its slug.',
					parameters: {
						type: 'object',
						properties: {
							slug: {
								type: 'string',
								description: 'The slug of the project',
							},
						},
						required: ['slug'],
					},
					function: getProjectContent,
				},
			],
			messages: [systemMessage, ...messages],
		},
		{
			streamFinalResponse: true,
		},
	);

	console.log(response);

	return c.body(response as ReadableStream, 200, {
		'Content-Type': 'text/event-stream',
	});
});

export default app;
