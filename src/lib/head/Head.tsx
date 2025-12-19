import { useState, useEffect } from 'react';
import { DEFAULT_OG_IMAGE, SITE_NAME, AUTHOR, BASE_URL } from './shared';

export interface HeadProps {
	title: string;
	description: string;
	url: string;
	ogImage?: string;
	keywords?: string[];
	type?: 'website' | 'article';
	publishedTime?: string;
	modifiedTime?: string;
	schema?: 'Person' | 'Article' | 'SoftwareApplication';
	sitemapPriority?: number;
	sitemapChangefreq?:
		| 'always'
		| 'hourly'
		| 'daily'
		| 'weekly'
		| 'monthly'
		| 'yearly'
		| 'never';
	server?: boolean; // Indicates if rendering on server
}

/**
 * Clear existing SSG-generated meta tags from head to prevent duplicates
 */
function clearExistingMetaTags() {
	// Remove existing title
	document.querySelector('title')?.remove();

	// Meta tags by name
	const metaNames = [
		'description',
		'author',
		'keywords',
		'twitter:card',
		'twitter:title',
		'twitter:description',
		'twitter:image',
		'sitemap:priority',
		'sitemap:changefreq',
	];
	metaNames.forEach((name) => {
		document.querySelector(`meta[name="${name}"]`)?.remove();
	});

	// Meta tags by property (OG and article)
	const metaProperties = [
		'og:type',
		'og:url',
		'og:title',
		'og:description',
		'og:image',
		'og:site_name',
		'og:locale',
		'article:published_time',
		'article:modified_time',
		'article:author',
	];
	metaProperties.forEach((property) => {
		document.querySelector(`meta[property="${property}"]`)?.remove();
	});

	// Remove all article:tag meta tags
	document
		.querySelectorAll('meta[property="article:tag"]')
		.forEach((el) => el.remove());

	// Remove canonical link
	document.querySelector('link[rel="canonical"]')?.remove();

	// Remove JSON-LD script
	document.querySelector('script[type="application/ld+json"]')?.remove();
}

/**
 * Head component that renders document metadata using React 19's
 * built-in support for hoisting <title>, <meta>, and <link> tags
 * to the document <head>. Only renders on the client after hydration -
 * SSG uses generateHead() for initial HTML.
 */
export function Head({
	title,
	description,
	url,
	ogImage,
	keywords,
	type = 'website',
	publishedTime,
	modifiedTime,
	schema,
	sitemapPriority,
	sitemapChangefreq = 'weekly',
	server = false,
}: HeadProps) {
	// Two-pass rendering: render null on server and initial hydration,
	// then render meta tags after useEffect runs on client
	const [isClient, setIsClient] = useState(server);

	useEffect(() => {
		// Clear SSG-generated meta tags before React adds new ones
		clearExistingMetaTags();
		setIsClient(true);
	}, []);

	if (!isClient) {
		return null;
	}

	const fullUrl = `${BASE_URL}${url}`;
	const imageUrl = ogImage || DEFAULT_OG_IMAGE;
	const fullImageUrl = imageUrl.startsWith('http')
		? imageUrl
		: `${BASE_URL}${imageUrl}`;

	const jsonLd = generateJsonLd({
		title,
		description,
		fullUrl,
		fullImageUrl,
		schema,
		publishedTime,
		modifiedTime,
		keywords,
	});

	return (
		<>
			<title>{title}</title>
			<meta name="description" content={description} />
			<meta name="author" content={AUTHOR.name} />
			{keywords && keywords.length > 0 && (
				<meta name="keywords" content={keywords.join(', ')} />
			)}

			{/* Open Graph */}
			<meta property="og:type" content={type} />
			<meta property="og:url" content={fullUrl} />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:image" content={fullImageUrl} />
			<meta property="og:site_name" content={SITE_NAME} />
			<meta property="og:locale" content="en_US" />

			{/* Article-specific */}
			{type === 'article' && publishedTime && (
				<meta property="article:published_time" content={publishedTime} />
			)}
			{type === 'article' && modifiedTime && (
				<meta property="article:modified_time" content={modifiedTime} />
			)}
			{type === 'article' && (
				<meta property="article:author" content={BASE_URL} />
			)}
			{type === 'article' &&
				keywords?.map((tag) => (
					<meta key={tag} property="article:tag" content={tag} />
				))}

			{/* Twitter */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={fullImageUrl} />

			{/* Canonical */}
			<link rel="canonical" href={fullUrl} />

			{/* JSON-LD */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>

			{/* Sitemap meta tags */}
			<meta name="sitemap:priority" content={String(sitemapPriority)} />
			<meta name="sitemap:changefreq" content={sitemapChangefreq} />
		</>
	);
}

interface JsonLdParams {
	title: string;
	description: string;
	fullUrl: string;
	fullImageUrl: string;
	schema?: 'Person' | 'Article' | 'SoftwareApplication';
	publishedTime?: string;
	modifiedTime?: string;
	keywords?: string[];
}

function generateJsonLd({
	title,
	description,
	fullUrl,
	fullImageUrl,
	schema,
	publishedTime,
	modifiedTime,
	keywords,
}: JsonLdParams): Record<string, unknown> {
	switch (schema) {
		case 'Person':
			return {
				'@context': 'https://schema.org',
				'@type': 'Person',
				name: AUTHOR.name,
				url: AUTHOR.url,
				sameAs: [AUTHOR.github, AUTHOR.linkedin],
				jobTitle: 'Senior Software Engineer',
				description,
			};

		case 'Article':
			return {
				'@context': 'https://schema.org',
				'@type': 'Article',
				headline: title,
				description,
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
				...(publishedTime && { datePublished: publishedTime }),
				...(modifiedTime && { dateModified: modifiedTime }),
				...(keywords?.length && { keywords: keywords.join(', ') }),
			};

		case 'SoftwareApplication':
			return {
				'@context': 'https://schema.org',
				'@type': 'SoftwareApplication',
				name: title,
				description,
				image: fullImageUrl,
				url: fullUrl,
				author: {
					'@type': 'Person',
					name: AUTHOR.name,
					url: AUTHOR.url,
				},
				applicationCategory: 'WebApplication',
				...(keywords?.length && { keywords: keywords.join(', ') }),
			};

		default:
			return {
				'@context': 'https://schema.org',
				'@type': 'WebSite',
				name: SITE_NAME,
				url: BASE_URL,
				author: {
					'@type': 'Person',
					name: AUTHOR.name,
					url: AUTHOR.url,
				},
			};
	}
}
