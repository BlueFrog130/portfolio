import { type ComponentType, type ReactNode } from 'react';
import {
	lazyWithPreload,
	RouteMeta,
	type PreloadableComponent,
} from '@/lib/router';
import { extractTextFromReactNode } from '@/lib/util';

export interface ProjectMetadata {
	slug: string;
	title: string;
	description: ReactNode;
	technologies: string[];
	link?: string;
	github?: string;
	featured?: boolean;
	featuredImage?: string;
	readTime: number;
}

export interface Project extends ProjectMetadata {
	Content: PreloadableComponent<ComponentType>;
}

// Eager load metadata using ?metadata query
const metadataModules = import.meta.glob<{ default: ProjectMetadata }>(
	'./*.mdx',
	{
		eager: true,
		query: '?metadata',
	},
);

// Lazy load content
const contentModules = import.meta.glob<ComponentType>('./*.mdx', {
	import: 'default',
});

export const projects: Project[] = Object.entries(metadataModules).map(
	([path, mod]) => ({
		...mod.default,
		Content: lazyWithPreload(async () => ({
			default: await contentModules[path](),
		})),
	}),
);

// Load and preload project content (for route loader pattern)
export async function loadProjectContent(
	slug: string,
): Promise<Project | undefined> {
	const project = projects.find((p) => p.slug === slug);
	if (project) {
		await project.Content.preload();
	}
	return project;
}

export function getProject(slug: string): Project | undefined {
	return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
	return projects.filter((p) => p.featured);
}

export function getProjectMeta(slug: string): RouteMeta {
	const project = projects.find((p) => p.slug === slug);

	if (!project) {
		return {
			title: 'Project Not Found | Adam Grady',
			description: 'The requested project could not be found.',
		};
	}

	const description =
		typeof project.description === 'string'
			? project.description
			: extractTextFromReactNode(project.description);

	return {
		title: `${project.title} | Adam Grady`,
		description: description,
		ogImage: project.featuredImage,
		keywords: project.technologies,
	};
}
