import { lazy, type ComponentType, type ReactNode } from 'react';

export interface ProjectMetadata {
	slug: string;
	title: string;
	description: ReactNode;
	technologies: string[];
	link?: string;
	github?: string;
	featured?: boolean;
}

export interface Project extends ProjectMetadata {
	Content: ComponentType;
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
		Content: lazy(async () => ({ default: await contentModules[path]() })),
	}),
);

export function getProject(slug: string): Project | undefined {
	return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
	return projects.filter((p) => p.featured);
}
