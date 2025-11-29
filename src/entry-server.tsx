import { renderToReadableStream } from 'react-dom/server';
import { StrictMode } from 'react';
import { RouterProvider, Router } from './lib/router';
import { routes } from './routes';

export async function render(path: string): Promise<string> {
	const stream = await renderToReadableStream(
		<StrictMode>
			<RouterProvider initialPath={path} routes={routes}>
				<Router />
			</RouterProvider>
		</StrictMode>,
	);

	// Wait for all Suspense boundaries to resolve (required for SSG)
	await stream.allReady;

	// Convert the stream to a string
	const reader = stream.getReader();
	const chunks: Uint8Array[] = [];

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		chunks.push(value);
	}

	const decoder = new TextDecoder();
	return chunks
		.map((chunk) => decoder.decode(chunk, { stream: true }))
		.join('');
}
