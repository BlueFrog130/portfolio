import type { Route, RouteParams, RouteMeta, MatchResult } from './types';

export interface RouteMatch {
	route: Route;
	params: RouteParams;
}

/**
 * Match a URL path against a route pattern.
 * Supports dynamic segments (`:param`) and catch-all (`*`) patterns.
 */
export function matchPath(pattern: string, path: string): MatchResult {
	// Handle catch-all
	if (pattern === '404') {
		return { matched: true, params: {} };
	}

	const patternParts = pattern.split('/').filter(Boolean);
	const pathParts = path.split('/').filter(Boolean);

	if (patternParts.length !== pathParts.length) {
		return { matched: false, params: {} };
	}

	const params: RouteParams = {};

	for (let i = 0; i < patternParts.length; i++) {
		const patternPart = patternParts[i];
		const pathPart = pathParts[i];

		if (patternPart.startsWith('[') && patternPart.endsWith(']')) {
			// Dynamic segment - extract param
			params[patternPart.slice(1, -1)] = pathPart;
		} else if (patternPart !== pathPart) {
			// Static segment doesn't match
			return { matched: false, params: {} };
		}
	}

	return { matched: true, params };
}

export function matchRoute(path: string, routes: Route[]): RouteMatch | null {
	for (const route of routes) {
		const result = matchPath(route.path, path);
		if (result.matched) {
			return { route, params: result.params };
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
