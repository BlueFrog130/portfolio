import { useParams, Link } from '@/lib/router';
import { getProject } from '@content/projects';
import { Layout } from '@/components/Layout';
import { Suspense } from 'react';
import { ViewTransition } from 'react';

export default function ProjectDetail() {
	const { slug } = useParams();
	const project = slug ? getProject(slug) : undefined;

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
							className="mt-6 inline-flex items-center text-accent-600 hover:text-accent-700"
						>
							<BackIcon className="mr-2 h-4 w-4" />
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
						className="inline-flex items-center text-sm text-surface-600 hover:text-accent-600"
					>
						<BackIcon className="mr-2 h-4 w-4" />
						Back to Home
					</Link>

					<ViewTransition name={`PROJECT-${project.slug}`}>
						<article className="mt-8">
							<header>
								<div className="flex h-16 w-16 items-center justify-center rounded-xl bg-accent-100">
									<ProjectIcon className="h-8 w-8 text-accent-600" />
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
												className="inline-flex items-center rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2"
											>
												<ExternalLinkIcon className="mr-2 h-4 w-4" />
												View Live Project
											</a>
										)}
										{project.github && (
											<a
												href={project.github}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-flex items-center rounded-lg border border-surface-300 bg-white px-4 py-2 text-sm font-medium text-surface-700 hover:bg-surface-50 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2"
											>
												<GitHubIcon className="mr-2 h-4 w-4" />
												View on GitHub
											</a>
										)}
									</div>
								</section>
							)}

							<section className="prose prose-surface mt-12 max-w-none">
								<Suspense
									fallback={
										<div className="animate-pulse h-64 bg-surface-100 rounded-lg" />
									}
								>
									<ViewTransition name="project-content">
										<project.Content />
									</ViewTransition>
								</Suspense>
							</section>
						</article>
					</ViewTransition>
				</div>
			</div>
		</Layout>
	);
}

function BackIcon({ className }: { className?: string }) {
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
				d="M10 19l-7-7m0 0l7-7m-7 7h18"
			/>
		</svg>
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

function ExternalLinkIcon({ className }: { className?: string }) {
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
