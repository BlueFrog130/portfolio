import { Plugin } from 'vite';
import sharp from 'sharp';
import { createHash } from 'crypto';

const VIRTUAL_PREFIX = 'virtual:og-image';

interface OgImageParams {
	title: string;
	description?: string;
	tags?: string[];
	type?: 'blog' | 'project';
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

	return lines.slice(0, 3);
}

function generateSvg(params: OgImageParams): string {
	const { title, description, tags = [], type = 'blog' } = params;
	const titleLines = wrapText(title, 35);
	const descriptionLines = description
		? wrapText(description, 60).slice(0, 2)
		: [];

	const titleStartY = 220;
	const titleLineHeight = 70;
	const descriptionStartY =
		titleStartY + titleLines.length * titleLineHeight + 20;
	const tagsY = descriptionStartY + descriptionLines.length * 40 + 40;

	const titleSvg = titleLines
		.map(
			(line, i) =>
				`<text x="80" y="${titleStartY + i * titleLineHeight}" font-family="system-ui, -apple-system, sans-serif" font-size="56" font-weight="700" fill="#18181b">${escapeXml(line)}</text>`,
		)
		.join('\n  ');

	const descriptionSvg = descriptionLines
		.map(
			(line, i) =>
				`<text x="80" y="${descriptionStartY + i * 40}" font-family="system-ui, -apple-system, sans-serif" font-size="26" fill="#52525b">${escapeXml(line)}</text>`,
		)
		.join('\n  ');

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

	const typeLabel = type === 'blog' ? 'BLOG' : 'PROJECT';

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

  <!-- Type label -->
  <text x="180" y="115" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="600" fill="#6366f1">${typeLabel}</text>
  <text x="180" y="140" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="#71717a">Adam Grady</text>

  <!-- Title -->
  ${titleSvg}

  <!-- Description -->
  ${descriptionSvg}

  <!-- Tags -->
  ${tagsSvg}

  <!-- Website URL -->
  <text x="1120" y="580" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="500" fill="#a1a1aa" text-anchor="end">adamgrady.dev</text>
</svg>`;
}

function parseParams(query: string): OgImageParams {
	const params = new URLSearchParams(query);
	return {
		title: params.get('title') || 'Untitled',
		description: params.get('description') || undefined,
		tags: params.get('tags')?.split(',').filter(Boolean) || undefined,
		type: (params.get('type') as 'blog' | 'project') || 'blog',
	};
}

function generateHash(params: OgImageParams): string {
	const content = JSON.stringify(params);
	return createHash('md5').update(content).digest('hex').slice(0, 8);
}

export function ogImagePlugin(): Plugin {
	let isDev = false;

	return {
		name: 'og-image',
		enforce: 'pre',

		configResolved(config) {
			isDev = config.command === 'serve';
		},

		resolveId(id) {
			if (id.startsWith(VIRTUAL_PREFIX)) {
				return '\0' + id;
			}
		},

		async load(id) {
			if (!id.startsWith('\0' + VIRTUAL_PREFIX)) {
				return;
			}

			const query = id.slice(('\0' + VIRTUAL_PREFIX).length);
			const params = parseParams(query);
			const hash = generateHash(params);
			const fileName = `og-${hash}.png`;

			// Generate the SVG
			const svg = generateSvg(params);

			// Convert to PNG using sharp
			const pngBuffer = await sharp(Buffer.from(svg))
				.resize(1200, 630)
				.png({ quality: 90 })
				.toBuffer();

			if (isDev) {
				// In dev mode, return a data URL
				const base64 = pngBuffer.toString('base64');
				return `export default "data:image/png;base64,${base64}"`;
			}

			// Emit the file as an asset with explicit filename
			// Using assets/ prefix to match Vite's default asset output
			const assetPath = `assets/${fileName}`;
			this.emitFile({
				type: 'asset',
				fileName: assetPath,
				source: pngBuffer,
			});

			// Return a relative URL path for web usage
			return `export default "/${assetPath}"`;
		},
	};
}
