import { lazy } from 'react';
import type { Route } from './lib/router';
import { getProjectMeta } from './lib/content/meta';

export const routes: Route[] = [
	{
		path: '/',
		component: lazy(() => import('./pages/+Page')),
		meta: {
			title: 'Adam Grady | Senior Software Engineer',
			description:
				'Experienced Software Engineer specializing in full-stack web development with React, TypeScript, and modern web technologies.',
		},
	},
	{
		path: '/projects/:slug',
		component: lazy(() => import('./pages/project/[slug]/+Page')),
		meta: (params) => getProjectMeta(params.slug),
	},
	{
		path: '/terminal',
		component: lazy(() => import('./pages/terminal/+Page')),
		meta: {
			title: 'Terminal | Adam Grady',
			description:
				"Interactive terminal interface for exploring Adam Grady's portfolio.",
		},
	},
	{
		path: '*',
		component: lazy(() => import('./pages/404/+Page')),
		meta: {
			title: '404 - Page Not Found | Adam Grady',
			description: "The page you're looking for doesn't exist.",
		},
	},
];
