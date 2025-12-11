export interface HeadMeta {
	title: string;
	description: string;
	ogImage?: string;
	url: string;
}

const BASE_URL = 'https://adamgrady.dev';
const DEFAULT_OG_IMAGE = '/og-image.png';

export function generateHead(meta: HeadMeta): string {
	const ogImage = meta.ogImage || DEFAULT_OG_IMAGE;
	const fullUrl = `${BASE_URL}${meta.url}`;
	const fullImageUrl = ogImage.startsWith('http')
		? ogImage
		: `${BASE_URL}${ogImage}`;

	return `<title>${escapeHtml(meta.title)}</title>
	<meta name="description" content="${escapeHtml(meta.description)}" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="${fullUrl}" />
	<meta property="og:title" content="${escapeHtml(meta.title)}" />
	<meta property="og:description" content="${escapeHtml(meta.description)}" />
	<meta property="og:image" content="${fullImageUrl}" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="${escapeHtml(meta.title)}" />
	<meta name="twitter:description" content="${escapeHtml(meta.description)}" />
	<meta name="twitter:image" content="${fullImageUrl}" />
	<link rel="canonical" href="${fullUrl}" />`;
}

function escapeHtml(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}
