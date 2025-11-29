import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import mdx from '@mdx-js/rollup';
import { mdxMetadataPlugin } from './vite-plugin-mdx-metadata';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [
		tailwindcss(),
		mdxMetadataPlugin(),
		{ enforce: 'pre', ...mdx() },
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
});
