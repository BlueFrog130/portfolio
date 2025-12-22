import {
	createContext,
	useContext,
	useState,
	useCallback,
	startTransition,
	useEffect,
	useRef,
	useMemo,
	type ReactNode,
	useLayoutEffect,
} from 'react';
import type {
	RouterContextValue,
	RouteParams,
	Route,
	SearchParams,
	SetSearchParamsOptions,
} from './types';
import { matchPath } from './match';
import { useAnalytics } from '@/lib/analytics/context';

function scrollToHash(hash: string) {
	if (!hash) return;
	const id = hash.replace('#', '');
	const element = document.getElementById(id);
	if (element) {
		element.scrollIntoView({ behavior: 'smooth' });
	}
}

function parseUrl(url: string): {
	path: string;
	search: string;
	hash: string;
} {
	// Extract hash first
	const hashIndex = url.indexOf('#');
	let hash = '';
	let urlWithoutHash = url;
	if (hashIndex !== -1) {
		hash = url.slice(hashIndex);
		urlWithoutHash = url.slice(0, hashIndex);
	}

	// Extract search/query string
	const searchIndex = urlWithoutHash.indexOf('?');
	let search = '';
	let path = urlWithoutHash;
	if (searchIndex !== -1) {
		search = urlWithoutHash.slice(searchIndex);
		path = urlWithoutHash.slice(0, searchIndex);
	}

	return {
		path: path || '/',
		search,
		hash,
	};
}

const RouterContext = createContext<RouterContextValue | null>(null);

export function useRouter(): RouterContextValue {
	const context = useContext(RouterContext);
	if (!context) {
		throw new Error('useRouter must be used within a RouterProvider');
	}
	return context;
}

export function useParams(): RouteParams {
	return useRouter().params;
}

export function useHash(): string {
	return useRouter().hash;
}

export function useSearchParams(): [
	URLSearchParams,
	RouterContextValue['setSearchParams'],
] {
	const { searchParams, setSearchParams } = useRouter();
	return [searchParams, setSearchParams];
}

interface RouterProviderProps {
	children: ReactNode;
	initialPath?: string;
	initialParams?: RouteParams;
	routes: Route[];
}

