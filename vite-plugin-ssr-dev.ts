import type { Plugin, ViteDevServer } from 'vite';
import { isRunnableDevEnvironment } from 'vite';
import { readFileSync } from 'fs';
import { resolve } from 'path';

interface RenderResult {
	html: string;
	head: string;
}

/**
 * Vite plugin that enables SSR development mode using entry-server.tsx.
 * Uses SvelteKit-style template injection with index.html placeholders.
 */
export function ssrDevPlugin(): Plugin {
	return {
		name: 'ssr-dev',
		enforce: 'pre',

		configureServer(server: ViteDevServer) {
			// Add middleware directly (not as post-hook) to run before Cloudflare plugin
			server.middlewares.use(async (req, res, next) => {
				const url = req.originalUrl || '/';

				// Skip non-page requests
				if (
					url.startsWith('/api') ||
					url.startsWith('/@') ||
					url.startsWith('/__') ||
					url.startsWith('/node_modules') ||
					url.startsWith('/src') ||
					/\.\w+$/.test(url)
				) {
					return next();
				}

				try {
					// Get the SSG environment (which has our entry-server)
					const ssgEnv = server.environments.ssg;

					if (!isRunnableDevEnvironment(ssgEnv)) {
						console.error('[ssr-dev] SSG environment is not runnable');
						return next();
					}

					// Read and transform template
					let template = readFileSync(resolve('index.html'), 'utf-8');
					template = await server.transformIndexHtml(url, template);

					// Import the entry-server module with HMR support
					const { render } = (await ssgEnv.runner.import(
						'/src/entry-server.tsx',
					)) as {
						render: (path: string) => Promise<RenderResult>;
					};

					const { html, head } = await render(url);

					// Inject content
					const finalHtml = template
						.replace('<!--app-html-->', html)
						.replace('<!--app-head-->', head);

					res.statusCode = 200;
					res.setHeader('Content-Type', 'text/html');
					res.end(finalHtml);
				} catch (e) {
					server.ssrFixStacktrace(e as Error);
					console.error('[ssr-dev]', e);
					next(e);
				}
			});
		},
	};
}
