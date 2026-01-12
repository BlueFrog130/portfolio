import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
	children: ReactNode;
}

const grainSvg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`;

export function Layout({ children }: LayoutProps) {
	return (
		<div className="relative min-h-screen flex flex-col">
			{/* Grain texture overlay */}
			<div
				className="pointer-events-none fixed inset-0 z-9999 opacity-[0.035] animate-grain"
				style={{ backgroundImage: grainSvg }}
				aria-hidden="true"
			/>
			{/* Skip link for accessibility */}
			<a
				href="#main-content"
				className="absolute -top-12 left-4 z-50 rounded-md bg-accent-500 px-4 py-2 font-semibold text-surface-950 transition-transform duration-200 focus:top-4"
			>
				Skip to main content
			</a>
			<Header />
			<main id="main-content" className="flex-1">
				{children}
			</main>
			<Footer />
		</div>
	);
}
