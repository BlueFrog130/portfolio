/// <reference types="vite/client" />
import { seo } from '@/lib/seo';
import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import appCss from '../index.css?url';

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: 'utf-8'
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1'
			},
			...seo({
				title: 'Adam Grady - Software Engineer',
				description:
					'Portfolio of Adam Grady, a Software Engineer specializing in modern web applications.',
				keywords: 'Adam Grady, Software Engineer, Portfolio',
				image: '/logo.svg'
			}),
			{
				name: 'theme-color',
				content: '#fbbf24'
			}
		],
		links: [
			{ rel: 'stylesheet', href: appCss },
			{
				rel: 'icon',
				href: '/favicon.ico',
				sizes: '48x48',
			},
			{
				rel: 'icon',
				href: '/logo.svg',
				sizes: 'any',
				type: 'image/svg+xml'
			},
			{
				rel: 'apple-touch-icon',
				href: '/apple-touch-icon-180x180.png',
				sizes: '180x180',
				type: 'image/png'
			},
			{
				rel: 'mask-icon',
				href: '/logo.svg',
				color: '#000000'
			}
		]
	}),
	component: RootComponent
});

function RootComponent() {
	return (
		<RootDocument>
			<Outlet />
		</RootDocument>
	);
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html className="scroll-smooth">
			<head>
				<HeadContent />
			</head>
			<body className="dark antialiased">
				{children}
				<Scripts />
			</body>
		</html>
	);
}
