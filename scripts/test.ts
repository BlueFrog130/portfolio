import { readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const svg = readFileSync(process.argv[2]);
const pngBuffer = await sharp(svg)
	.resize(1200, 630)
	.png({ quality: 90 })
	.toBuffer();

writeFileSync(process.argv[3], pngBuffer);
