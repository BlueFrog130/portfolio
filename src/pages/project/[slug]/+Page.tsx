import { Link } from '@/lib/router';
import { type Project } from '@/content/projects';
import { Layout } from '@/lib/components/Layout';
import { Suspense, ViewTransition } from 'react';
import { ArrowLeft, FolderOpen, ExternalLink, Clock, Home } from 'lucide-react';
import { GitHubIcon } from '@/lib/components/icons';

interface ProjectPageProps {
	project?: Project;
}

export default function ProjectDetail({ project }: ProjectPageProps) {
	if (!project) {
		return (
			<Layout>
				<section className="relative flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
					{/* Background glow */}
					<div className="absolute inset-0 -z-10 overflow-hidden">
						<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-accent-500/10 blur-3xl" />
					</div>

					<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-800 mb-6">
						<FolderOpen className="h-8 w-8 text-surface-500" />
					</div>
					<h1 className="font-display text-3xl font-bold text-surface-100">
						Project Not Found
					</h1>
					<p className="mt-4 text-surface-400 max-w-md">
						The project you're looking for doesn't exist or has been moved.
					</p>
					<div className="mt-8 flex items-center gap-4">
						<Link to="/" className="btn btn-primary">
							<Home className="h-4 w-4" />
							Back to Home
						</Link>
					</div>
				</section>
			</Layout>
		);
	}

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
						to="/#projects"
						className="inline-flex items-center gap-2 text-sm text-surface-400 hover:text-accent-400 group"
					>
						<ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
						Back to Projects
					</Link>

					<ViewTransition name={`project-${project.slug}`}>
						<article className="mt-8">
							{/* Header */}
							<header className="card card-accent p-6 sm:p-8">
								<div className="flex flex-col sm:flex-row sm:items-start gap-6">
									<div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-accent-500/20 border border-accent-500/30">
										<FolderOpen className="h-8 w-8 text-accent-400" />
									</div>

									<div className="flex-1">
										<div className="flex items-center gap-3 text-sm text-surface-500 mb-3">
											<span className="inline-flex items-center gap-1.5">
												<Clock className="h-4 w-4" />
												{project.readTime} min read
											</span>
										</div>

										<h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-surface-100">
											{project.title}
										</h1>

										<p className="mt-4 text-lg text-surface-400 leading-relaxed">
											{project.description}
										</p>
									</div>
								</div>
							</header>

							{/* Technologies */}
							<section className="mt-8" aria-labelledby="technologies-heading">
								<h2
									id="technologies-heading"
									className="font-display text-lg font-semibold text-surface-100 mb-4"
								>
									Technologies Used
								</h2>
								<div className="flex flex-wrap gap-2">
									{project.technologies.map((tech) => (
										<span key={tech} className="tag tag-accent">
											{tech}
										</span>
									))}
								</div>
							</section>

							{/* Links */}
							{(project.link || project.github) && (
								<section className="mt-8" aria-labelledby="links-heading">
									<h2
										id="links-heading"
										className="font-display text-lg font-semibold text-surface-100 mb-4"
									>
										Links
									</h2>
									<div className="flex flex-wrap gap-4">
										{project.link && (
											<a
												href={project.link}
												target="_blank"
												rel="noopener noreferrer"
												className="btn btn-primary"
											>
												<ExternalLink className="h-4 w-4" />
												View Live Project
											</a>
										)}
										{project.github && (
											<a
												href={project.github}
												target="_blank"
												rel="noopener noreferrer"
												className="btn btn-secondary"
											>
												<GitHubIcon className="h-4 w-4" />
												View on GitHub
											</a>
										)}
									</div>
								</section>
							)}

							{/* Content */}
							<section className="mt-12 prose prose-lg max-w-none">
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
