import { createRoot, hydrateRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { App } from './App';
import { initAnalytics } from './lib/analytics';
import './styles/global.css';

if (typeof window !== 'undefined') {
	initAnalytics();
}

const container = document.getElementById('root')!;

// Check if we have pre-rendered content to hydrate
if (container.hasChildNodes()) {
	hydrateRoot(
		container,
		<StrictMode>
			<App />
		</StrictMode>,
	);
} else {
	// Client-side only rendering (dev mode)
	createRoot(container).render(
		<StrictMode>
			<App />
		</StrictMode>,
	);
}
