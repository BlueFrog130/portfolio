import { Link } from '@/lib/router';
import type { BlogPost } from '@/content/blog';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

interface SeriesNavProps {
	post: BlogPost;
	prev: BlogPost | null;
	next: BlogPost | null;
}

export function SeriesNav({ post, prev, next }: SeriesNavProps) {
	if (!post.series) return null;

	const { title: seriesTitle, part, totalParts } = post.series;

	return (
		<nav className="not-prose my-12 card p-6">
			{/* Series header */}
			<div className="mb-5 flex items-center gap-2 text-sm font-medium text-accent-400">
				<BookOpen className="h-4 w-4" />
				<span>{seriesTitle}</span>
				<span className="text-surface-500">
					&middot; Part {part} of {totalParts}
				</span>
			</div>

			{/* Navigation links */}
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
				{prev ? (
					<Link
						to={`/blog/${prev.slug}`}
						className="group flex flex-1 items-center gap-3 rounded-xl border border-surface-700 bg-surface-800/50 p-4 transition-all hover:border-accent-500/30 hover:bg-surface-800"
					>
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-700 transition-colors group-hover:bg-accent-500/20">
							<ChevronLeft className="h-5 w-5 text-surface-400 transition-colors group-hover:text-accent-400" />
						</div>
						<div className="min-w-0 text-left">
							<div className="text-xs font-medium text-surface-500">
								Previous
							</div>
							<div className="truncate text-sm font-semibold text-surface-200 group-hover:text-accent-400">
								{prev.title}
							</div>
						</div>
					</Link>
				) : (
					<div className="flex-1" />
				)}

				{next ? (
					<Link
						to={`/blog/${next.slug}`}
						className="group flex flex-1 items-center justify-end gap-3 rounded-xl border border-surface-700 bg-surface-800/50 p-4 transition-all hover:border-accent-500/30 hover:bg-surface-800"
					>
						<div className="min-w-0 text-right">
							<div className="text-xs font-medium text-surface-500">Next</div>
							<div className="truncate text-sm font-semibold text-surface-200 group-hover:text-accent-400">
								{next.title}
							</div>
						</div>
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-700 transition-colors group-hover:bg-accent-500/20">
							<ChevronRight className="h-5 w-5 text-surface-400 transition-colors group-hover:text-accent-400" />
						</div>
					</Link>
				) : (
					<div className="flex-1" />
				)}
			</div>

			{/* Progress indicator */}
			<div className="mt-5 flex items-center gap-1">
				{Array.from({ length: totalParts }, (_, i) => (
					<div
						key={i}
						className={`h-1.5 flex-1 rounded-full transition-colors ${
							i + 1 === part
								? 'bg-accent-500'
								: i + 1 < part
									? 'bg-accent-500/50'
									: 'bg-surface-700'
						}`}
					/>
				))}
			</div>
		</nav>
	);
}
