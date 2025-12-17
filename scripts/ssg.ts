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
const BASE_URL = process.env.VITE_BASE_URL;

interface RenderResult {
	html: string;
	head: string;
}

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

interface RouteMapping {
	pattern: RegExp;
	source: string;
	contentSource?: (path: string) => string | null;
}

/**
 * Build route mappings dynamically from manifest
 * Discovers page sources and content sources automatically
 */
function buildRouteMappings(manifest: Manifest): RouteMapping[] {
	const mappings: RouteMapping[] = [];
	const contentDirs = new Map<string, string[]>(); // dir name -> list of slugs

	// First pass: discover all content files
	for (const src of Object.keys(manifest)) {
		const contentMatch = src.match(
			/^src\/content\/([^/]+)\/([^/]+)\.(mdx|md)$/,
		);
		if (contentMatch) {
			const dirName = contentMatch[1];
			const slug = contentMatch[2];
			if (!contentDirs.has(dirName)) {
				contentDirs.set(dirName, []);
			}
			contentDirs.get(dirName)!.push(slug);
		}
	}

	// Second pass: build route mappings from pages
	for (const src of Object.keys(manifest)) {
		// Match page components: src/pages/**/+Page.tsx
		const pageMatch = src.match(/^src\/pages\/(.+\/)?(\+Page\.tsx)$/);
		if (pageMatch) {
			// Remove trailing slash from captured path
			const pagePath = (pageMatch[1] || '').replace(/\/$/, '');

			if (!pagePath) {
				// Root page: src/pages/+Page.tsx -> /
				mappings.push({
					pattern: /^\/$/,
					source: src,
				});
			} else if (pagePath.includes('[') && pagePath.includes(']')) {
				// Dynamic route: src/pages/project/[slug]/+Page.tsx
				const paramMatch = pagePath.match(/^(.+)\/\[([^\]]+)\]$/);
				if (paramMatch) {
					const basePath = paramMatch[1]; // e.g., "project"

					// Find matching content directory (try both singular and plural forms)
					let contentDir: string | null = null;
					const possibleDirs = [
						basePath,
						basePath + 's',
						basePath.replace(/s$/, ''),
					];
					for (const dir of possibleDirs) {
						if (contentDirs.has(dir)) {
							contentDir = dir;
							break;
						}
					}

					// The URL path might be different from file path
					// Try to infer from content directory (e.g., "projects" content -> "/projects" URL)
					const urlBasePath = contentDir || basePath;

					mappings.push({
						pattern: new RegExp(`^\\/${urlBasePath}\\/([^/]+)$`),
						source: src,
						contentSource: contentDir
							? (path: string) => {
									const slug = path.replace(
										new RegExp(`^\\/${urlBasePath}\\/`),
										'',
									);
									return `src/content/${contentDir}/${slug}.mdx`;
								}
							: undefined,
					});
				}
			} else {
				// Static route: src/pages/terminal/+Page.tsx -> /terminal
				mappings.push({
					pattern: new RegExp(`^\\/${pagePath}$`),
					source: src,
				});
			}
		}
	}

	return mappings;
}

/**
 * Find the manifest source for a given URL path
 */
function findRouteSource(
	path: string,
	mappings: RouteMapping[],
): { source: string; contentSource: string | null } | null {
	for (const mapping of mappings) {
		if (mapping.pattern.test(path)) {
			return {
				source: mapping.source,
				contentSource: mapping.contentSource
					? mapping.contentSource(path)
					: null,
			};
		}
	}
	return null;
}

/**
 * Get all modules that should be preloaded for a given route
 */
function getModulePreloads(
	path: string,
	manifest: Manifest,
	routeMappings: RouteMapping[],
): string[] {
	const preloads = new Set<string>();

	// Find the route source for this path
	const route = findRouteSource(path, routeMappings);
	if (!route) return [];

	// Recursively collect all imports
	function collectImports(key: string, visited = new Set<string>()) {
		if (visited.has(key)) return;
		visited.add(key);

		const entry = manifest[key];
		if (!entry) return;

		// Add the file itself (except for the main entry which is already loaded as script)
		if (!entry.isEntry) {
			preloads.add(entry.file);
		}

		// Collect imports recursively
		if (entry.imports) {
			for (const imp of entry.imports) {
				collectImports(imp, visited);
			}
		}
	}

	// Start from the route's source
	collectImports(route.source);

	// Also preload content if applicable (e.g., MDX files for project pages)
	if (route.contentSource) {
		collectImports(route.contentSource);
	}

	return [...preloads];
}

/**
 * Generate head tags for stylesheets and module preloads
 */
function generateHeadTags(modules: string[], stylesheets: string[]): string {
	const cssLinks = stylesheets
		.map((file) => `<link rel="stylesheet" href="/${file}">`)
		.join('\n\t');
	const modulePreloads = modules
		.map((file) => `<link rel="modulepreload" href="/${file}">`)
		.join('\n\t');

	return [cssLinks, modulePreloads].filter(Boolean).join('\n\t');
}

/**
 * Extract internal links from rendered HTML
 * Finds all href attributes that start with "/"
 */