export function RouterProvider({
	children,
	initialPath,
	initialParams = {},
	routes,
}: RouterProviderProps) {
	const analytics = useAnalytics();

	const [path, setPath] = useState(() => {
		if (initialPath) return parseUrl(initialPath).path;
		if (typeof window !== 'undefined') {
			return window.location.pathname;
		}
		return '/';
	});
	const [searchParams, setSearchParamsState] = useState<SearchParams>(() => {
		if (initialPath) return new URLSearchParams(parseUrl(initialPath).search);
		if (typeof window !== 'undefined') {
			return new URLSearchParams(window.location.search);
		}
		return new URLSearchParams();
	});
	const [hash, setHash] = useState(() => {
		if (initialPath) return parseUrl(initialPath).hash;
		if (typeof window !== 'undefined') {
			return window.location.hash;
		}
		return '';
	});
	const [params, setParams] = useState<RouteParams>(initialParams);
	const [matchedRoute, setMatchedRoute] = useState<Route | null>(() => {
		for (const route of routes) {
			const result = matchPath(route.path, path);
			if (result.matched) {
				setParams(result.params);
				return route;
			}
		}
		return null;
	});

	const setSearchParams = useCallback(
		(
			params:
				| URLSearchParams
				| Record<string, string>
				| ((prev: URLSearchParams) => URLSearchParams | Record<string, string>),
			options?: SetSearchParamsOptions,
		) => {
			setSearchParamsState((currentSearchParams) => {
				const newParams =
					typeof params === 'function' ? params(currentSearchParams) : params;
				const newSearchParams =
					newParams instanceof URLSearchParams
						? newParams
						: new URLSearchParams(newParams);

				const searchString = newSearchParams.toString();
				const newUrl = `${path}${searchString ? `?${searchString}` : ''}${hash}`;

				if (options?.replace) {
					window.history.replaceState({}, '', newUrl);
				} else {
					window.history.pushState({}, '', newUrl);
				}

				return newSearchParams;
			});
		},
		[path, hash],
	);

	const navigate = useCallback(
		(to: string) => {
			const { path: newPath, search: newSearch, hash: newHash } = parseUrl(to);
			const isSamePage = newPath === path || newPath === '';
			const isHashOnly = to.startsWith('#');

			if (isHashOnly || isSamePage) {
				// Hash-only or same-page navigation - just update hash and scroll
				window.history.pushState({}, '', to);
				setHash(newHash);
				if (newSearch) {
					setSearchParamsState(new URLSearchParams(newSearch));
				}
				scrollToHash(newHash);
			} else {
				// Full navigation
				analytics.trackNavigation(newPath);

				window.history.pushState({}, '', to);
				startTransition(() => {
					setPath(newPath);
					setSearchParamsState(new URLSearchParams(newSearch));
					setHash(newHash);
					for (const route of routes) {
						const result = matchPath(route.path, newPath);
						if (result.matched) {
							setMatchedRoute(route);
							setParams(result.params);
							break;
						}
					}
				});
				// Scroll to hash after navigation, or scroll to top
				if (newHash) {
					requestAnimationFrame(() => scrollToHash(newHash));
				} else {
					window.scrollTo(0, 0);
				}
			}
		},
		[routes, path, analytics],
	);

	const prefetchedPaths = useRef(new Set<string>());
	const loaderCache = useRef(new Map<string, Promise<any>>());

	const prefetch = useCallback(
		(to: string) => {
			// Skip external URLs
			if (to.startsWith('http://') || to.startsWith('https://')) return;
			// Skip hash-only
			if (to.startsWith('#')) return;

			const { path: targetPath } = parseUrl(to);
			if (prefetchedPaths.current.has(targetPath)) return;

			for (const route of routes) {
				const result = matchPath(route.path, targetPath);
				if (result.matched) {
					prefetchedPaths.current.add(targetPath);

					// Prefetch page component
					const component = route.component as any;
					if (typeof component.preload === 'function') {
						component.preload();
					}

					// Call loader and cache the promise
					if (typeof route.load === 'function') {
						const loaderPromise = route.load({ params: result.params });
						loaderCache.current.set(targetPath, loaderPromise);
					}

					break;
				}
			}
		},
		[routes],
	);

	useLayoutEffect(() => {
		const handlePopState = () => {
			const newPath = window.location.pathname;
			const newSearch = window.location.search;
			const newHash = window.location.hash;

			analytics?.trackNavigation(newPath);

			startTransition(() => {
				setPath(newPath);
				setSearchParamsState(new URLSearchParams(newSearch));
				setHash(newHash);
				for (const route of routes) {
					const result = matchPath(route.path, newPath);
					if (result.matched) {
						setMatchedRoute(route);
						setParams(result.params);
						break;
					}
				}
			});

			if (newHash) {
				scrollToHash(newHash);
			}
		};

		window.addEventListener('popstate', handlePopState);
		return () => window.removeEventListener('popstate', handlePopState);
	}, [routes, analytics]);

	// Handle initial hash scroll on page load
	useEffect(() => {
		if (hash) {
			scrollToHash(hash);
		}
	}, [hash]);

	// Internal method to update params from Router
	const contextValue = useMemo<
		RouterContextValue & { setParams: (p: RouteParams) => void }
	>(
		() => ({
			path,
			hash,
			params,
			searchParams,
			setSearchParams,
			navigate,
			prefetch,
			setParams,
			routes,
			matchedRoute,
			loaderCache: loaderCache.current,
		}),
		[
			path,
			hash,
			params,
			searchParams,
			setSearchParams,
			navigate,
			prefetch,
			setParams,
			routes,
			matchedRoute,
		],
	);

	return (
		<RouterContext.Provider value={contextValue}>
			{children}
		</RouterContext.Provider>
	);
}

// Export context for Router to access setParams
export { RouterContext };
