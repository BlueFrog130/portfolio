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

export type Route<T = any> = {
	path: string;
	component: ComponentType<T> | LazyExoticComponent<ComponentType<T>>;
} & PageOptions;

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

export type PageLoad<T> = (context: LoaderContext) => Promise<T>;

export type RouteEntries = () => string[];

export type PageMeta = RouteMeta | ((params: RouteParams) => RouteMeta);

export type PageOptions = {
	meta?: PageMeta;
	load?: PageLoad<any>;
	entries?: RouteEntries;
};
