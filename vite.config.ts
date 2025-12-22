import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import mdx from '@mdx-js/rollup';
import { mdxMetadataPlugin } from './vite-plugin-mdx-metadata';
import { ogImagePlugin } from './vite-plugin-og-image';
import { ssrDevPlugin } from './vite-plugin-ssr-dev';
import gfm from 'remark-gfm';
import { cloudflare } from '@cloudflare/vite-plugin';
import { ssg } from './scripts/ssg';
import rehypeStarryNight from 'rehype-starry-night';
import { common } from '@wooorm/starry-night';
import tsx from '@wooorm/starry-night/source.tsx';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	build: {
		minify: 'esbuild',
	},
	define: {
		'import.meta.env.VITE_BUILD_DATE': JSON.stringify(new Date().toISOString()),
	},
	plugins: [
		ssrDevPlugin(),
		tailwindcss(),
		ogImagePlugin(),
		mdxMetadataPlugin(),
		{
			enforce: 'pre',
			...mdx({
				remarkPlugins: [gfm],
				rehypePlugins: [[rehypeStarryNight, { grammars: [...common, tsx] }]],
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
				rollupOptions: {
					input: resolve(__dirname, 'src/entry-client.tsx'),
				},
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
