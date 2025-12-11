import type { Route, RouteParams, RouteMeta } from './types';

export interface RouteMatch {
	route: Route;
	params: RouteParams;
}

export function matchRoute(path: string, routes: Route[]): RouteMatch | null {
	for (const route of routes) {
		const params = matchPath(route.path, path);
		if (params !== null) {
			return { route, params };
		}
	}
	return null;
}

export function getMetaForPath(
	path: string,
	routes: Route[],
): RouteMeta | null {
	const match = matchRoute(path, routes);
	if (!match) {
		return null;
	}

	const { route, params } = match;
	if (typeof route.meta === 'function') {
		return route.meta(params);
	}
	return route.meta || null;
}

function matchPath(pattern: string, path: string): RouteParams | null {
	// Handle catch-all
	if (pattern === '*') return {};

	const patternParts = pattern.split('/');
	const pathParts = path.split('/');

	if (patternParts.length !== pathParts.length) return null;

	const params: RouteParams = {};
	for (let i = 0; i < patternParts.length; i++) {
		if (patternParts[i].startsWith(':')) {
			params[patternParts[i].slice(1)] = pathParts[i];
		} else if (patternParts[i] !== pathParts[i]) {
			return null;
		}
	}
	return params;
}
