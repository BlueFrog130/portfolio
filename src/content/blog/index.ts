import { lazy, type ComponentType } from 'react';

export interface BlogPostMetadata {
	slug: string;
	title: string;
	description: string;
	tags: string[];
	publishedAt: string;
	featuredImage?: string;
	featured?: boolean;
	draft?: boolean;
	readTime: number;
}

export interface BlogPost extends BlogPostMetadata {
	Content: ComponentType;
}

// Eager load metadata using ?metadata query
const metadataModules = import.meta.glob<{ default: BlogPostMetadata }>(
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

// Filter out drafts in production
const isDev = import.meta.env.DEV;

export const blogPosts: BlogPost[] = Object.entries(metadataModules)
	.map(([path, mod]) => {
		return {
			...mod.default,
			Content: lazy(async () => ({ default: await contentModules[path]() })),
		};
	})
	.filter((post) => isDev || !post.draft)
	.sort(
		(a, b) =>
			new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
	);

export function getBlogPost(slug: string): BlogPost | undefined {
	return blogPosts.find((p) => p.slug === slug);
}

export function getFeaturedBlogPosts(): BlogPost[] {
	return blogPosts.filter((p) => p.featured);
}

export function getAllTags(): string[] {
	const tags = new Set<string>();
	blogPosts.forEach((post) => post.tags.forEach((tag) => tags.add(tag)));
	return [...tags].sort();
}

export function searchBlogPosts(
	query: string,
	tags: string[] = [],
): BlogPost[] {
	const normalizedQuery = query.toLowerCase().trim();

	return blogPosts.filter((post) => {
		// Tag filter
		if (tags.length > 0 && !tags.some((tag) => post.tags.includes(tag))) {
			return false;
		}

		// Text search (title + description + tags)
		if (normalizedQuery) {
			const searchText =
				`${post.title} ${post.description} ${post.tags.join(' ')}`.toLowerCase();
			return searchText.includes(normalizedQuery);
		}

		return true;
	});
}
