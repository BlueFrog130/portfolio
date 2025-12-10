import {
	readFileSync,
	writeFileSync,
	mkdirSync,
	existsSync,
	copyFileSync,
	readdirSync,
	statSync,
	rmdirSync,
} from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const CLIENT_DIR = join(ROOT, 'dist', 'client');
const SERVER_DIR = join(ROOT, 'dist', 'ssg');
const WORKER_DIR = join(ROOT, 'dist', 'server');
const OUTPUT_DIR = join(ROOT, 'dist', 'static');

/**
 * Extract internal links from rendered HTML
 * Finds all href attributes that start with "/"
 */
function extractLinks(html: string): string[] {
	const linkRegex = /href="(\/[^"#]*)"/g;
	const links: string[] = [];
	let match;

	while ((match = linkRegex.exec(html)) !== null) {
		// Normalize the path (remove trailing slashes except for root)
		let path = match[1];
		if (path !== '/' && path.endsWith('/')) {
			path = path.slice(0, -1);
		}
		links.push(path);
	}

	// Return unique links
	return [...new Set(links)];
}

/**
 * Inject rendered HTML into the template
 */
function injectHtml(template: string, html: string): string {
	return template.replace(
		'<div id="root"></div>',
		`<div id="root">${html}</div>`,
	);
}

/**
 * Write HTML file to the appropriate output path
 */
function writeHtmlFile(path: string, fullHtml: string): void {
	const outputPath =
		path === '/'
			? join(OUTPUT_DIR, 'index.html')
			: join(OUTPUT_DIR, path, 'index.html');

	const outputDir = dirname(outputPath);
	if (!existsSync(outputDir)) {
		mkdirSync(outputDir, { recursive: true });
	}

	writeFileSync(outputPath, fullHtml, 'utf-8');
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

async function main() {
	console.log('Starting SSG build with auto-crawling...\n');

	// Clear output directory
	if (existsSync(OUTPUT_DIR)) {
		console.log('Clearing output directory...');
		rmdirSync(OUTPUT_DIR, { recursive: true });
	}
	mkdirSync(OUTPUT_DIR, { recursive: true });

	// Import the server entry (use file:// URL for Windows compatibility)
	const serverEntryPath = pathToFileURL(
		join(SERVER_DIR, 'entry-server.js'),
	).href;
	const { render }: { render: (path: string) => Promise<string> } =
		await import(serverEntryPath);

	// Read the template HTML
	const templatePath = join(CLIENT_DIR, 'index.html');
	const template = readFileSync(templatePath, 'utf-8');

	// Auto-crawl starting from root
	const visited = new Set<string>();
	const queue: string[] = ['/'];
	const pages: { path: string; html: string }[] = [];

	console.log('Crawling pages...\n');

	while (queue.length > 0) {
		const path = queue.shift()!;

		// Skip if already visited
		if (visited.has(path)) continue;
		visited.add(path);

		console.log(`  -> Rendering ${path}`);

		// Render the page
		const html = await render(path);

		// Extract links from rendered HTML
		const links = extractLinks(html);

		// Add new links to queue
		for (const link of links) {
			if (!visited.has(link)) {
				queue.push(link);
			}
		}

		// Store the page for writing
		pages.push({ path, html });
	}

	// Render 404 page (not discoverable via crawling)
	console.log(`  -> Rendering /404`);
	const notFoundHtml = await render('/404');
	pages.push({ path: '/404', html: notFoundHtml });

	console.log(`\nGenerated ${pages.length} pages:\n`);

	// Write all pages
	for (const { path, html } of pages) {
		const fullHtml = injectHtml(template, html);

		// 404 page gets written as 404.html at root, not 404/index.html
		if (path === '/404') {
			writeFileSync(join(OUTPUT_DIR, '404.html'), fullHtml, 'utf-8');
			console.log(`  - /404.html`);
		} else {
			writeHtmlFile(path, fullHtml);
			console.log(`  - ${path === '/' ? '/index.html' : path + '/index.html'}`);
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
		writeFileSync(wranglerPath, JSON.stringify(wranglerConfig, null, 2), 'utf-8');
	}

	console.log('\nSSG build complete!');
	console.log(`Output: ${OUTPUT_DIR}`);
}

main().catch((err) => {
	console.error('SSG build failed:', err);
	process.exit(1);
});
