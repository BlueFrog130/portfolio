import { renderToString } from 'react-dom/server';
import { Hono } from 'hono';
import { validator } from 'hono/validator';

import type { ProjectMetadata } from '../src/content/projects';
import { ReactNode } from 'react';
import TurndownService from 'turndown';
// @ts-ignore: no types available
import { gfm } from 'turndown-plugin-gfm';
import { z } from 'zod';

interface AIAnalyticsData {
	sessionId: string | null;
	endpoint: string;
	model: string;
	projectSlug?: string;
	userMessage?: string;
	startTime: number;
}

interface AIAnalyticsResult {
	inputTokens?: number;
	outputTokens?: number;
	totalTokens?: number;
	latencyMs: number;
	firstTokenMs?: number;
	responseText: string;
}

function createLoggingStream(
	stream: ReadableStream<Uint8Array>,
	db: D1Database,
	analyticsData: AIAnalyticsData,
	ctx: ExecutionContext,
): ReadableStream<Uint8Array> {
	const [clientStream, loggingStream] = stream.tee();

	const decoder = new TextDecoder();
	let responseText = '';
	let firstTokenTime: number | undefined;
	let usageData: {
		input_tokens?: number;
		output_tokens?: number;
		total_tokens?: number;
	} = {};

	// Process the logging stream in the background
	ctx.waitUntil(
		(async () => {
			const reader = loggingStream.getReader();
			let buffer = '';

			try {
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					const chunk = decoder.decode(value, { stream: true });

					// Record time to first token
					if (!firstTokenTime && chunk.length > 0) {
						firstTokenTime = Date.now();
					}

					// Parse SSE data chunks with buffering for incomplete lines
					buffer += chunk;
					const lines = buffer.split('\n');

					// Keep the last (potentially incomplete) line in the buffer
					buffer = lines.pop() || '';

					for (const line of lines) {
						if (line.startsWith('data: ')) {
							const data = line.slice(6);
							if (data === '[DONE]') continue;

							try {
								const parsed = JSON.parse(data);
								if (parsed.response) {
									responseText += parsed.response;
								}
								// Capture usage data if present
								if (parsed.usage) {
									usageData = {
										input_tokens:
											parsed.usage.prompt_tokens ?? parsed.usage.input_tokens,
										output_tokens:
											parsed.usage.completion_tokens ??
											parsed.usage.output_tokens,
										total_tokens: parsed.usage.total_tokens,
									};
								}
							} catch {
								// Skip non-JSON lines
							}
						}
					}
				}
			} finally {
				reader.releaseLock();
			}

			// Log to database
			const endTime = Date.now();
			const result: AIAnalyticsResult = {
				inputTokens: usageData.input_tokens,
				outputTokens: usageData.output_tokens,
				totalTokens: usageData.total_tokens,
				latencyMs: endTime - analyticsData.startTime,
				firstTokenMs: firstTokenTime
					? firstTokenTime - analyticsData.startTime
					: undefined,
				responseText,
			};

			await db
				.prepare(
					`INSERT INTO events (
						session_id, timestamp, event_type, event_category, event_data
					) VALUES (?, ?, ?, ?, ?)`,
				)
				.bind(
					analyticsData.sessionId,
					analyticsData.startTime,
					'ai_request',
					'ai',
					JSON.stringify({
						endpoint: analyticsData.endpoint,
						model: analyticsData.model,
						projectSlug: analyticsData.projectSlug ?? null,
						inputTokens: result.inputTokens ?? null,
						outputTokens: result.outputTokens ?? null,
						totalTokens: result.totalTokens ?? null,
						latencyMs: result.latencyMs,
						firstTokenMs: result.firstTokenMs ?? null,
						userMessage: analyticsData.userMessage ?? null,
						responseText: result.responseText,
					}),
				)
				.run();
		})(),
	);

	return clientStream;
}

const projects: Record<
	string,
	{
		metadata: ProjectMetadata;
		default: () => ReactNode;
	}
> = Object.values(
	import.meta.glob<{
		metadata: ProjectMetadata;
		default: () => ReactNode;
	}>('@/content/projects/**/*.mdx', {
		eager: true,
	}),
).reduce(
	(acc, mod) => {
		acc[mod.metadata.slug!] = mod;
		return acc;
	},
	{} as Record<string, { metadata: ProjectMetadata; default: () => ReactNode }>,
);

const td = new TurndownService();
td.use(gfm);

