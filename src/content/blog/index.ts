import { type ComponentType } from 'react';
import {
	lazyWithPreload,
	type PreloadableComponent,
	type RouteMeta,
} from '@/lib/router';

export interface SeriesInfo {
	id: string;
	title: string;
	part: number;
	totalParts: number;
}

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
	series?: SeriesInfo;
}

export interface BlogPost extends BlogPostMetadata {
	Content: PreloadableComponent<ComponentType>;
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
			Content: lazyWithPreload(async () => ({
				default: await contentModules[path](),
			})),
		};
	})
	.filter((post) => isDev || !post.draft)
	.sort(
		(a, b) =>
			new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
	);

// Load and preload blog post content (for route loader pattern)
export async function loadBlogPostContent(
	slug: string,
): Promise<BlogPost | undefined> {
	const post = blogPosts.find((p) => p.slug === slug);
	if (post) {
		await post.Content.preload();
	}
	return post;
}

export function getBlogPost(slug: string): BlogPost | undefined {
	return blogPosts.find((p) => p.slug === slug);
}

export function getFeaturedBlogPosts(): BlogPost[] {
	return blogPosts.filter((p) => p.featured);
}

export function getAllTags(): string[] {
	const tags = new Set<string>(blogPosts.flatMap((post) => post.tags));
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

export function getSeriesPosts(seriesId: string): BlogPost[] {
	return blogPosts
		.filter((post) => post.series?.id === seriesId)
		.sort((a, b) => (a.series?.part ?? 0) - (b.series?.part ?? 0));
}

export function getAdjacentSeriesPosts(post: BlogPost): {
	prev: BlogPost | null;
	next: BlogPost | null;
} {
	if (!post.series) {
		return { prev: null, next: null };
	}

	const seriesPosts = getSeriesPosts(post.series.id);
	const currentIndex = seriesPosts.findIndex((p) => p.slug === post.slug);

	return {
		prev: currentIndex > 0 ? seriesPosts[currentIndex - 1] : null,
		next:
			currentIndex < seriesPosts.length - 1
				? seriesPosts[currentIndex + 1]
				: null,
	};
}

export function getBlogPostMeta(slug: string): RouteMeta {
	const post = blogPosts.find((p) => p.slug === slug);

	if (!post) {
		return {
			title: 'Post Not Found | Adam Grady',
			description: 'The requested blog post could not be found.',
		};
	}

	return {
		title: `${post.title} | Adam Grady`,
		description: post.description,
		ogImage: post.featuredImage,
		keywords: post.tags,
		type: 'article',
		publishedTime: new Date(post.publishedAt).toISOString(),
		schema: 'Article',
		sitemapPriority: 0.7,
		sitemapChangefreq: 'monthly',
	};
}
