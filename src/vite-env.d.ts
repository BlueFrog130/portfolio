/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_APP_TITLE: string;
	// Add more env variables as needed
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

// Extend Vite's glob import types for our specific use case
declare module '*' {
	interface ImportMeta {
		glob<T = unknown>(
			pattern: string,
			options?: {
				eager?: boolean;
				import?: string;
				as?: string;
			}
		): Record<string, T>;
	}
}
