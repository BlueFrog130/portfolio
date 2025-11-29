/// <reference types="vite/client" />
/// <reference types="react/canary" />

declare module '*.mdx' {
	import type { ComponentType, ReactNode } from 'react';

	export const metadata: {
		slug: string;
		title: string;
		description: ReactNode;
		technologies: string[];
		link?: string;
		github?: string;
		featured?: boolean;
	};

	const MDXContent: ComponentType;
	export default MDXContent;
}

declare module '*.mdx?metadata' {
	import type { ReactNode } from 'react';

	const metadata: {
		slug: string;
		title: string;
		description: ReactNode;
		technologies: string[];
		link?: string;
		github?: string;
		featured?: boolean;
	};

	export default metadata;
}
