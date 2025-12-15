import { Plugin, transformWithEsbuild } from 'vite';
import { readFileSync } from 'fs';

const METADATA_QUERY = '?metadata';
const VIRTUAL_PREFIX = '\0';

export function mdxMetadataPlugin(): Plugin {
	return {
		name: 'mdx-metadata',
		enforce: 'pre',

		resolveId(id, importer) {
			if (id.endsWith(METADATA_QUERY)) {
				// Remove the query and resolve the actual file
				const actualId = id.slice(0, -METADATA_QUERY.length);
				return this.resolve(actualId, importer).then((resolved) => {
					if (resolved) {
						// Add virtual prefix so MDX plugin skips this
						return VIRTUAL_PREFIX + resolved.id + METADATA_QUERY;
					}
				});
			}
		},

		async load(id) {
			if (id.startsWith(VIRTUAL_PREFIX) && id.endsWith(METADATA_QUERY)) {
				const actualPath = id.slice(
					VIRTUAL_PREFIX.length,
					-METADATA_QUERY.length,
				);
				const content = readFileSync(actualPath, 'utf-8');

				// Extract import statements (to support imports used in metadata)
				const importMatches = content.match(
					/^import\s+.+\s+from\s+['"][^'"]+['"];?\s*$/gm,
				);
				const imports = importMatches ? importMatches.join('\n') : '';

				// Extract the metadata export block
				const match = content.match(
					/export\s+const\s+metadata\s*=\s*(\{[\s\S]*?\n\});/,
				);

				if (!match) {
					throw new Error(`No metadata export found in ${actualPath}`);
				}

				// Perform read time calculation
				const words = content
					.replace(/<[^>]+>/g, '') // Remove HTML tags
					.replace(/```[\s\S]*?```/g, '') // Remove code blocks
					// Remove import/export statements
					.replace(/^import\s+.+\s+from\s+['"][^'"]+['"];?\s*$/gm, '')
					.replace(
						/^export\s+const\s+([A-Za-z0-9_]+)\s*=\s*\{[\s\S]*?\n\};/m,
						'',
					)
					.split(/\s+/).length;

				const readTime = Math.ceil(words / 200); // Assuming 200 WPM

				const jsxCode = `
import React from 'react';
${imports}

const metadata = ${match[1]};
metadata.readTime = ${readTime};
export default metadata;
`;

				// Transform JSX to JS using esbuild
				const result = await transformWithEsbuild(jsxCode, 'metadata.tsx', {
					jsx: 'automatic',
					loader: 'tsx',
				});

				return result.code;
			}
		},

		handleHotUpdate({ file, server, modules }) {
			// When an MDX file changes, also invalidate its metadata module
			if (file.endsWith('.mdx')) {
				const metadataModuleId = VIRTUAL_PREFIX + file + METADATA_QUERY;
				const metadataModule =
					server.moduleGraph.getModuleById(metadataModuleId);
				if (metadataModule) {
					return [...modules, metadataModule];
				}
			}
		},
	};
}
