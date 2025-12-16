import { type ComponentType, type ReactNode } from 'react';
import {
	lazyWithPreload,
	type PreloadableComponent,
} from '@/lib/router';

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
