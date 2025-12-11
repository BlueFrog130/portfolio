import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

async function generateOgImage() {
	const svgPath = join(ROOT, 'public', 'og-image.svg');
	const pngPath = join(ROOT, 'public', 'og-image.png');

	console.log('Reading SVG...');
	const svgBuffer = readFileSync(svgPath);

	console.log('Converting to PNG...');
	const pngBuffer = await sharp(svgBuffer)
		.resize(1200, 630)
		.png({ quality: 90 })
		.toBuffer();

	writeFileSync(pngPath, pngBuffer);
	console.log(`Generated: ${pngPath}`);
}

generateOgImage().catch((err) => {
	console.error('Failed to generate OG image:', err);
	process.exit(1);
});
