import { Suspense, useContext, ViewTransition, use } from 'react';
import type { RouteParams } from './types';
import { RouterContext } from './context';

interface RouterProps {
	fallback?: React.ReactNode;
}

export function Router({ fallback }: RouterProps) {
	const context = useContext(
		RouterContext,
	) as (typeof RouterContext extends React.Context<infer T> ? T : never) & {
		setParams?: (p: RouteParams) => void;
	};

	if (!context) {
		throw new Error('Router must be used within a RouterProvider');
	}

	const { matchedRoute, path, params, loaderCache } = context;

	// Get or create loader promise for current path
	const loaderPromise = matchedRoute?.loader
		? loaderCache.get(path) ??
			(() => {
				const promise = matchedRoute.loader!({ params });
				loaderCache.set(path, promise);
				return promise;
			})()
		: null;

	if (!matchedRoute) {
		// Look for 404 route
		const notFoundRoute = context.routes.find((r) => r.path === '*');
		if (notFoundRoute) {
			const Component = notFoundRoute.component;
			return (
				<ViewTransition>
					<Suspense fallback={fallback ?? <LoadingFallback />}>
						<Component />
					</Suspense>
				</ViewTransition>
			);
		}
		return <div>404 - Page Not Found</div>;
	}

	const Component = matchedRoute.component;

	return (
		<ViewTransition>
			<Suspense fallback={fallback ?? <LoadingFallback />}>
				{loaderPromise ? (
					<RouteWithLoader
						Component={Component}
						loaderPromise={loaderPromise}
					/>
				) : (
					<Component />
				)}
			</Suspense>
		</ViewTransition>
	);
}

// Component that uses React's `use` hook to await loader data
function RouteWithLoader({
	Component,
	loaderPromise,
}: {
	Component: React.ComponentType<any>;
	loaderPromise: Promise<any>;
}) {
	const loaderData = use(loaderPromise);
	return <Component {...loaderData} />;
}

function LoadingFallback() {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="animate-pulse text-surface-500">Loading...</div>
		</div>
	);
}
