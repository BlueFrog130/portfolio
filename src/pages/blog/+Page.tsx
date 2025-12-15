import { useState, useMemo, useCallback } from 'react';
import { Layout } from '@/lib/components/Layout';
import { blogPosts, getAllTags, searchBlogPosts } from '@/content/blog';
import { BlogSearch } from './BlogSearch';
import { BlogCard } from './BlogCard';

export default function BlogPage() {
	const [query, setQuery] = useState('');
	const [selectedTags, setSelectedTags] = useState<string[]>([]);

	const allTags = useMemo(() => getAllTags(), []);

	const filteredPosts = useMemo(
		() => searchBlogPosts(query, selectedTags),
		[query, selectedTags],
	);

	const handleTagToggle = useCallback((tag: string) => {
		setSelectedTags((prev) =>
			prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
		);
	}, []);

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
						query={query}
						onQueryChange={setQuery}
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
								{(query || selectedTags.length > 0) && (
									<button
										onClick={() => {
											setQuery('');
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
							<p className="text-surface-500">No blog posts yet. Check back soon!</p>
						</div>
					)}
				</div>
			</div>
		</Layout>
	);
}
