import type { Route } from './lib/router';
import { lazyWithPreload } from './lib/router';
import { loadProjectContent, getProjectMeta } from './content/projects';
import {
	loadBlogPostContent,
	getAdjacentSeriesPosts,
	getBlogPostMeta,
} from './content/blog';

export const routes: Route[] = [
	{
		path: '/',
		component: lazyWithPreload(() => import('./pages/+Page')),
		meta: {
			title: 'Adam Grady | Senior Software Engineer',
			description:
				'Experienced Software Engineer specializing in full-stack web development with React, TypeScript, and modern web technologies.',
		},
	},
	{
		path: '/projects/:slug',
		component: lazyWithPreload(() => import('./pages/project/[slug]/+Page')),
		meta: (params) => getProjectMeta(params.slug),
		loader: async ({ params }) => {
			const project = await loadProjectContent(params.slug);
			return { project };
		},
	},
	{
		path: '/blog',
		component: lazyWithPreload(() => import('./pages/blog/+Page')),
		meta: {
			title: 'Blog | Adam Grady',
			description:
				'Thoughts on software engineering, web development, and technology.',
		},
	},
	{
		path: '/blog/:slug',
		component: lazyWithPreload(() => import('./pages/blog/[slug]/+Page')),
		meta: (params) => getBlogPostMeta(params.slug),
		loader: async ({ params }) => {
			const post = await loadBlogPostContent(params.slug);
			if (post) {
				const { prev, next } = getAdjacentSeriesPosts(post);
				return { post, prev, next };
			}
			return { post: undefined, prev: null, next: null };
		},
	},
	{
		path: '/terminal',
		component: lazyWithPreload(() => import('./pages/terminal/+Page')),
		meta: {
			title: 'Terminal | Adam Grady',
			description:
				"Interactive terminal interface for exploring Adam Grady's portfolio.",
		},
	},
	{
		path: '*',
		component: lazyWithPreload(() => import('./pages/404/+Page')),
		meta: {
			title: '404 - Page Not Found | Adam Grady',
			description: "The page you're looking for doesn't exist.",
		},
	},
];
