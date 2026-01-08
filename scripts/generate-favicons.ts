import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { Resvg } from '@resvg/resvg-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const FONTS_DIR = resolve(ROOT, 'fonts');
const PUBLIC_DIR = resolve(ROOT, 'public');
const SVG_PATH = resolve(PUBLIC_DIR, 'favicon.svg');

// Standard favicon sizes
const SIZES = [
	{ name: 'favicon-16x16.png', size: 16 },
	{ name: 'favicon-32x32.png', size: 32 },
	{ name: 'favicon-48x48.png', size: 48 },
	{ name: 'apple-touch-icon.png', size: 180 },
	{ name: 'android-chrome-192x192.png', size: 192 },
	{ name: 'android-chrome-512x512.png', size: 512 },
];

export async function generateFavicons(): Promise<void> {
	console.log('Generating favicons from SVG...');

	if (!existsSync(SVG_PATH)) {
		throw new Error(`Favicon SVG not found at ${SVG_PATH}`);
	}

	const svg = readFileSync(SVG_PATH, 'utf-8');

	for (const { name, size } of SIZES) {
		const resvg = new Resvg(svg, {
			fitTo: {
				mode: 'width',
				value: size,
			},
			font: {
				fontDirs: [FONTS_DIR],
				loadSystemFonts: true,
				defaultFontFamily: 'Satoshi',
			},
		});

		const pngData = resvg.render();
		const pngBuffer = pngData.asPng();

		const outputPath = join(PUBLIC_DIR, name);
		writeFileSync(outputPath, pngBuffer);
		console.log(`  -> Generated ${name} (${size}x${size})`);
	}

	// Generate ICO file with multiple sizes (16, 32, 48)
	await generateIco();

	console.log('Favicon generation complete!');
}

async function generateIco(): Promise<void> {
	// ICO format header
	const icoSizes = [16, 32, 48];
	const pngBuffers: Buffer[] = [];

	const svg = readFileSync(SVG_PATH, 'utf-8');

	for (const size of icoSizes) {
		const resvg = new Resvg(svg, {
			fitTo: {
				mode: 'width',
				value: size,
			},
			font: {
				fontDirs: [FONTS_DIR],
				loadSystemFonts: true,
				defaultFontFamily: 'Satoshi',
			},
		});

		const pngData = resvg.render();
		pngBuffers.push(Buffer.from(pngData.asPng()));
	}

	// Build ICO file
	const ico = buildIco(pngBuffers, icoSizes);
	const icoPath = join(PUBLIC_DIR, 'favicon.ico');
	writeFileSync(icoPath, ico);
	console.log('  -> Generated favicon.ico (16, 32, 48)');
}

function buildIco(pngBuffers: Buffer[], sizes: number[]): Buffer {
	// ICO file format:
	// - ICONDIR header (6 bytes)
	// - ICONDIRENTRY for each image (16 bytes each)
	// - Image data (PNG)

	const headerSize = 6;
	const entrySize = 16;
	const numImages = pngBuffers.length;
	const dataOffset = headerSize + entrySize * numImages;

	// Calculate total size
	let totalSize = dataOffset;
	for (const buf of pngBuffers) {
		totalSize += buf.length;
	}

	const ico = Buffer.alloc(totalSize);

	// ICONDIR header
	ico.writeUInt16LE(0, 0); // Reserved (must be 0)
	ico.writeUInt16LE(1, 2); // Image type (1 = ICO)
	ico.writeUInt16LE(numImages, 4); // Number of images

	// ICONDIRENTRY for each image
	let currentOffset = dataOffset;
	for (let i = 0; i < numImages; i++) {
		const size = sizes[i];
		const pngBuf = pngBuffers[i];
		const entryOffset = headerSize + i * entrySize;

		// Width (0 means 256)
		ico.writeUInt8(size >= 256 ? 0 : size, entryOffset);
		// Height (0 means 256)
		ico.writeUInt8(size >= 256 ? 0 : size, entryOffset + 1);
		// Color palette (0 = no palette)
		ico.writeUInt8(0, entryOffset + 2);
		// Reserved
		ico.writeUInt8(0, entryOffset + 3);
		// Color planes (1 for ICO)
		ico.writeUInt16LE(1, entryOffset + 4);
		// Bits per pixel (32 for PNG with alpha)
		ico.writeUInt16LE(32, entryOffset + 6);
		// Size of image data
		ico.writeUInt32LE(pngBuf.length, entryOffset + 8);
		// Offset to image data
		ico.writeUInt32LE(currentOffset, entryOffset + 12);

		currentOffset += pngBuf.length;
	}

	// Copy PNG data
	currentOffset = dataOffset;
	for (const pngBuf of pngBuffers) {
		pngBuf.copy(ico, currentOffset);
		currentOffset += pngBuf.length;
	}

	return ico;
}

// Run if called directly
if (process.argv[1]?.endsWith('generate-favicons.ts')) {
	generateFavicons().catch(console.error);
}
