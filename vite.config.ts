import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import mdx from '@mdx-js/rollup';
import { mdxMetadataPlugin } from './vite-plugin-mdx-metadata';
import gfm from 'remark-gfm';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [
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
	],
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
			'@content': resolve(__dirname, 'content'),
		},
	},
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
			},
		},
	},
	environments: {
		client: {
			build: {
				outDir: 'dist/client',
			},
		},
		ssr: {
			build: {
				outDir: 'dist/server',
				ssr: true,
				rollupOptions: {
					input: resolve(__dirname, 'src/entry-server.tsx'),
				},
			},
		},
	},
	builder: {
		async buildApp(builder) {
			await builder.build(builder.environments.client);
			await builder.build(builder.environments.ssr);
		},
	},
});
