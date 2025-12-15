import { blogPosts } from '@/content/blog';
import { projects } from '@/content/projects';
import type { RouteMeta } from '@/lib/router';
import { type ReactNode, isValidElement } from 'react';

/**
 * Extract plain text from React nodes
 */
function extractTextFromReactNode(node: ReactNode): string {
	if (typeof node === 'string') return node;
	if (typeof node === 'number') return String(node);
	if (!node) return '';
	if (Array.isArray(node)) {
		return node.map(extractTextFromReactNode).join('');
	}
	if (isValidElement(node)) {
		return extractTextFromReactNode(
			(node.props as { children?: ReactNode }).children,
		);
	}
	return '';
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
	};
}