function extractLinks(html: string): string[] {
	const linkRegex = /href="(\/[^"#]*)"/g;
	const links: string[] = [];
	let match;

	const ignoredExtensions = [
		'.css',
		'.js',
		'.svg',
		'.png',
		'.jpg',
		'.jpeg',
		'.gif',
		'.ico',
		'.woff',
		'.woff2',
		'.ttf',
		'.eot',
		'.json',
		'.xml',
		'.txt',
		'.pdf',
	];

	while ((match = linkRegex.exec(html)) !== null) {
		let path = match[1];

		// Skip asset files
		const hasExtension = ignoredExtensions.some((ext) =>
			path.toLowerCase().endsWith(ext),
		);
		if (hasExtension) continue;
		if (path.startsWith('/assets/')) continue;

		// Normalize the path (remove trailing slashes except for root)
		if (path !== '/' && path.endsWith('/')) {
			path = path.slice(0, -1);
		}
		links.push(path);
	}

	return [...new Set(links)];
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
 * Extract sitemap metadata from rendered HTML
 */
function extractSitemapMeta(html: string): {
	priority: string;
	changefreq: string;
} {
	const priorityMatch = html.match(
		/<meta\s+name="sitemap:priority"\s+content="([^"]+)"/,
	);
	const changefreqMatch = html.match(
		/<meta\s+name="sitemap:changefreq"\s+content="([^"]+)"/,
	);

	return {
		priority: priorityMatch?.[1] ?? '0.5',
		changefreq: changefreqMatch?.[1] ?? 'monthly',
	};
}

/**
 * Generate sitemap.xml content
 */
function generateSitemap(
	pages: { path: string; html: string }[],
	baseUrl: string,
): string {
	const today = new Date().toISOString().split('T')[0];

	// Filter out 404 page and sort pages
	const sitemapPages = pages
		.filter((p) => p.path !== '/404')
		.sort((a, b) => {
			// Root page first
			if (a.path === '/') return -1;
			if (b.path === '/') return 1;
			return a.path.localeCompare(b.path);
		});

	const urls = sitemapPages.map((page) => {
		// Extract priority and changefreq from page meta tags
		const { priority, changefreq } = extractSitemapMeta(page.html);
		const fullUrl = `${baseUrl}${page.path === '/' ? '' : page.path}`;

		return `  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
	});

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
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

export async function ssg() {
	if (!BASE_URL) {
		throw new Error('VITE_BASE_URL is not defined in environment variables.');
	}

	console.log('Starting SSG build with auto-crawling...\n');

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
	const { render }: { render: (path: string) => Promise<RenderResult> } =
		await import(serverEntryPath);

	// Read the template HTML from index.html (source)
	const templatePath = join(ROOT, 'index.html');
	let template = readFileSync(templatePath, 'utf-8');

	// Read manifest to get asset paths
	const manifestPath = join(CLIENT_DIR, '.vite', 'manifest.json');
	let scripts: string[] = [];
	let styles: string[] = [];
	let manifest: Manifest = {};

	if (existsSync(manifestPath)) {
		manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));

		for (const [key, entry] of Object.entries(manifest)) {
			if (entry.isEntry || key.includes('main.tsx')) {
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

	template = template.replace(
		'<script type="module" src="/src/main.tsx"></script>',
		scriptTags,
	);

	// Build route mappings from manifest
	const routeMappings = buildRouteMappings(manifest);

	console.log(`  Scripts: ${scripts.join(', ') || '(none)'}`);
	console.log(`  Styles: ${styles.join(', ') || '(none)'}`);
	console.log(`  Routes discovered: ${routeMappings.length}`);
	for (const mapping of routeMappings) {
		console.log(
			`    - ${mapping.pattern.source} -> ${mapping.source}${mapping.contentSource ? ' (with content)' : ''}`,
		);
	}
	console.log('');

	// Auto-crawl starting from root
	const visited = new Set<string>();
	const queue: string[] = ['/'];
	const pages: { path: string; html: string }[] = [];

	console.log('Crawling pages...\n');

	while (queue.length > 0) {
		const path = queue.shift()!;

		if (visited.has(path)) continue;
		visited.add(path);

		console.log(`  -> Rendering ${path}`);

		// Render the page - returns { html, head }
		const { html, head } = await render(path);

		// Get head tags (stylesheets + modulepreloads) for this route
		const preloads = getModulePreloads(path, manifest, routeMappings);
		const headTags = generateHeadTags(preloads, styles);

		// Inject content into template
		const pageHtml = template
			.replace('<!--app-html-->', html)
			.replace('<!--app-head-->', `${head}\n\t${headTags}`);

		// Extract links from rendered HTML
		const links = extractLinks(pageHtml);

		for (const link of links) {
			if (!visited.has(link)) {
				queue.push(link);
			}
		}

		pages.push({ path, html: pageHtml });
	}

	// Render 404 page (not discoverable via crawling)
	console.log(`  -> Rendering /404`);
	const { html: notFoundBody, head: notFoundHead } = await render('/404');
	const notFoundPreloads = getModulePreloads('/404', manifest, routeMappings);
	const notFoundHeadTags = generateHeadTags(notFoundPreloads, styles);
	const notFoundHtml = template
		.replace('<!--app-html-->', notFoundBody)
		.replace('<!--app-head-->', `${notFoundHead}\n\t${notFoundHeadTags}`);
	pages.push({ path: '/404', html: notFoundHtml });

	console.log(`\nGenerated ${pages.length} pages:\n`);

	// Write all pages
	for (const { path, html } of pages) {
		if (path === '/404') {
			writeFileSync(join(OUTPUT_DIR, '404.html'), html, 'utf-8');
			console.log(`  - /404.html`);
		} else {
			writeHtmlFile(path, html);
			console.log(`  - ${path === '/' ? '/index.html' : path + '/index.html'}`);
		}
	}

	// Generate sitemap.xml
	console.log('\nGenerating sitemap.xml...');
	const sitemapContent = generateSitemap(pages, BASE_URL);
	writeFileSync(join(OUTPUT_DIR, 'sitemap.xml'), sitemapContent, 'utf-8');
	console.log(`  - /sitemap.xml (${pages.length - 1} URLs)`);

	// Generate robots.txt
	const robotsContent = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;
	writeFileSync(join(OUTPUT_DIR, 'robots.txt'), robotsContent, 'utf-8');
	console.log(`  - /robots.txt`);

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
