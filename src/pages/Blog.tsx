import { blogPosts } from '@/content/blog';
import { Link } from '@/lib/router';
import { ArrowRight, Calendar, Clock, ArrowUpRight } from 'lucide-react';
import { GradientCard, SectionNumber, Tag } from '@/lib/components/ui';
import { PenLineIcon } from '@/lib/components/ui/icon';

export function Blog() {
	// Show the 3 most recent posts
	const recentPosts = blogPosts.slice(0, 3);

	if (recentPosts.length === 0) {
		return null;
	}

	return (
		<section
			id="blog"
			className="relative py-24 sm:py-32"
			aria-labelledby="blog-heading"
		>
			{/* Background accents */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute right-0 top-1/3 h-100 w-100 rounded-full bg-accent-500/5 blur-3xl" />
			</div>

			<div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
				{/* Section header */}
				<div className="flex items-end justify-between gap-6 mb-16">
					<div className="flex items-end gap-6">
						<SectionNumber number={5} />
						<div>
							<h2
								id="blog-heading"
								className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-surface-100"
							>
								Latest Articles
							</h2>
							<p className="mt-2 text-surface-400">
								Thoughts on software engineering, technology, and building
								things
							</p>
						</div>
					</div>
					<Link
						to="/blog"
						className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-accent-400 hover:text-accent-300"
					>
						View all posts
						<ArrowRight className="h-4 w-4" />
					</Link>
				</div>

				{/* Blog posts grid */}
				<div className="grid gap-6 lg:grid-cols-3">
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
							<GradientCard
								as="article"
								key={post.slug}
								contentClassName="p-6 flex flex-col"
								style={{ animationDelay: `${index * 0.1}s` }}
							>
								{/* Header */}
								<div className="flex items-start justify-between gap-4">
									<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-500/10 border border-accent-500/20 group-hover:bg-accent-500/20 transition-colors">
										<PenLineIcon className="h-5 w-5 group-hover:[--active:1] transition-transform duration-200 ease-out group-hover:-translate-y-0.5" />
									</div>
									{post.featured && (
										<Tag variant="accent" className="text-[10px]">
											Featured
										</Tag>
									)}
								</div>

								{/* Content */}
								<div className="mt-5 flex-1">
									<h3 className="font-display text-lg font-semibold text-surface-100 group-hover:text-accent-400 transition-colors line-clamp-2">
										<Link
											to={`/blog/${post.slug}`}
											className="focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded"
										>
											{post.title}
										</Link>
									</h3>

									<p className="mt-3 text-sm text-surface-400 leading-relaxed line-clamp-2">
										{post.description}
									</p>
								</div>

								{/* Meta */}
								<div className="mt-5 flex items-center gap-4 text-xs text-surface-500">
									<span className="inline-flex items-center gap-1.5">
										<Calendar className="h-3.5 w-3.5" />
										{formattedDate}
									</span>
									<span className="inline-flex items-center gap-1.5">
										<Clock className="h-3.5 w-3.5" />
										{post.readTime} min read
									</span>
								</div>

								{/* Tags */}
								<div className="mt-4 flex flex-wrap gap-2">
									{post.tags.slice(0, 3).map((tag) => (
										<Tag key={tag}>{tag}</Tag>
									))}
								</div>

								{/* Footer */}
								<div className="mt-5 pt-5 border-t border-surface-800">
									<Link
										to={`/blog/${post.slug}`}
										className="inline-flex items-center gap-2 text-sm font-medium text-accent-400 hover:text-accent-300 group/link"
									>
										Read article
										<ArrowUpRight className="h-4 w-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
									</Link>
								</div>
							</GradientCard>
						);
					})}
				</div>

				{/* Mobile view all link */}
				<div className="mt-8 text-center sm:hidden">
					<Link
						to="/blog"
						className="inline-flex items-center gap-2 text-sm font-medium text-accent-400 hover:text-accent-300"
					>
						View all posts
						<ArrowRight className="h-4 w-4" />
					</Link>
				</div>
			</div>
		</section>
	);
}
