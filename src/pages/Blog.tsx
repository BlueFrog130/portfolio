import { blogPosts } from '@/content/blog';
import { Link } from '@/lib/router';
import { ArrowRight, Calendar, Clock, PenLine } from 'lucide-react';

export function Blog() {
	// Show the 3 most recent posts
	const recentPosts = blogPosts.slice(0, 3);

	if (recentPosts.length === 0) {
		return null;
	}

	return (
		<section id="blog" className="py-20 sm:py-24" aria-labelledby="blog-heading">
			<div className="mx-auto max-w-5xl px-4 sm:px-6">
				<div className="flex items-center justify-between">
					<div>
						<h2
							id="blog-heading"
							className="text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl"
						>
							Latest Articles
						</h2>
						<p className="mt-4 text-lg text-surface-600">
							Thoughts on software engineering, technology, and building things.
						</p>
					</div>
					<Link
						to="/blog"
						className="hidden sm:inline-flex items-center text-sm font-medium text-accent-600 hover:text-accent-700"
					>
						View all posts
						<ArrowRight className="ml-1 h-4 w-4" />
					</Link>
				</div>

				<div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
					{recentPosts.map((post, index) => {
						const formattedDate = new Date(post.publishedAt).toLocaleDateString(
							'en-US',
							{
								year: 'numeric',
								month: 'short',
								day: 'numeric',
							},
						);

						return (
							<article
								key={post.slug}
								className="group flex flex-col rounded-xl border border-surface-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
								style={{ animationDelay: `${index * 0.1}s` }}
							>
								<div className="flex items-start gap-2">
									<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-100">
										<PenLine className="h-6 w-6 text-accent-600" />
									</div>
								</div>

								<h3 className="mt-4 text-lg font-semibold text-surface-900 group-hover:text-accent-600">
									<Link
										to={`/blog/${post.slug}`}
										className="hover:underline focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 rounded"
									>
										{post.title}
									</Link>
								</h3>

								<p className="mt-2 flex-1 text-sm text-surface-600 line-clamp-2">
									{post.description}
								</p>

								<div className="mt-4 flex items-center gap-4 text-xs text-surface-500">
									<span className="inline-flex items-center gap-1">
										<Calendar className="h-3.5 w-3.5" />
										{formattedDate}
									</span>
									<span className="inline-flex items-center gap-1">
										<Clock className="h-3.5 w-3.5" />
										{post.readTime} min read
									</span>
								</div>

								<div className="mt-4 flex flex-wrap gap-2">
									{post.tags.slice(0, 3).map((tag) => (
										<span
											key={tag}
											className="inline-flex items-center rounded-full bg-surface-100 px-2.5 py-0.5 text-xs font-medium text-surface-600"
										>
											{tag}
										</span>
									))}
								</div>

								<div className="mt-4">
									<Link
										to={`/blog/${post.slug}`}
										className="group/link inline-flex items-center text-sm font-medium text-accent-600 hover:text-accent-700"
									>
										Read article
										<ArrowRight className="ml-1 h-4 w-4 group-hover/link:translate-x-1" />
									</Link>
								</div>
							</article>
						);
					})}
				</div>

				<div className="mt-8 text-center sm:hidden">
					<Link
						to="/blog"
						className="inline-flex items-center text-sm font-medium text-accent-600 hover:text-accent-700"
					>
						View all posts
						<ArrowRight className="ml-1 h-4 w-4" />
					</Link>
				</div>
			</div>
		</section>
	);
}
