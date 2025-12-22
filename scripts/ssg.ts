import {
	readFileSync,
	writeFileSync,
	mkdirSync,
	existsSync,
	copyFileSync,
	readdirSync,
	statSync,
	rmSync,
} from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import 'dotenv/config';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const CLIENT_DIR = join(ROOT, 'dist', 'client');
const SERVER_DIR = join(ROOT, 'dist', 'ssg');
const WORKER_DIR = join(ROOT, 'dist', 'server');
const OUTPUT_DIR = join(ROOT, 'dist', 'static');

interface ManifestEntry {
	file: string;
	name?: string;
	src?: string;
	isEntry?: boolean;
	isDynamicEntry?: boolean;
	imports?: string[];
	dynamicImports?: string[];
	css?: string[];
}

type Manifest = Record<string, ManifestEntry>;

export async function ssg() {
	// Clear output directory
	if (existsSync(OUTPUT_DIR)) {
		console.log('Clearing output directory...');
		rmSync(OUTPUT_DIR, { recursive: true });
	}
	mkdirSync(OUTPUT_DIR, { recursive: true });

	// Import the server entry (use file:// URL for Windows compatibility)
	const serverEntryPath = pathToFileURL(
		join(SERVER_DIR, 'entry-server.js'),
	).href;
	const {
		render,
		renderServerRoute,
		entries,
	}: {
		render: (
			path: string,
			options?: { manifest?: Manifest },
		) => Promise<{ html: string; head: string }>;
		renderServerRoute: (path: string) => Promise<string | null>;
		entries: () => { path: string; mode: 'page' | 'server' }[];
	} = await import(serverEntryPath);

	// Read manifest to get asset paths
	const manifestPath = join(CLIENT_DIR, '.vite', 'manifest.json');
	let scripts: string[] = [];
	let styles: string[] = [];
	let manifest: Manifest = {};

	if (existsSync(manifestPath)) {
		manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));

		for (const [_, entry] of Object.entries(manifest)) {
			if (entry.isEntry) {
				scripts.push(entry.file);
				if (entry.css) {
					styles.push(...entry.css);
				}
			}
		}
	}

	// Replace dev script with production script (styles go in head via generateHeadTags)
	const scriptTags = scripts
		.map((s) => `<script type="module" src="/${s}"></script>`)
		.join('\n\t');

	const allEntries = entries();

	// Read the template HTML from index.html (source)
	const templatePath = join(ROOT, 'index.html');
	let template = readFileSync(templatePath, 'utf-8');

	template = template.replace(
		'<script type="module" src="/src/entry-client.tsx"></script>',
		scriptTags,
	);

	// Start rendering entries
	for (const entry of allEntries) {
		if (entry.mode === 'page') {
			console.log(`  -> Rendering page: ${entry.path}`);
			const { html, head } = await render(entry.path, { manifest });

			const pageHtml = template
				.replace('<!--app-html-->', html)
				.replace('<!--app-head-->', `${head}`);
			// Determine output file path
			let outputPath =
				entry.path === '/'
					? join(OUTPUT_DIR, 'index.html')
					: entry.path === '*'
						? join(OUTPUT_DIR, '404.html')
						: join(OUTPUT_DIR, entry.path, 'index.html');
			mkdirSync(dirname(outputPath), { recursive: true });
			writeFileSync(outputPath, pageHtml, 'utf-8');
		} else if (entry.mode === 'server') {
			console.log(`  -> Rendering server route: ${entry.path}`);
			const result = await renderServerRoute(entry.path);

			if (result !== null) {
				// Determine output file path
				let outputPath = join(OUTPUT_DIR, entry.path);
				if (outputPath.endsWith('/')) {
					outputPath = join(outputPath, 'index.html');
				}
				mkdirSync(dirname(outputPath), { recursive: true });
				writeFileSync(outputPath, result, 'utf-8');
			}
		}
	}

	// Copy static assets from client build
	console.log('\nCopying static assets...');
	copyDir(join(CLIENT_DIR, 'assets'), join(OUTPUT_DIR, 'assets'));

	// Copy any public files
	const publicDir = join(ROOT, 'public');
	if (existsSync(publicDir)) {
		copyDir(publicDir, OUTPUT_DIR);
	}

	// Update wrangler.json to point to static assets directory
	const wranglerPath = join(WORKER_DIR, 'wrangler.json');
	if (existsSync(wranglerPath)) {
		console.log('\nUpdating wrangler.json assets directory...');
		const wranglerConfig = JSON.parse(readFileSync(wranglerPath, 'utf-8'));
		if (wranglerConfig.assets) {
			wranglerConfig.assets.directory = '../static';
		}
		writeFileSync(
			wranglerPath,
			JSON.stringify(wranglerConfig, null, 2),
			'utf-8',
		);
	}

	console.log('\nSSG build complete!');
	console.log(`Output: ${OUTPUT_DIR}`);
}

/**
 * Copy directory recursively
 */
function copyDir(src: string, dest: string): void {
	if (!existsSync(src)) return;

	if (!existsSync(dest)) {
		mkdirSync(dest, { recursive: true });
	}

	const entries = readdirSync(src);

	for (const entry of entries) {
		const srcPath = join(src, entry);
		const destPath = join(dest, entry);
		const stat = statSync(srcPath);

		if (stat.isDirectory()) {
			copyDir(srcPath, destPath);
		} else {
			copyFileSync(srcPath, destPath);
		}
	}
}
