import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import tsConfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		tsConfigPaths(),
		tanstackStart({
			prerender: {
				enabled: true,
				crawlLinks: true
			},
			sitemap: {
				host: 'https://your-domain.com' // Replace with your actual domain
			},
			router: {}
		}),
		tailwindcss(),
		react({
			babel: {
				plugins: [['babel-plugin-react-compiler']]
			}
		}),
		VitePWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'Adam Grady Portfolio',
				short_name: 'Adam Grady',
				start_url: '/',
				display: 'standalone',
				background_color: '#ffffff',
				theme_color: '#fbbf24',
				icons: [
					{
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any'
					},
					{
						src: 'maskable-icon-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable'
					},
					{
						src: 'pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: 'pwa-64x64.png',
						sizes: '64x64',
						type: 'image/png'
					}
				]
			}
		})
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src')
		}
	}
});
