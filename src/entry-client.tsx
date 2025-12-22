import { hydrateRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { App } from './App';
import './styles/global.css';
import './styles/starry-night.css';

const container = document.getElementById('root')!;

hydrateRoot(
	container,
	<StrictMode>
		<App />
	</StrictMode>,
);
