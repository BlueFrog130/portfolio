import { routes } from '@/routes';
import { html as xml } from 'common-tags';

export function get() {
	const entries = routes
		.flatMap((r) =>
			r.entries
				? r.entries().map((e) => ({
						...r.meta,
						path: e,
					}))
				: [
						{
							...r.meta,
							path: r.path,
						},
					],
		)
		.filter((e) => e.path !== '*'); // Exclude 404 route

	const today = new Date(import.meta.env.VITE_BUILD_DATE)
		.toISOString()
		.split('T')[0];

	return xml`
		<?xml version="1.0" encoding="UTF-8"?>
		<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
			${entries.map(
				({ path, sitemapChangefreq, sitemapPriority }) => xml`
				<url>
					<loc>${import.meta.env.VITE_BASE_URL + path}</loc>
					<lastmod>${today}</lastmod>
					<changefreq>${sitemapChangefreq}</changefreq>
					<priority>${sitemapPriority}</priority>
				</url>`,
			)}
		</urlset>`;
}
