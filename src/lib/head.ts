export interface HeadMeta {
	title: string;
	description: string;
	ogImage?: string;
	url: string;
	keywords?: string[];
}

const BASE_URL = 'https://adamgrady.dev';
const DEFAULT_OG_IMAGE = '/og-image.png';

export function generateHead(meta: HeadMeta): string {
	const ogImage = meta.ogImage || DEFAULT_OG_IMAGE;
	const fullUrl = `${BASE_URL}${meta.url}`;
	const fullImageUrl = ogImage.startsWith('http')
		? ogImage
		: `${BASE_URL}${ogImage}`;

	// Generate keywords meta tag (comma-separated)
	const keywordsMeta =
		meta.keywords && meta.keywords.length > 0
			? `\n\t<meta name="keywords" content="${escapeHtml(meta.keywords.join(', '))}" />`
			: '';

	// Generate article:tag meta tags (one per tag, for Open Graph)
	const articleTags =
		meta.keywords && meta.keywords.length > 0
			? meta.keywords
					.map(
						(tag) =>
							`\n\t<meta property="article:tag" content="${escapeHtml(tag)}" />`,
					)
					.join('')
			: '';

	return `<title>${escapeHtml(meta.title)}</title>
	<meta name="description" content="${escapeHtml(meta.description)}" />${keywordsMeta}
	<meta property="og:type" content="website" />
	<meta property="og:url" content="${fullUrl}" />
	<meta property="og:title" content="${escapeHtml(meta.title)}" />
	<meta property="og:description" content="${escapeHtml(meta.description)}" />
	<meta property="og:image" content="${fullImageUrl}" />${articleTags}
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
