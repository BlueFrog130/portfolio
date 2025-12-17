import type { ComponentType, LazyExoticComponent } from 'react';

export interface RouteParams {
	[key: string]: string;
}

export interface RouteMeta {
	title: string;
	description: string;
	ogImage?: string;
	keywords?: string[];
	// Article-specific metadata
	type?: 'website' | 'article';
	publishedTime?: string;
	modifiedTime?: string;
	// JSON-LD schema type
	schema?: 'Person' | 'Article' | 'SoftwareApplication';
	// Sitemap configuration
	sitemapPriority?: number;
	sitemapChangefreq?:
		| 'always'
		| 'hourly'
		| 'daily'
		| 'weekly'
		| 'monthly'
		| 'yearly'
		| 'never';
}

export interface LoaderContext {
	params: RouteParams;
}

export interface Route<T = any> {
	path: string;
	component: ComponentType<T> | LazyExoticComponent<ComponentType<T>>;
	meta?: RouteMeta | ((params: RouteParams) => RouteMeta);
	loader?: (context: LoaderContext) => Promise<T>;
}

export type SearchParams = URLSearchParams;

export interface SetSearchParamsOptions {
	replace?: boolean;
}

export interface RouterContextValue {
	path: string;
	hash: string;
	params: RouteParams;
	searchParams: SearchParams;
	setSearchParams: (
		params:
			| URLSearchParams
			| Record<string, string>
			| ((prev: URLSearchParams) => URLSearchParams | Record<string, string>),
		options?: SetSearchParamsOptions,
	) => void;
	navigate: (to: string) => void;
	prefetch: (to: string) => void;
	routes: Route[];
	matchedRoute: Route | null;
	loaderCache: Map<string, Promise<any>>;
}

export interface MatchResult {
	matched: boolean;
	params: RouteParams;
}
