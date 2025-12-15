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
		<nav className="not-prose my-12 rounded-xl border border-surface-200 bg-surface-50 p-6">
			<div className="mb-4 flex items-center gap-2 text-sm font-medium text-accent-600">
				<BookOpen className="h-4 w-4" />
				<span>{seriesTitle}</span>
				<span className="text-surface-400">
					&middot; Part {part} of {totalParts}
				</span>
			</div>

			<div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
				{prev ? (
					<Link
						to={`/blog/${prev.slug}`}
						className="group flex flex-1 items-center gap-3 rounded-lg border border-surface-200 bg-white p-4 transition-all hover:border-accent-300 hover:shadow-sm"
					>
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-100 transition-colors group-hover:bg-accent-100">
							<ChevronLeft className="h-5 w-5 text-surface-600 transition-colors group-hover:text-accent-600" />
						</div>
						<div className="min-w-0 text-left">
							<div className="text-xs font-medium text-surface-500">
								Previous
							</div>
							<div className="truncate text-sm font-semibold text-surface-900 group-hover:text-accent-700">
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
						className="group flex flex-1 items-center justify-end gap-3 rounded-lg border border-surface-200 bg-white p-4 transition-all hover:border-accent-300 hover:shadow-sm"
					>
						<div className="min-w-0 text-right">
							<div className="text-xs font-medium text-surface-500">Next</div>
							<div className="truncate text-sm font-semibold text-surface-900 group-hover:text-accent-700">
								{next.title}
							</div>
						</div>
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-100 transition-colors group-hover:bg-accent-100">
							<ChevronRight className="h-5 w-5 text-surface-600 transition-colors group-hover:text-accent-600" />
						</div>
					</Link>
				) : (
					<div className="flex-1" />
				)}
			</div>

			{/* Progress indicator */}
			<div className="mt-4 flex items-center gap-1">
				{Array.from({ length: totalParts }, (_, i) => (
					<div
						key={i}
						className={`h-1.5 flex-1 rounded-full transition-colors ${
							i + 1 === part
								? 'bg-accent-500'
								: i + 1 < part
									? 'bg-accent-300'
									: 'bg-surface-200'
						}`}
					/>
				))}
			</div>
		</nav>
	);
}
