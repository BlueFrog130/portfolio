import type { ComponentType, LazyExoticComponent } from 'react';

export interface RouteParams {
	[key: string]: string;
}

export interface Route {
	path: string;
	component: ComponentType | LazyExoticComponent<ComponentType>;
}

export interface RouterContextValue {
	path: string;
	hash: string;
	params: RouteParams;
	navigate: (to: string) => void;
	routes: Route[];
	matchedRoute: Route | null;
}

export interface MatchResult {
	matched: boolean;
	params: RouteParams;
}
