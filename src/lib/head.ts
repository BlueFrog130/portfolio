import { links, profile } from './content';

export interface HeadMeta {
	title: string;
	description: string;
	ogImage?: string;
	url: string;
	keywords?: string[];
	// Article-specific metadata
	type?: 'website' | 'article';
	publishedTime?: string;
	modifiedTime?: string;
	// JSON-LD schema type
	schema?: 'Person' | 'Article' | 'SoftwareApplication';
	// Sitemap configuration
	sitemapPriority?: number;
	sitemapChangefreq?:
		| 'always'
		| 'hourly'
		| 'daily'
		| 'weekly'
		| 'monthly'
		| 'yearly'
		| 'never';
}

const DEFAULT_OG_IMAGE = '/og-image.png';
const SITE_NAME = profile.name;
const AUTHOR = {
	name: profile.name,
	url: import.meta.env.VITE_BASE_URL,
	github: links.github,
	linkedin: links.linkedin,
};

export function generateHead(meta: HeadMeta): string {
	const ogImage = meta.ogImage || DEFAULT_OG_IMAGE;
	const fullUrl = `${import.meta.env.VITE_BASE_URL}${meta.url}`;
	const fullImageUrl = ogImage.startsWith('http')
		? ogImage
		: `${import.meta.env.VITE_BASE_URL}${ogImage}`;
	const ogType = meta.type || 'website';

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

	// Article-specific meta tags
	const articleMeta =
		ogType === 'article'
			? `${meta.publishedTime ? `\n\t<meta property="article:published_time" content="${meta.publishedTime}" />` : ''}${meta.modifiedTime ? `\n\t<meta property="article:modified_time" content="${meta.modifiedTime}" />` : ''}\n\t<meta property="article:author" content="${AUTHOR.url}" />`
			: '';

	// Generate JSON-LD structured data
	const jsonLd = generateJsonLd(meta, fullUrl, fullImageUrl);

	// Sitemap meta tags (used by SSG script)
	const sitemapMeta = `\n\t<meta name="sitemap:priority" content="${meta.sitemapPriority ?? 0.5}" />\n\t<meta name="sitemap:changefreq" content="${meta.sitemapChangefreq ?? 'monthly'}" />`;

	return `<title>${escapeHtml(meta.title)}</title>
	<meta name="description" content="${escapeHtml(meta.description)}" />
	<meta name="author" content="${AUTHOR.name}" />${keywordsMeta}
	<meta property="og:type" content="${ogType}" />
	<meta property="og:url" content="${fullUrl}" />
	<meta property="og:title" content="${escapeHtml(meta.title)}" />
	<meta property="og:description" content="${escapeHtml(meta.description)}" />
	<meta property="og:image" content="${fullImageUrl}" />
	<meta property="og:site_name" content="${SITE_NAME}" />
	<meta property="og:locale" content="en_US" />${articleMeta}${articleTags}
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="${escapeHtml(meta.title)}" />
	<meta name="twitter:description" content="${escapeHtml(meta.description)}" />
	<meta name="twitter:image" content="${fullImageUrl}" />
	<link rel="canonical" href="${fullUrl}" />${sitemapMeta}${jsonLd}`;
}

function escapeHtml(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

function generateJsonLd(
	meta: HeadMeta,
	fullUrl: string,
	fullImageUrl: string,
): string {
	let schema: Record<string, unknown>;

	switch (meta.schema) {
		case 'Person':
			schema = {
				'@context': 'https://schema.org',
				'@type': 'Person',
				name: AUTHOR.name,
				url: AUTHOR.url,
				sameAs: [AUTHOR.github, AUTHOR.linkedin],
				jobTitle: 'Senior Software Engineer',
				description: meta.description,
			};
			break;

		case 'Article':
			schema = {
				'@context': 'https://schema.org',
				'@type': 'Article',
				headline: meta.title,
				description: meta.description,
				image: fullImageUrl,
				url: fullUrl,
				author: {
					'@type': 'Person',
					name: AUTHOR.name,
					url: AUTHOR.url,
				},
				publisher: {
					'@type': 'Person',
					name: AUTHOR.name,
					url: AUTHOR.url,
				},
				...(meta.publishedTime && { datePublished: meta.publishedTime }),
				...(meta.modifiedTime && { dateModified: meta.modifiedTime }),
				...(meta.keywords &&
					meta.keywords.length > 0 && { keywords: meta.keywords.join(', ') }),
			};
			break;

		case 'SoftwareApplication':
			schema = {
				'@context': 'https://schema.org',
				'@type': 'SoftwareApplication',
				name: meta.title,
				description: meta.description,
				image: fullImageUrl,
				url: fullUrl,
				author: {
					'@type': 'Person',
					name: AUTHOR.name,
					url: AUTHOR.url,
				},
				applicationCategory: 'WebApplication',
				...(meta.keywords &&
					meta.keywords.length > 0 && { keywords: meta.keywords.join(', ') }),
			};
			break;

		default:
			// WebSite schema for general pages
			schema = {
				'@context': 'https://schema.org',
				'@type': 'WebSite',
				name: SITE_NAME,
				url: import.meta.env.VITE_BASE_URL,
				author: {
					'@type': 'Person',
					name: AUTHOR.name,
					url: AUTHOR.url,
				},
			};
	}

	return `\n\t<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}
