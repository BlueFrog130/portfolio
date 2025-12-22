import type { Route } from './lib/router';
import { lazyWithPreload } from './lib/router';
import { PageOptions } from './lib/router/types';

// Eagerly load +Page.options.ts
const optionImports = import.meta.glob<PageOptions>(
	'./pages/**/+Page.options.{ts,tsx}',
	{ eager: true },
);

// Lazily load +Page.tsx components with preload capability
const pageImports = import.meta.glob<{ default: React.ComponentType<any> }>(
	'./pages/**/+Page.tsx',
	{ eager: false },
);

const importToPath = (importPath: string) => {
	const relativePath = importPath
		.replace('./pages', '')
		.replace('+Page.tsx', '');
	return relativePath;
};

// Combine options and page components into route definitions
export const routes: (Route & { src: string })[] = Object.entries(pageImports)
	.map(([path, module]) => {
		let optionsPath = path.replace('+Page.tsx', '+Page.options.ts');
		let options = optionImports[optionsPath];

		if (!options) {
			options = optionImports[optionsPath.replace('.ts', '.tsx')] || {};
		}

		const routePath = importToPath(path);

		return {
			...options,
			path: routePath === '/404/' ? '*' : routePath,
			component: lazyWithPreload(module),
			src: path,
		};
	})
	.sort((a, b) => {
		if (a.path === '*') return 1;
		if (b.path === '*') return -1;
		return 0;
	}); // Ensure * route is last