function getProject(slug: string) {
	const project = projects[slug];
	if (!project) return;

	return {
		...project.metadata,
		content: td.turndown(renderToString(project.default())),
	};
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

interface EventPayload {
	type: 'event';
	sessionId: string;
	timestamp: number;
	eventType: string;
	eventCategory: string;
	eventData?: Record<string, unknown>;
}

type AnalyticsPayload =
	| SessionPayload
	| PageViewPayload
	| WebVitalPayload
	| EventPayload;

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
							`INSERT INTO events (
							session_id, timestamp, event_type, event_category, event_data
						) VALUES (?, ?, ?, ?, ?)`,
						)
						.bind(
							event.sessionId,
							event.timestamp,
							'pageview',
							'navigation',
							JSON.stringify({
								path: event.path,
								duration: event.duration || null,
								referrerPath: event.referrerPath || null,
							}),
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
							`INSERT INTO events (
							session_id, timestamp, event_type, event_category, event_data
						) VALUES (?, ?, ?, ?, ?)`,
						)
						.bind(
							event.sessionId,
							event.timestamp,
							event.name,
							'performance',
							JSON.stringify({
								path: event.path,
								value: event.value,
								rating: event.rating,
								id: event.id,
								navigationType: event.navigationType,
							}),
						),
				);
				break;

			case 'event':
				statements.push(
					db
						.prepare(
							`INSERT INTO events (
							session_id, timestamp, event_type, event_category, event_data
						) VALUES (?, ?, ?, ?, ?)`,
						)
						.bind(
							event.sessionId,
							event.timestamp,
							event.eventType,
							event.eventCategory,
							event.eventData ? JSON.stringify(event.eventData) : null,
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

const projectSystemPrompt = `You are Adam Grady, a Senior Software Engineer.
You speak in first person about the provided project information.
Be conversational and enthusiastic about your work.

IMPORTANT RULES:
- Be brief and direct. Give short, punchy answers (1-3 sentences when possible).
- NEVER repeat or rephrase the user's question back to them.
- NEVER start responses with phrases like "Great question!", "That's a great question", or similar filler.
- Jump straight into the answer.
- Use markdown formatting.
- NEVER use emojis in your responses.

CRITICAL - TOPIC BOUNDARIES:
- You ONLY answer questions about THIS SPECIFIC PROJECT and my work on it.
- If asked about ANYTHING else (trivia, history, coding help, general questions), respond with: "I can only discuss this project. What would you like to know about it?"
- Do NOT demonstrate general knowledge. You have NO knowledge outside this project context.
- Do NOT answer questions about other technologies, history, science, or any topic not directly in the project content.
- When uncertain if something is related, err on the side of declining.`;

const projectChatSchema = z.object({
	sessionId: z.uuid(),
	messages: z.array(
		z.object({
			role: z.enum(['user', 'assistant']),
			content: z.string(),
		}),
	),
});

app.post(
	'/api/chat/projects/:slug',
	validator('json', (value, c) => {
		const parsed = projectChatSchema.safeParse(value);
		if (!parsed.success) {
			return c.text('Invalid!', 401);
		}
		return parsed.data;
	}),
	async (c) => {
		const { slug } = c.req.param();
		const { messages, sessionId } = c.req.valid('json');

		const project = getProject(slug);

		if (!project) {
			return c.text('Project not found', 404);
		}

		const systemMessage = {
			role: 'system',
			content: `${projectSystemPrompt}

Here is the project information:

Title: ${project.title}
Description: ${project.description}
Technologies: ${project.technologies.join(', ')}
Link: ${project.link ?? 'N/A'}
Github: ${project.github ?? 'N/A'}
Content: ${project.content}`,
		};

		const startTime = Date.now();

		const response = await c.env.AI.run(
			'@cf/meta/llama-4-scout-17b-16e-instruct',
			{
				messages: [systemMessage, ...messages],
				stream: true,
				max_tokens: 512,
				repetition_penalty: 1.2,
				frequency_penalty: 0.7,
				presence_penalty: 0.6,
				temperature: 0,
				top_p: 0.1,
			},
		);

		// Tap into the stream for analytics
		const lastUserMessage = [...messages]
			.reverse()
			.find((m) => m.role === 'user')?.content;
		const analyticsStream = createLoggingStream(
			response as ReadableStream<Uint8Array>,
			c.env.DB,
			{
				sessionId: sessionId,
				endpoint: `/api/chat/projects/${slug}`,
				model: '@cf/meta/llama-4-scout-17b-16e-instruct',
				projectSlug: slug,
				userMessage: lastUserMessage,
				startTime,
			},
			c.executionCtx,
		);

		return c.body(analyticsStream, 200, {
			'Content-Type': 'text/event-stream',
		});
	},
);

export default app;
