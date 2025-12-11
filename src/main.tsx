import { hydrateRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { App } from './App';
import { initAnalytics } from './lib/analytics';
import './styles/global.css';

if (typeof window !== 'undefined') {
	initAnalytics();
}

const container = document.getElementById('root')!;

hydrateRoot(
	container,
	<StrictMode>
		<App />
	</StrictMode>,
);
