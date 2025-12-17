import { useMode, MODE_CONFIGS, type PortfolioMode } from '@/lib/mode';
import { Link } from '@/lib/router';
import { Tooltip } from './Tooltip';
import { Globe, Terminal } from 'lucide-react';
import { ReactNode } from 'react';

const modeIcons: Record<PortfolioMode, ReactNode> = {
	web: <Globe className="h-4 w-4" />,
	terminal: <Terminal className="h-4 w-4" />,
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
				<Tooltip key={m} content={MODE_CONFIGS[m].description}>
					<Link
						to={modeRoutes[m]}
						aria-current={mode === m ? 'page' : undefined}
						aria-label={MODE_CONFIGS[m].name}
						className={`inline-flex rounded-md p-2 ${
							mode === m
								? 'bg-accent-600 text-white'
								: 'text-surface-600 hover:bg-surface-200 hover:text-surface-900 hover:scale-105'
						}`}
					>
						{modeIcons[m]}
					</Link>
				</Tooltip>
			))}
		</nav>
	);
}
