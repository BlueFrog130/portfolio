import { renderToReadableStream, renderToStaticMarkup } from 'react-dom/server';
import { StrictMode } from 'react';
import { RouterProvider, Router } from './lib/router';
import { routes } from './routes';
import { getMetaForPath } from './lib/router/match';
import { Head } from './lib/head';
import { AnalyticsProvider } from './lib/analytics';
import { matchPath } from '@/lib/router';

export interface RenderResult {
	html: string;
	head: string;
}

interface ManifestEntry {
	file: string;
	name?: string;
	src?: string;
	isEntry?: boolean;
	isDynamicEntry?: boolean;
	imports?: string[];
	dynamicImports?: string[];
	css?: string[];
}

type Manifest = Record<string, ManifestEntry>;

export interface RenderOptions {
	manifest?: Manifest;
}

export async function render(
	path: string,
	options?: RenderOptions,
): Promise<RenderResult> {
	const stream = await renderToReadableStream(
		<StrictMode>
			<AnalyticsProvider>
				<RouterProvider initialPath={path} routes={routes}>
					<Router />
				</RouterProvider>
			</AnalyticsProvider>
		</StrictMode>,
	);

	// Wait for all Suspense boundaries to resolve
	await stream.allReady;

	const html = await streamToString(stream);

	// Generate head based on route metadata
	const meta = getMetaForPath(path, routes) || {
		title: 'Untitled Page',
		description: 'No description available.',
		url: path,
	};

	// Build scripts and styles from manifest if provided
	const manifestPreloads = options?.manifest
		? getManifestAssets(options.manifest, path)
		: { preloads: [], stylesheets: [] };

	const head = renderToStaticMarkup(
		<Head {...meta} {...manifestPreloads} url={path} server={true} />,
	);

	return { html, head };
}

async function streamToString(
	stream: ReadableStream<Uint8Array>,
): Promise<string> {
	const reader = stream.getReader();
	const decoder = new TextDecoder();
	const chunks: string[] = [];

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		chunks.push(decoder.decode(value, { stream: true }));
	}

	return chunks.join('');
}

function getManifestAssets(
	manifest: Manifest,
	path: string,
): { preloads: string[]; stylesheets: string[] } {
	// Find entry corresponding to path
	const route = routes.find((r) => matchPath(r.path, path).matched);

	if (!route) return { preloads: [], stylesheets: [] };

	const src = route.src.replace('.', 'src');

	const entry = Object.values(manifest).find((e) => e.src === src);

	if (!entry) return { preloads: [], stylesheets: [] };

	const main = Object.values(manifest).filter((e) => e.isEntry);

	const mainCss = [
		...new Set(main.flatMap((m) => m.css || []).map((s) => `/${s}`)),
	];

	const preloads =
		entry.imports
			?.map((imp) => manifest[imp])
			.filter(Boolean)
			.map((e) => `/${e.file}`) || [];

	return {
		preloads,
		stylesheets: mainCss.concat(entry.css?.map((s) => `/${s}`) || []),
	};
}

// Server route generation
const serverImports = import.meta.glob<{ get: () => string }>(
	'./pages/**/+server.ts',
);

const serverRoutes = Object.entries(serverImports).map(([path, mod]) => {
	const routePath = path.replace('./pages', '').replace('/+server.ts', '');

	return {
		path: routePath,
		mod,
	};
});

export async function renderServerRoute(path: string): Promise<string | null> {
	for (const { path: routePath, mod } of serverRoutes) {
		if (matchPath(routePath, path).matched) {
			const module = await mod();
			return module.get();
		}
	}

	return null;
}

export function entries() {
	return routes
		.flatMap((route) => {
			if (route.entries) {
				return route.entries().map((e) => ({
					path: e,
					mode: 'page',
				}));
			}
			return [
				{
					path: route.path,
					mode: 'page',
				},
			];
		})
		.concat(
			serverRoutes.map(({ path }) => ({
				path,
				mode: 'server',
			})),
		);
}

// Enable HMR for the server entry
if (import.meta.hot) {
	import.meta.hot.accept();
}
