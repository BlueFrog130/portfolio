import { getFeaturedProjects } from '@/content/projects';
import { Link } from '@/lib/router';
import { ViewTransition } from 'react';
import { FolderOpen, ArrowRight, ExternalLink } from 'lucide-react';
import { GitHubIcon } from '@/components/icons';

export function Projects() {
	const featuredProjects = getFeaturedProjects();

	return (
		<section
			id="projects"
			className="bg-surface-100/50 py-20 sm:py-24"
			aria-labelledby="projects-heading"
		>
			<div className="mx-auto max-w-5xl px-4 sm:px-6">
				<h2
					id="projects-heading"
					className="text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl"
				>
					Featured Projects
				</h2>

				<p className="mt-4 text-lg text-surface-600">
					A selection of projects I've built and contributed to.
				</p>

				<div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
					{featuredProjects.map((project, index) => (
						<ViewTransition name={`PROJECT-${project.slug}`} key={project.slug}>
							<article
								className="group flex flex-col rounded-xl border border-surface-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1"
								style={{ animationDelay: `${index * 0.1}s` }}
							>
								<div className="flex items-start justify-between">
									<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-100">
										<FolderOpen className="h-6 w-6 text-accent-600" />
									</div>

									{project.github && (
										<a
											href={project.github}
											target="_blank"
											rel="noopener noreferrer"
											className="text-surface-400 hover:text-accent-600 hover:scale-110"
											aria-label={`View ${project.title} on GitHub`}
										>
											<GitHubIcon className="h-5 w-5" />
										</a>
									)}
								</div>

								<h3 className="mt-4 text-lg font-semibold text-surface-900 group-hover:text-accent-600">
									<Link
										to={`/projects/${project.slug}`}
										className="hover:underline focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 rounded"
									>
										{project.title}
									</Link>
								</h3>

								<p className="mt-2 flex-1 text-sm text-surface-600">
									{project.description}
								</p>

								<div className="mt-4 flex flex-wrap gap-2">
									{project.technologies.slice(0, 4).map((tech) => (
										<span
											key={tech}
											className="inline-flex items-center rounded-full bg-surface-100 px-2.5 py-0.5 text-xs font-medium text-surface-600"
										>
											{tech}
										</span>
									))}
								</div>

								<div className="mt-4 flex items-center gap-4">
									<Link
										to={`/projects/${project.slug}`}
										className="group/link inline-flex items-center text-sm font-medium text-accent-600 hover:text-accent-700"
									>
										View Details
										<ArrowRight className="ml-1 h-4 w-4 group-hover/link:translate-x-1" />
									</Link>
									{project.link && (
										<a
											href={project.link}
											target="_blank"
											rel="noopener noreferrer"
											className="group/ext inline-flex items-center text-sm font-medium text-surface-500 hover:text-surface-700"
										>
											Live Site
											<ExternalLink className="ml-1 h-4 w-4 group-hover/ext:scale-110" />
										</a>
									)}
								</div>
							</article>
						</ViewTransition>
					))}
				</div>
			</div>
		</section>
	);
}
