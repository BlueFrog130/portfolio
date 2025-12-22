import { memo, ViewTransition } from 'react';
import { Link } from '@/lib/router';
import type { BlogPost } from '@/content/blog';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

interface BlogCardProps {
	post: BlogPost;
}

export const BlogCard = memo(function BlogCard({ post }: BlogCardProps) {
	const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});

	return (
		<ViewTransition name={`blog-${post.slug}`}>
			<article className="group rounded-xl border border-surface-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md">
				<div className="flex items-center gap-4 text-sm text-surface-500">
					<span className="inline-flex items-center gap-1">
						<Calendar className="h-4 w-4" />
						{formattedDate}
					</span>
					<span className="inline-flex items-center gap-1">
						<Clock className="h-4 w-4" />
						{post.readTime} min read
					</span>
				</div>

				<h2 className="mt-3 text-xl font-semibold text-surface-900 group-hover:text-accent-600">
					<Link
						to={`/blog/${post.slug}`}
						className="rounded hover:underline focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2"
					>
						{post.title}
					</Link>
				</h2>

				<p className="mt-2 line-clamp-2 text-surface-600">{post.description}</p>

				<div className="mt-4 flex flex-wrap gap-2">
					{post.tags.map((tag) => (
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
						Read more
						<ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/link:translate-x-1" />
					</Link>
				</div>
			</article>
		</ViewTransition>
	);
});
