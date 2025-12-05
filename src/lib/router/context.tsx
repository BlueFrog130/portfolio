import {
	createContext,
	useContext,
	useState,
	useCallback,
	startTransition,
	useEffect,
	type ReactNode,
	useLayoutEffect,
} from 'react';
import type {
	RouterContextValue,
	RouteParams,
	MatchResult,
	Route,
} from './types';
import { getAnalyticsClient } from '@/lib/analytics/client';

function scrollToHash(hash: string) {
	if (!hash) return;
	const id = hash.replace('#', '');
	const element = document.getElementById(id);
	if (element) {
		element.scrollIntoView({ behavior: 'smooth' });
	}
}

function parseUrl(url: string): { path: string; hash: string } {
	const hashIndex = url.indexOf('#');
	if (hashIndex === -1) {
		return { path: url, hash: '' };
	}
	return {
		path: url.slice(0, hashIndex) || '/',
		hash: url.slice(hashIndex),
	};
}

function matchPath(pattern: string, path: string): MatchResult {
	const patternParts = pattern.split('/').filter(Boolean);
	const pathParts = path.split('/').filter(Boolean);

	// Check if lengths could match (accounting for params)
	if (patternParts.length !== pathParts.length) {
		return { matched: false, params: {} };
	}

	const params: RouteParams = {};

	for (let i = 0; i < patternParts.length; i++) {
		const patternPart = patternParts[i];
		const pathPart = pathParts[i];

		if (patternPart.startsWith(':')) {
			// Dynamic segment - extract param
			const paramName = patternPart.slice(1);
			params[paramName] = pathPart;
		} else if (patternPart !== pathPart) {
			// Static segment doesn't match
			return { matched: false, params: {} };
		}
	}

	return { matched: true, params };
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
	const [path, setPath] = useState(() => {
		if (initialPath) return parseUrl(initialPath).path;
		if (typeof window !== 'undefined') {
			return window.location.pathname;
		}
		return '/';
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

	const navigate = useCallback(
		(to: string) => {
			const { path: newPath, hash: newHash } = parseUrl(to);
			const isSamePage = newPath === path || newPath === '';
			const isHashOnly = to.startsWith('#');

			if (isHashOnly || isSamePage) {
				// Hash-only or same-page navigation - just update hash and scroll
				window.history.pushState({}, '', to);
				setHash(newHash);
				scrollToHash(newHash);
			} else {
				// Full navigation
				const analytics = getAnalyticsClient();
				analytics?.trackNavigation(newPath);

				window.history.pushState({}, '', to);
				startTransition(() => {
					setPath(newPath);
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
		[routes, path],
	);

	useLayoutEffect(() => {
		const handlePopState = () => {
			const newPath = window.location.pathname;
			const newHash = window.location.hash;

			const analytics = getAnalyticsClient();
			analytics?.trackNavigation(newPath);

			startTransition(() => {
				setPath(newPath);
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
	}, [routes]);

	// Handle initial hash scroll on page load
	useEffect(() => {
		if (hash) {
			scrollToHash(hash);
		}
	}, [hash]);

	// Internal method to update params from Router
	const contextValue: RouterContextValue & {
		setParams: (p: RouteParams) => void;
	} = {
		path,
		hash,
		params,
		navigate,
		setParams,
		routes,
		matchedRoute,
	};

	return (
		<RouterContext.Provider value={contextValue}>
			{children}
		</RouterContext.Provider>
	);
}

// Export context for Router to access setParams
export { RouterContext };
