import { lazy } from 'react';
import type { Route } from './lib/router';

export const routes: Route[] = [
	{
		path: '/',
		component: lazy(() => import('./pages/Home')),
	},
	{
		path: '/projects/:slug',
		component: lazy(() => import('./pages/ProjectDetail')),
	},
	{
		path: '*',
		component: lazy(() => import('./pages/NotFound')),
	},
];
