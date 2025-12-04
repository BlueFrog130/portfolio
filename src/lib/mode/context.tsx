import { useRouter } from '@/lib/router';
import type { PortfolioMode } from './types';
import { MODE_CONFIGS } from './types';

function getModeFromPath(path: string): PortfolioMode {
	if (path.startsWith('/terminal')) return 'terminal';
	if (path.startsWith('/chat')) return 'ai';
	return 'web';
}

export function useMode() {
	const { path, navigate } = useRouter();
	const mode = getModeFromPath(path);

	const setMode = (newMode: PortfolioMode) => {
		navigate(MODE_CONFIGS[newMode].path);
	};

	return { mode, setMode };
}

export function useModeConfig() {
	const { mode } = useMode();
	return MODE_CONFIGS[mode];
}
