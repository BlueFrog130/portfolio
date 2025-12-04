export type PortfolioMode = 'web' | 'terminal';

export interface ModeConfig {
	id: PortfolioMode;
	name: string;
	description: string;
	path: string;
}

export const MODE_CONFIGS: Record<PortfolioMode, ModeConfig> = {
	web: {
		id: 'web',
		name: 'Web',
		description: 'Standard portfolio view',
		path: '/',
	},
	terminal: {
		id: 'terminal',
		name: 'Terminal',
		description: 'CLI-style interface',
		path: '/terminal',
	},
};

export const MODES: PortfolioMode[] = ['web', 'terminal'];
