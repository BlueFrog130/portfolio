import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseArgs } from 'util';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

interface OgImageOptions {
	title: string;
	subtitle?: string;
	tags?: string[];
	type: 'default' | 'blog' | 'project';
	output: string;
}

function escapeXml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function wrapText(text: string, maxChars: number): string[] {
	const words = text.split(' ');
	const lines: string[] = [];
	let currentLine = '';

	for (const word of words) {
		if ((currentLine + ' ' + word).trim().length <= maxChars) {
			currentLine = (currentLine + ' ' + word).trim();
		} else {
			if (currentLine) lines.push(currentLine);
			currentLine = word;
		}
	}
	if (currentLine) lines.push(currentLine);

	return lines.slice(0, 3); // Max 3 lines
}

function generateBlogSvg(options: OgImageOptions): string {
	const { title, subtitle, tags = [] } = options;
	const titleLines = wrapText(title, 35);
	const subtitleLines = subtitle ? wrapText(subtitle, 60).slice(0, 2) : [];

	// Calculate positions based on content
	const titleStartY = 220;
	const titleLineHeight = 70;
	const subtitleStartY = titleStartY + titleLines.length * titleLineHeight + 20;
	const tagsY = subtitleStartY + subtitleLines.length * 40 + 40;

	const titleSvg = titleLines
		.map(
			(line, i) =>
				`<text x="80" y="${titleStartY + i * titleLineHeight}" font-family="system-ui, -apple-system, sans-serif" font-size="56" font-weight="700" fill="#18181b">${escapeXml(line)}</text>`,
		)
		.join('\n  ');

	const subtitleSvg = subtitleLines
		.map(
			(line, i) =>
				`<text x="80" y="${subtitleStartY + i * 40}" font-family="system-ui, -apple-system, sans-serif" font-size="26" fill="#52525b">${escapeXml(line)}</text>`,
		)
		.join('\n  ');

	// Generate tag pills
	let tagsSvg = '';
	if (tags.length > 0) {
		let xOffset = 0;
		const tagPills = tags.slice(0, 4).map((tag) => {
			const width = Math.max(70, tag.length * 12 + 30);
			const pill = `
      <rect x="${xOffset}" y="0" width="${width}" height="36" rx="18" fill="#e0e7ff"/>
      <text x="${xOffset + width / 2}" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="500" fill="#4338ca" text-anchor="middle">${escapeXml(tag)}</text>`;
			xOffset += width + 10;
			return pill;
		});
		tagsSvg = `<g transform="translate(80, ${tagsY})">${tagPills.join('')}</g>`;
	}

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#fafafa"/>
      <stop offset="100%" style="stop-color:#f4f4f5"/>
    </linearGradient>
    <linearGradient id="accent-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#818cf8"/>
      <stop offset="100%" style="stop-color:#6366f1"/>
    </linearGradient>
    <linearGradient id="blob1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#818cf8;stop-opacity:0.15"/>
      <stop offset="100%" style="stop-color:#6366f1;stop-opacity:0.1"/>
    </linearGradient>
    <linearGradient id="blob2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#a78bfa;stop-opacity:0.12"/>
      <stop offset="100%" style="stop-color:#c084fc;stop-opacity:0.08"/>
    </linearGradient>
    <linearGradient id="blob3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#22d3ee;stop-opacity:0.1"/>
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0.08"/>
    </linearGradient>
    <filter id="blur1" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="60"/>
    </filter>
    <filter id="blur2" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="50"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg-gradient)"/>

  <!-- Decorative blobs -->
  <ellipse cx="150" cy="100" rx="300" ry="250" fill="url(#blob1)" filter="url(#blur1)"/>
  <ellipse cx="1050" cy="150" rx="280" ry="220" fill="url(#blob2)" filter="url(#blur1)"/>
  <ellipse cx="600" cy="550" rx="350" ry="200" fill="url(#blob3)" filter="url(#blur2)"/>

  <!-- Logo badge -->
  <rect x="80" y="80" width="80" height="80" rx="16" fill="url(#accent-gradient)"/>
  <text x="120" y="138" font-family="system-ui, -apple-system, sans-serif" font-size="40" font-weight="700" fill="white" text-anchor="middle">AG</text>

  <!-- Blog label -->
  <text x="180" y="115" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="600" fill="#6366f1">BLOG</text>
  <text x="180" y="140" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="#71717a">Adam Grady</text>

  <!-- Title -->
  ${titleSvg}

  <!-- Subtitle -->
  ${subtitleSvg}

  <!-- Tags -->
  ${tagsSvg}

  <!-- Website URL -->
  <text x="1120" y="580" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="500" fill="#a1a1aa" text-anchor="end">adamgrady.dev</text>
</svg>`;
}

async function generateOgImage(options?: OgImageOptions) {
	let svgBuffer: Buffer;
	let outputPath: string;

	if (!options || options.type === 'default') {
		// Default: convert existing SVG
		const svgPath = join(ROOT, 'public', 'og-image.svg');
		outputPath = options?.output || join(ROOT, 'public', 'og-image.png');
		console.log('Reading SVG...');
		svgBuffer = readFileSync(svgPath);
	} else {
		// Generate dynamic SVG
		outputPath = options.output;
		console.log(`Generating ${options.type} OG image: ${options.title}`);

		const svg =
			options.type === 'blog'
				? generateBlogSvg(options)
				: generateBlogSvg(options); // Can add project-specific later

		svgBuffer = Buffer.from(svg);
	}

	// Ensure output directory exists
	const outputDir = dirname(outputPath);
	if (!existsSync(outputDir)) {
		mkdirSync(outputDir, { recursive: true });
	}

	console.log('Converting to PNG...');
	const pngBuffer = await sharp(svgBuffer)
		.resize(1200, 630)
		.png({ quality: 90 })
		.toBuffer();

	writeFileSync(outputPath, pngBuffer);
	console.log(`Generated: ${outputPath}`);
}

// Parse CLI arguments
const { values } = parseArgs({
	options: {
		title: { type: 'string', short: 't' },
		subtitle: { type: 'string', short: 's' },
		tags: { type: 'string' },
		type: { type: 'string', default: 'default' },
		output: { type: 'string', short: 'o' },
		help: { type: 'boolean', short: 'h' },
	},
	strict: true,
	allowPositionals: false,
});

if (values.help) {
	console.log(`
Usage: pnpm og-image [options]

Options:
  -t, --title     Title text (required for blog/project types)
  -s, --subtitle  Subtitle or description text
  --tags          Comma-separated tags (e.g., "React,TypeScript,Vite")
  --type          Image type: default, blog, project (default: "default")
  -o, --output    Output file path (default: public/og-image.png)
  -h, --help      Show this help message

Examples:
  pnpm og-image
    Generate default OG image from public/og-image.svg

  pnpm og-image --type blog --title "My Blog Post" --subtitle "Description" --tags "React,TypeScript" -o public/og/blog/my-post.png
    Generate a blog post OG image
`);
	process.exit(0);
}

// Build options from CLI args
const cliOptions: OgImageOptions | undefined =
	values.type && values.type !== 'default'
		? {
				title: values.title || 'Untitled',
				subtitle: values.subtitle,
				tags: values.tags?.split(',').map((t) => t.trim()),
				type: values.type as 'blog' | 'project',
				output:
					values.output || join(ROOT, 'public', 'og', values.type, 'image.png'),
			}
		: values.output
			? {
					title: '',
					type: 'default',
					output: values.output,
				}
			: undefined;

generateOgImage(cliOptions).catch((err) => {
	console.error('Failed to generate OG image:', err);
	process.exit(1);
});
