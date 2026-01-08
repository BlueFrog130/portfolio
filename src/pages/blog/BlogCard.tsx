import { memo, ViewTransition, CSSProperties } from 'react';
import { Link } from '@/lib/router';
import type { BlogPost } from '@/content/blog';
import { Calendar, Clock, ArrowUpRight, PenLine } from 'lucide-react';

interface BlogCardProps {
	post: BlogPost;
	style?: CSSProperties;
}

export const BlogCard = memo(function BlogCard({ post, style }: BlogCardProps) {
	const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});

	return (
		<ViewTransition name={`blog-${post.slug}`}>
			<article
				className="card gradient-border p-6 group"
				style={style}
			>
				<div className="flex flex-col sm:flex-row sm:items-start gap-5">
					{/* Icon */}
					<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-500/10 border border-accent-500/20 group-hover:bg-accent-500/20 transition-colors">
						<PenLine className="h-5 w-5 text-accent-400" />
					</div>

					{/* Content */}
					<div className="flex-1 min-w-0">
						{/* Meta */}
						<div className="flex flex-wrap items-center gap-4 text-sm text-surface-500">
							<span className="inline-flex items-center gap-1.5">
								<Calendar className="h-4 w-4" />
								{formattedDate}
							</span>
							<span className="inline-flex items-center gap-1.5">
								<Clock className="h-4 w-4" />
								{post.readTime} min read
							</span>
							{post.featured && (
								<span className="tag tag-accent text-[10px]">Featured</span>
							)}
						</div>

						{/* Title */}
						<h2 className="mt-3 font-display text-xl font-semibold text-surface-100 group-hover:text-accent-400 transition-colors">
							<Link
								to={`/blog/${post.slug}`}
								className="focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded"
							>
								{post.title}
							</Link>
						</h2>

						{/* Description */}
						<p className="mt-2 text-surface-400 line-clamp-2 leading-relaxed">
							{post.description}
						</p>

						{/* Tags and link */}
						<div className="mt-4 flex flex-wrap items-center justify-between gap-4">
							<div className="flex flex-wrap gap-2">
								{post.tags.slice(0, 4).map((tag) => (
									<span key={tag} className="tag">
										{tag}
									</span>
								))}
								{post.tags.length > 4 && (
									<span className="tag">+{post.tags.length - 4}</span>
								)}
							</div>

							<Link
								to={`/blog/${post.slug}`}
								className="inline-flex items-center gap-2 text-sm font-medium text-accent-400 hover:text-accent-300 group/link shrink-0"
							>
								Read article
								<ArrowUpRight className="h-4 w-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
							</Link>
						</div>
					</div>
				</div>
			</article>
		</ViewTransition>
	);
});
