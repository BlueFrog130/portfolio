import {
	blogPosts,
	getAdjacentSeriesPosts,
	getBlogPostMeta,
	loadBlogPostContent,
} from '@/content/blog';
import { PageLoad, PageMeta, RouteEntries } from '@/lib/router/types';

export const meta: PageMeta = (params) => getBlogPostMeta(params.slug);

export const load: PageLoad<any> = async ({ params }) => {
	const post = await loadBlogPostContent(params.slug);
	if (post) {
		const { prev, next } = getAdjacentSeriesPosts(post);
		return { post, prev, next };
	}
	return { post: undefined, prev: null, next: null };
};

export const entries: RouteEntries = () =>
	blogPosts.map((post) => `/blog/${post.slug}`);
