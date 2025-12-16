import { useMemo, useCallback, startTransition } from 'react';
import { Layout } from '@/lib/components/Layout';
import { blogPosts, getAllTags, searchBlogPosts } from '@/content/blog';
import { BlogSearch } from './BlogSearch';
import { BlogCard } from './BlogCard';
import { useSearchParams } from '@/lib/router';

export default function BlogPage() {
	const [searchParams, _setSearchParams] = useSearchParams();

	const selectedTags = useMemo(() => {
		const tagsParam = searchParams.get('tags');
		return tagsParam ? tagsParam.split(',') : [];
	}, [searchParams]);

	const setSearchParams = useCallback(
		(
			params: Parameters<typeof _setSearchParams>[0],
			options?: Parameters<typeof _setSearchParams>[1],
		) => {
			startTransition(() => {
				_setSearchParams(params, options);
			});
		},
		[_setSearchParams],
	);

	const setQuerySearchParam = useCallback(
		(query: string) => {
			setSearchParams(
				(p) => {
					const newParams = new URLSearchParams(p);
					if (query === '') {
						newParams.delete('query');
						return newParams;
					}
					newParams.set('query', query);
					return newParams;
				},
				{ replace: true },
			);
		},
		[setSearchParams],
	);

	const setSelectedTags = useCallback(
		(tags: string[]) => {
			setSearchParams(
				(p) => {
					const newParams = new URLSearchParams(p);
					if (tags.length === 0) {
						newParams.delete('tags');
						return newParams;
					}
					newParams.set('tags', tags.join(','));
					return newParams;
				},
				{ replace: true },
			);
		},
		[setSearchParams],
	);

	const allTags = useMemo(() => getAllTags(), []);

	const filteredPosts = useMemo(
		() => searchBlogPosts(searchParams.get('query') || '', selectedTags),
		[searchParams, selectedTags],
	);

	const handleTagToggle = useCallback(
		(tag: string) => {
			setSelectedTags(
				selectedTags.includes(tag)
					? selectedTags.filter((t) => t !== tag)
					: [...selectedTags, tag],
			);
		},
		[selectedTags, setSelectedTags],
	);

	return (
		<Layout>
			<div className="py-20 sm:py-24">
				<div className="mx-auto max-w-5xl px-4 sm:px-6">
					<header className="mb-12">
						<h1 className="text-4xl font-bold tracking-tight text-surface-900 sm:text-5xl">
							Blog
						</h1>
						<p className="mt-4 text-lg text-surface-600">
							Thoughts on software engineering, web development, and technology.
						</p>
					</header>

					<BlogSearch
						query={searchParams.get('query') || ''}
						onQueryChange={setQuerySearchParam}
						tags={allTags}
						selectedTags={selectedTags}
						onTagToggle={handleTagToggle}
					/>

					<div className="mt-12 space-y-8">
						{filteredPosts.length === 0 ? (
							<div className="py-12 text-center">
								<svg
									className="mx-auto h-12 w-12 text-surface-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<p className="mt-4 text-surface-500">
									No posts found matching your criteria.
								</p>
								{(searchParams.get('query') || selectedTags.length > 0) && (
									<button
										onClick={() => {
											setQuerySearchParam('');
											setSelectedTags([]);
										}}
										className="mt-4 text-sm font-medium text-accent-600 hover:text-accent-700"
									>
										Clear filters
									</button>
								)}
							</div>
						) : (
							filteredPosts.map((post) => (
								<BlogCard key={post.slug} post={post} />
							))
						)}
					</div>

					{blogPosts.length === 0 && (
						<div className="py-12 text-center">
							<p className="text-surface-500">
								No blog posts yet. Check back soon!
							</p>
						</div>
					)}
				</div>
			</div>
		</Layout>
	);
}
