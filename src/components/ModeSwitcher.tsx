'use client';

import { useMode, MODE_CONFIGS, type PortfolioMode } from '@/lib/mode';
import { Link } from '@/lib/router';
import { ReactNode } from 'react';

const modeIcons: Record<PortfolioMode, ReactNode> = {
	web: (
		<svg
			className="h-4 w-4"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="12" cy="12" r="10" />
			<line x1="2" y1="12" x2="22" y2="12" />
			<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
		</svg>
	),
	terminal: (
		<svg
			className="h-4 w-4"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<polyline points="4 17 10 11 4 5" />
			<line x1="12" y1="19" x2="20" y2="19" />
		</svg>
	),
};

const modeRoutes: Record<PortfolioMode, string> = {
	web: '/',
	terminal: '/terminal',
};

export function ModeSwitcher() {
	const { mode } = useMode();

	return (
		<nav
			className="flex items-center gap-1 rounded-lg bg-surface-100 p-1"
			aria-label="Portfolio mode"
		>
			{(['web', 'terminal'] as const).map((m) => (
				<Link
					key={m}
					to={modeRoutes[m]}
					aria-current={mode === m ? 'page' : undefined}
					aria-label={MODE_CONFIGS[m].name}
					title={MODE_CONFIGS[m].description}
					className={`rounded-md p-2 transition-colors ${
						mode === m
							? 'bg-accent-600 text-white'
							: 'text-surface-600 hover:bg-surface-200 hover:text-surface-900'
					}`}
				>
					{modeIcons[m]}
				</Link>
			))}
		</nav>
	);
}
