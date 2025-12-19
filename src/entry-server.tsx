import { renderToReadableStream } from 'react-dom/server';
import { StrictMode } from 'react';
import { RouterProvider, Router } from './lib/router';
import { routes } from './routes';
import { getMetaForPath } from './lib/router/match';
import { Head } from './lib/head';
import { AnalyticsProvider } from './lib/analytics';

export interface RenderResult {
	html: string;
	head: string;
}

export async function render(path: string): Promise<RenderResult> {
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
	const headStream = await renderToReadableStream(
		<Head {...meta} url={path} server={true} />,
	);
	const head = await streamToString(headStream);

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

// Enable HMR for the server entry
if (import.meta.hot) {
	import.meta.hot.accept();
}
