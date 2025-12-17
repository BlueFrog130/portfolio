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
import { projects } from '@/content/projects';
import { type ReactNode, isValidElement } from 'react';

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

// Re-export types and data for convenience
export type { Experience, Education, Research };
export { profile, experiences, education, research, skills, links, projects };
