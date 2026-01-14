import { html as xml } from 'common-tags';
import { blogPosts } from '@/content/blog';
import { profile } from '@/lib/data';

function escapeXml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export function get() {
	const lastBuildDate = new Date(import.meta.env.VITE_BUILD_DATE).toUTCString();
	const baseUrl = import.meta.env.VITE_BASE_URL;
	const year = new Date().getFullYear();

	return xml`
		<?xml version="1.0" encoding="UTF-8"?>
		<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
			<channel>
				<title>${escapeXml(profile.name)}'s Blog</title>
				<link>${baseUrl}/blog</link>
				<description>Writing about web development, React, and building without meta-frameworks</description>
				<language>en-us</language>
				<lastBuildDate>${lastBuildDate}</lastBuildDate>
				<atom:link
					href="${baseUrl}/feed.xml"
					rel="self"
					type="application/rss+xml"
				/>
				<managingEditor>${profile.email} (${escapeXml(profile.name)})</managingEditor>
				<webMaster>${profile.email} (${escapeXml(profile.name)})</webMaster>
				<copyright>Copyright ${year} ${escapeXml(profile.name)}</copyright>
				<generator>Custom SSG</generator>
				<ttl>60</ttl>
				${blogPosts.map(
					(post) => xml`
					<item>
						<title>${escapeXml(post.title)}</title>
						<link>${baseUrl}/blog/${post.slug}</link>
						<description>${escapeXml(post.description)}</description>
						<author>${profile.email} (${escapeXml(profile.name)})</author>
						<pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
						<guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
						${post.tags.map((tag) => xml`<category>${escapeXml(tag)}</category>`)}
					</item>`,
				)}
			</channel>
		</rss>`;
}
