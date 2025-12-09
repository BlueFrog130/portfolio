import { lazy } from 'react';
import type { Route } from './lib/router';

export const routes: Route[] = [
	{
		path: '/',
		component: lazy(() => import('./pages/+Page')),
	},
	{
		path: '/projects/:slug',
		component: lazy(() => import('./pages/project/[slug]/+Page')),
	},
	{
		path: '/terminal',
		component: lazy(() => import('./pages/terminal/+Page')),
	},
	{
		path: '*',
		component: lazy(() => import('./pages/404/+Page')),
	},
];
