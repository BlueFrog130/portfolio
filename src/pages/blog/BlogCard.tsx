import { Link } from '@/lib/router';
import type { BlogPost } from '@/content/blog';

interface BlogCardProps {
	post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
	const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});

	return (
		<article className="group rounded-xl border border-surface-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md">
			<div className="flex items-center gap-4 text-sm text-surface-500">
				<span className="inline-flex items-center gap-1">
					<svg
						className="h-4 w-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
					{formattedDate}
				</span>
				<span className="inline-flex items-center gap-1">
					<svg
						className="h-4 w-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
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
					<svg
						className="ml-1 h-4 w-4 transition-transform group-hover/link:translate-x-1"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M17 8l4 4m0 0l-4 4m4-4H3"
						/>
					</svg>
				</Link>
			</div>
		</article>
	);
}
