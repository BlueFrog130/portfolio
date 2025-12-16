import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

export type PreloadableComponent<T extends ComponentType<any>> =
	LazyExoticComponent<T> & { preload: () => Promise<{ default: T }> };

export function lazyWithPreload<T extends ComponentType<any>>(
	importFn: () => Promise<{ default: T }>,
): PreloadableComponent<T> {
	const LazyComponent = lazy(importFn) as PreloadableComponent<T>;
	LazyComponent.preload = importFn;
	return LazyComponent;
}
