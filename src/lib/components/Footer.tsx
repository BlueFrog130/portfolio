import { links, profile } from '@/lib/data';

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="border-t border-surface-200 bg-surface-50">
			<div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
				<div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
					<p className="text-sm text-surface-500">
						&copy; {currentYear} {profile.name}. All rights reserved.
					</p>

					<nav aria-label="Footer navigation">
						<ul className="flex items-center gap-6" role="list">
							<li>
								<a
									href={links.github}
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm text-surface-500 hover:text-accent-600 hover:-translate-y-0.5"
								>
									GitHub
								</a>
							</li>
							<li>
								<a
									href={links.linkedin}
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm text-surface-500 hover:text-accent-600 hover:-translate-y-0.5"
								>
									LinkedIn
								</a>
							</li>
							<li>
								<a
									href={links.email}
									className="text-sm text-surface-500 hover:text-accent-600 hover:-translate-y-0.5"
								>
									Email
								</a>
							</li>
						</ul>
					</nav>
				</div>

				<p className="mt-4 text-center text-xs text-surface-600">
					Built with React 19, custom router & SSG, and View Transitions API.{' '}
					<a
						href={`${links.github}/portfolio`}
						target="_blank"
						rel="noopener noreferrer"
						className="text-accent-600 hover:text-accent-800 hover:-translate-y-0.5 underline underline-offset-2"
					>
						View source
					</a>
				</p>
			</div>
		</footer>
	);
}
