import {
	profile,
	experiences,
	education,
	research,
	skills,
	links,
	type Experience,
	type Education,
	type Research,
} from '../data';
import { projects, type ProjectMetadata } from '@/content/projects';
import { type ReactNode, isValidElement, Children } from 'react';

export interface SerializedProject {
	slug: string;
	title: string;
	description: string;
	technologies: string[];
	link?: string;
	github?: string;
	featured?: boolean;
}

export interface SerializedContent {
	profile: typeof profile;
	experiences: Experience[];
	education: Education[];
	research: Research[];
	skills: typeof skills;
	links: typeof links;
	projects: SerializedProject[];
}

/**
 * Extract plain text from React nodes (for terminal/AI display)
 */
function extractTextFromReactNode(node: ReactNode): string {
	if (typeof node === 'string') return node;
	if (typeof node === 'number') return String(node);
	if (!node) return '';
	if (Array.isArray(node)) {
		return node.map(extractTextFromReactNode).join('');
	}
	if (isValidElement(node)) {
		// @ts-ignore: children exist
		return extractTextFromReactNode(node.props.children);
	}
	return '';
}

/**
 * Get all portfolio content in a serializable format
 */
export function getSerializedContent(): SerializedContent {
	return {
		profile,
		experiences,
		education,
		research,
		skills,
		links,
		projects: projects.map((p) => ({
			slug: p.slug,
			title: p.title,
			description: extractTextFromReactNode(p.description),
			technologies: p.technologies,
			link: p.link,
			github: p.github,
			featured: p.featured,
		})),
	};
}

/**
 * Build a comprehensive context string for AI prompts
 */
export function buildAIContext(): string {
	const content = getSerializedContent();

	return `You are Adam Grady, a Senior Software Engineer. You speak in first person about your own experience, projects, and skills. Be conversational, helpful, and enthusiastic about your work.

## About Me
Name: ${content.profile.name}
Title: ${content.profile.title}
Email: ${content.profile.email}
Phone: ${content.profile.phone}

${content.profile.summary}

## My Experience

${content.experiences
	.map(
		(e) => `### ${e.company} - ${e.role}
${e.period} | ${e.location}${e.current ? ' (Current)' : ''}
${e.description.map((d) => `- ${d}`).join('\n')}`,
	)
	.join('\n\n')}

## My Research

${content.research
	.map(
		(r) => `### ${r.institution} - ${r.role}
${r.period} | ${r.location}
${r.description}`,
	)
	.join('\n\n')}

## My Education

${content.education.map((e) => `- ${e.degree} from ${e.institution} (${e.date})`).join('\n')}

## My Skills

**Languages:** ${content.skills.languages.join(', ')}
**Frontend:** ${content.skills.frontend.join(', ')}
**Backend:** ${content.skills.backend.join(', ')}
**Tools:** ${content.skills.tools.join(', ')}

## My Projects

${content.projects
	.map(
		(p) => `### ${p.title}
${p.description}
**Technologies:** ${p.technologies.join(', ')}${p.link ? `\n**Live:** ${p.link}` : ''}${p.github ? `\n**GitHub:** ${p.github}` : ''}`,
	)
	.join('\n\n')}

## How to Respond
- Always speak in first person as Adam
- Be conversational and friendly
- Share specific details about projects and experiences when relevant
- If asked about something not related to my portfolio/career, politely redirect
- Feel free to show enthusiasm about technologies you enjoy working with`;
}

// Re-export types and data for convenience
export type { Experience, Education, Research };
export { profile, experiences, education, research, skills, links, projects };
