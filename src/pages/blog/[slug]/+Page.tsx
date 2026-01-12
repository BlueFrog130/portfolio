import { Link } from '@/lib/router';
import { type BlogPost } from '@/content/blog';
import { Layout } from '@/lib/components/Layout';
import { ViewTransition } from 'react';
import {
	ArrowLeft,
	Calendar,
	Clock,
	Tag as TagIcon,
	BookOpen,
	PenLine,
	Home,
} from 'lucide-react';
import { SeriesNav } from '@/lib/components/SeriesNav';
import { Button, Tag, Prose } from '@/lib/components/ui';

interface BlogPostPageProps {
	post?: BlogPost;
	prev: BlogPost | null;
	next: BlogPost | null;
}

export default function BlogPostPage({ post, prev, next }: BlogPostPageProps) {
	if (!post) {
		return (
			<Layout>
				<section className="relative flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
					{/* Background glow */}
					<div className="absolute inset-0 -z-10 overflow-hidden">
						<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-accent-500/10 blur-3xl" />
					</div>

					<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-800 mb-6">
						<PenLine className="h-8 w-8 text-surface-500" />
					</div>
					<h1 className="font-display text-3xl font-bold text-surface-100">
						Post Not Found
					</h1>
					<p className="mt-4 text-surface-400 max-w-md">
						The blog post you're looking for doesn't exist or has been moved.
					</p>
					<div className="mt-8 flex items-center gap-4">
						<Button as="a" href="/blog" variant="primary">
							<ArrowLeft className="h-4 w-4" />
							Back to Blog
						</Button>
						<Button as="a" href="/" variant="secondary">
							<Home className="h-4 w-4" />
							Home
						</Button>
					</div>
				</section>
			</Layout>
		);
	}

	const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});

	return (
		<Layout>
			<div className="relative py-24 sm:py-32">
				{/* Background accents */}
				<div className="absolute inset-0 -z-10 overflow-hidden">
					<div className="absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-accent-500/5 blur-3xl" />
					<div className="absolute -left-40 bottom-1/4 h-[400px] w-[400px] rounded-full bg-accent-600/5 blur-3xl" />
				</div>

				<div className="mx-auto max-w-4xl px-6 sm:px-8 lg:px-12">
					{/* Back link */}
					<Link
						to="/blog"
						className="inline-flex items-center gap-2 text-sm text-surface-400 hover:text-accent-400 group"
					>
						<ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
						Back to Blog
					</Link>

					<ViewTransition name={`blog-${post.slug}`}>
						<article className="mt-8">
							{/* Header */}
							<header>
								{/* Series badge */}
								{post.series && (
									<div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent-500/10 border border-accent-500/20 px-4 py-2 text-sm font-medium text-accent-400">
										<BookOpen className="h-4 w-4" />
										<span>
											{post.series.title} &middot; Part {post.series.part} of{' '}
											{post.series.totalParts}
										</span>
									</div>
								)}

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
								</div>

								{/* Title */}
								<h1 className="mt-6 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-surface-100">
									{post.title}
								</h1>

								{/* Description */}
								<p className="mt-6 text-xl text-surface-400 leading-relaxed">
									{post.description}
								</p>

								{/* Tags */}
								<div className="mt-6 flex flex-wrap gap-2">
									{post.tags.map((tag) => (
										<Tag
											key={tag}
											variant="accent"
											className="inline-flex items-center gap-1.5"
										>
											<TagIcon className="h-3 w-3" />
											{tag}
										</Tag>
									))}
								</div>
							</header>

							{/* Content */}
							<Prose className="mt-12 prose-headings:scroll-mt-24">
								<post.Content />

								<SeriesNav post={post} prev={prev} next={next} />
							</Prose>
						</article>
					</ViewTransition>
				</div>
			</div>
		</Layout>
	);
}
