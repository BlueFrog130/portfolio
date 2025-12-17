import { Link } from '@/lib/router';
import { type Project } from '@/content/projects';
import { Layout } from '@/lib/components/Layout';
import { Suspense, ViewTransition } from 'react';
import { ArrowLeft, FolderOpen, ExternalLink, Clock } from 'lucide-react';
import { GitHubIcon } from '@/lib/components/icons';

interface ProjectPageProps {
	project?: Project;
}

export default function ProjectDetail({ project }: ProjectPageProps) {
	if (!project) {
		return (
			<Layout>
				<div className="flex min-h-[60vh] items-center justify-center">
					<div className="text-center">
						<h1 className="text-4xl font-bold text-surface-900">
							Project Not Found
						</h1>
						<p className="mt-4 text-surface-600">
							The project you're looking for doesn't exist.
						</p>
						<Link
							to="/"
							className="group mt-6 inline-flex items-center text-accent-600 hover:text-accent-700"
						>
							<ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1" />
							Back to Home
						</Link>
					</div>
				</div>
			</Layout>
		);
	}

	return (
		<Layout>
			<div className="py-20 sm:py-24">
				<div className="mx-auto max-w-3xl px-4 sm:px-6">
					<Link
						to="/"
						className="group inline-flex items-center text-sm text-surface-600 hover:text-accent-600"
					>
						<ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1" />
						Back to Home
					</Link>

					<ViewTransition name={`project-${project.slug}`}>
						<article className="mt-8">
							<header>
								<div className="flex items-center gap-4">
									<div className="flex h-16 w-16 items-center justify-center rounded-xl bg-accent-100">
										<FolderOpen className="h-8 w-8 text-accent-600" />
									</div>
									<span className="inline-flex items-center gap-1 text-sm text-surface-500">
										<Clock className="h-4 w-4" />
										{project.readTime} min read
									</span>
								</div>

								<h1 className="mt-6 text-4xl font-bold tracking-tight text-surface-900 sm:text-5xl">
									{project.title}
								</h1>

								<p className="mt-4 text-xl text-surface-600">
									{project.description}
								</p>
							</header>

							<section className="mt-12" aria-labelledby="technologies-heading">
								<h2
									id="technologies-heading"
									className="text-lg font-semibold text-surface-900"
								>
									Technologies Used
								</h2>
								<div className="mt-4 flex flex-wrap gap-3">
									{project.technologies.map((tech) => (
										<span
											key={tech}
											className="inline-flex items-center rounded-full bg-accent-100 px-4 py-1.5 text-sm font-medium text-accent-700"
										>
											{tech}
										</span>
									))}
								</div>
							</section>

							{(project.link || project.github) && (
								<section className="mt-12" aria-labelledby="links-heading">
									<h2
										id="links-heading"
										className="text-lg font-semibold text-surface-900"
									>
										Links
									</h2>
									<div className="mt-4 flex flex-wrap gap-4">
										{project.link && (
											<a
												href={project.link}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-flex items-center rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2"
											>
												<ExternalLink className="mr-2 h-4 w-4" />
												View Live Project
											</a>
										)}
										{project.github && (
											<a
												href={project.github}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-flex items-center rounded-lg border border-surface-300 bg-white px-4 py-2 text-sm font-medium text-surface-700 hover:bg-surface-50 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2"
											>
												<GitHubIcon className="mr-2 h-4 w-4" />
												View on GitHub
											</a>
										)}
									</div>
								</section>
							)}

							<section className="prose prose-surface mt-12 max-w-none">
								<ViewTransition name="project-content">
									<Suspense>
										<project.Content />
									</Suspense>
								</ViewTransition>
							</section>
						</article>
					</ViewTransition>
				</div>
			</div>
		</Layout>
	);
}
