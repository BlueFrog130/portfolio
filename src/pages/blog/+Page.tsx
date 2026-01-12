import { useMemo, useCallback, startTransition } from 'react';
import { Layout } from '@/lib/components/Layout';
import { blogPosts, getAllTags, searchBlogPosts } from '@/content/blog';
import { BlogSearch } from './BlogSearch';
import { BlogCard } from './BlogCard';
import { useSearchParams } from '@/lib/router';
import { PenLine, SearchX } from 'lucide-react';
import { Card } from '@/lib/components/ui';

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
			<div className="relative py-24 sm:py-32">
				{/* Background accents */}
				<div className="absolute inset-0 -z-10 overflow-hidden">
					<div className="absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-accent-500/5 blur-3xl" />
					<div className="absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-accent-600/5 blur-3xl" />
				</div>

				<div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
					{/* Header */}
					<header className="mb-12">
						<div className="flex items-center gap-4 mb-4">
							<div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent-500/10 border border-accent-500/20">
								<PenLine className="h-6 w-6 text-accent-400" />
							</div>
							<div>
								<h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-surface-100">
									Blog
								</h1>
							</div>
						</div>
						<p className="text-lg text-surface-400 max-w-2xl">
							Thoughts on software engineering, web development, and technology.
						</p>
					</header>

					{/* Search and filters */}
					<BlogSearch
						query={searchParams.get('query') || ''}
						onQueryChange={setQuerySearchParam}
						tags={allTags}
						selectedTags={selectedTags}
						onTagToggle={handleTagToggle}
					/>

					{/* Posts grid */}
					<div className="mt-12 space-y-6">
						{filteredPosts.length === 0 ? (
							<Card className="p-12 text-center">
								<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-800 mx-auto mb-4">
									<SearchX className="h-8 w-8 text-surface-500" />
								</div>
								<p className="text-lg font-medium text-surface-300">
									No posts found
								</p>
								<p className="mt-2 text-surface-500">
									No posts match your search criteria.
								</p>
								{(searchParams.get('query') || selectedTags.length > 0) && (
									<button
										onClick={() => {
											setQuerySearchParam('');
											setSelectedTags([]);
										}}
										className="mt-6 text-sm font-medium text-accent-400 hover:text-accent-300"
									>
										Clear all filters
									</button>
								)}
							</Card>
						) : (
							filteredPosts.map((post, index) => (
								<BlogCard
									key={post.slug}
									post={post}
									style={{ animationDelay: `${index * 0.05}s` }}
								/>
							))
						)}
					</div>

					{blogPosts.length === 0 && (
						<Card className="p-12 text-center">
							<p className="text-surface-400">
								No blog posts yet. Check back soon!
							</p>
						</Card>
					)}
				</div>
			</div>
		</Layout>
	);
}
