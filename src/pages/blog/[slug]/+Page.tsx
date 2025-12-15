import { useParams, Link } from '@/lib/router';
import { getBlogPost, getAdjacentSeriesPosts } from '@/content/blog';
import { Layout } from '@/lib/components/Layout';
import { Suspense } from 'react';
import { ViewTransition } from 'react';
import { ArrowLeft, Calendar, Clock, Tag, BookOpen } from 'lucide-react';
import { SeriesNav } from '@/lib/components/SeriesNav';

export default function BlogPostPage() {
	const { slug } = useParams();
	const post = slug ? getBlogPost(slug) : undefined;

	if (!post) {
		return (
			<Layout>
				<div className="flex min-h-[60vh] items-center justify-center">
					<div className="text-center">
						<h1 className="text-4xl font-bold text-surface-900">
							Post Not Found
						</h1>
						<p className="mt-4 text-surface-600">
							The blog post you're looking for doesn't exist.
						</p>
						<Link
							to="/blog"
							className="group mt-6 inline-flex items-center text-accent-600 hover:text-accent-700"
						>
							<ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
							Back to Blog
						</Link>
					</div>
				</div>
			</Layout>
		);
	}

	const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});

	const { prev, next } = getAdjacentSeriesPosts(post);

	return (
		<Layout>
			<div className="py-20 sm:py-24">
				<div className="mx-auto max-w-3xl px-4 sm:px-6">
					<Link
						to="/blog"
						className="group inline-flex items-center text-sm text-surface-600 hover:text-accent-600"
					>
						<ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
						Back to Blog
					</Link>

					<ViewTransition name={`blog-${post.slug}`}>
						<article className="mt-8">
							<header>
								{post.series && (
									<div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent-100 px-3 py-1 text-sm font-medium text-accent-700">
										<BookOpen className="h-3.5 w-3.5" />
										<span>
											{post.series.title} &middot; Part {post.series.part} of{' '}
											{post.series.totalParts}
										</span>
									</div>
								)}
								<div className="flex flex-wrap items-center gap-4 text-sm text-surface-500">
									<span className="inline-flex items-center gap-1">
										<Calendar className="h-4 w-4" />
										{formattedDate}
									</span>
									<span className="inline-flex items-center gap-1">
										<Clock className="h-4 w-4" />
										{post.readTime} min read
									</span>
								</div>

								<h1 className="mt-4 text-4xl font-bold tracking-tight text-surface-900 sm:text-5xl">
									{post.title}
								</h1>

								<p className="mt-4 text-xl text-surface-600">
									{post.description}
								</p>

								<div className="mt-6 flex flex-wrap gap-2">
									{post.tags.map((tag) => (
										<span
											key={tag}
											className="inline-flex items-center gap-1 rounded-full bg-accent-100 px-3 py-1 text-sm font-medium text-accent-700"
										>
											<Tag className="h-3 w-3" />
											{tag}
										</span>
									))}
								</div>
							</header>

							<section className="prose prose-surface mt-12 max-w-none prose-headings:scroll-mt-24">
								<Suspense
									fallback={
										<div className="h-64 animate-pulse rounded-lg bg-surface-100" />
									}
								>
									<ViewTransition name="blog-content">
										<post.Content />
									</ViewTransition>
								</Suspense>

								<SeriesNav post={post} prev={prev} next={next} />
							</section>
						</article>
					</ViewTransition>
				</div>
			</div>
		</Layout>
	);
}
