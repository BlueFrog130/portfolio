import { routes } from '@/routes';
import { html as xml } from 'common-tags';
import type { RouteMeta, RouteParams } from '@/lib/router';

// Resolve meta - call it if it's a function, otherwise return as-is
function resolveMeta(
	meta: RouteMeta | ((params: RouteParams) => RouteMeta) | undefined,
	params: RouteParams,
): RouteMeta | undefined {
	if (!meta) return undefined;
	return typeof meta === 'function' ? meta(params) : meta;
}

export function get() {
	const entries = routes
		.flatMap((r) => {
			if (r.entries) {
				return r.entries().map(({ path, params }) => {
					const meta = resolveMeta(r.meta, params);
					return { ...meta, path };
				});
			}
			const meta = resolveMeta(r.meta, {});
			return [{ ...meta, path: r.path }];
		})
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
					${sitemapChangefreq ? `<changefreq>${sitemapChangefreq}</changefreq>` : ''}
					${sitemapPriority != null ? `<priority>${sitemapPriority}</priority>` : ''}
				</url>`,
			)}
		</urlset>`;
}
