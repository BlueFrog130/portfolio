import { getFeaturedProjects } from '@/content/projects';
import { Link } from '@/lib/router';
import { ViewTransition } from 'react';

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
								className="group flex flex-col rounded-xl border border-surface-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
								style={{ animationDelay: `${index * 0.1}s` }}
							>
								<div className="flex items-start justify-between">
									<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-100">
										<ProjectIcon className="h-6 w-6 text-accent-600" />
									</div>

									{project.github && (
										<a
											href={project.github}
											target="_blank"
											rel="noopener noreferrer"
											className="text-surface-400 hover:text-accent-600"
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
										className="inline-flex items-center text-sm font-medium text-accent-600 hover:text-accent-700"
									>
										View Details
										<ArrowIcon className="ml-1 h-4 w-4" />
									</Link>
									{project.link && (
										<a
											href={project.link}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center text-sm font-medium text-surface-500 hover:text-surface-700"
										>
											Live Site
											<ExternalIcon className="ml-1 h-4 w-4" />
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

function ProjectIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={1.5}
			aria-hidden="true"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
			/>
		</svg>
	);
}

function GitHubIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden="true"
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
			/>
		</svg>
	);
}

function ArrowIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={2}
			aria-hidden="true"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M17 8l4 4m0 0l-4 4m4-4H3"
			/>
		</svg>
	);
}

function ExternalIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={2}
			aria-hidden="true"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
			/>
		</svg>
	);
}
