import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
	children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
	return (
		<div className="min-h-screen flex flex-col">
			<a href="#main-content" className="skip-link">
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
