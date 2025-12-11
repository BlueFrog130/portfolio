import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import mdx from '@mdx-js/rollup';
import { mdxMetadataPlugin } from './vite-plugin-mdx-metadata';
import { ssrDevPlugin } from './vite-plugin-ssr-dev';
import gfm from 'remark-gfm';
import { cloudflare } from '@cloudflare/vite-plugin';
import { ssg } from './scripts/ssg';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [
		ssrDevPlugin(),
		tailwindcss(),
		mdxMetadataPlugin(),
		{
			enforce: 'pre',
			...mdx({
				remarkPlugins: [gfm],
			}),
		},
		react({
			include: /\.(jsx|js|mdx|md|tsx|ts)$/,
			babel: {
				plugins: ['babel-plugin-react-compiler'],
			},
		}),
		cloudflare({
			viteEnvironment: {
				name: 'ssr',
			},
		}),
	],
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
		},
	},
	environments: {
		client: {
			build: {
				outDir: 'dist/client',
				manifest: true,
			},
		},
		ssr: {
			build: {
				outDir: 'dist/server',
				ssr: true,
			},
		},
		ssg: {
			build: {
				outDir: 'dist/ssg',
				ssr: true,
				rollupOptions: {
					input: resolve(__dirname, 'src/entry-server.tsx'),
				},
			},
		},
	},
	builder: {
		async buildApp(builder) {
			// Build all environments in parallel
			await Promise.all([
				builder.build(builder.environments.client),
				builder.build(builder.environments.ssr),
				builder.build(builder.environments.ssg),
			]);

			await ssg();
		},
	},
});
