import { links, profile } from '@/lib/data';
import { Heart } from 'lucide-react';

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="border-t border-surface-800 bg-surface-950">
			<div className="mx-auto max-w-6xl px-6 py-12 sm:px-8 lg:px-12">
				<div className="flex flex-col items-center gap-8">
					{/* Logo */}
					<span className="font-display text-2xl font-black text-surface-100">
						AG
					</span>

					{/* Navigation */}
					<nav aria-label="Footer navigation">
						<ul
							className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4"
							role="list"
						>
							<li>
								<a
									href={links.github}
									target="_blank"
									rel="noopener noreferrer"
									className="relative text-sm text-surface-400 hover:text-accent-400 after:content-[''] after:absolute after:-bottom-0.5 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-accent-500 after:to-accent-400 after:transition-[width] after:duration-300 after:ease-[cubic-bezier(0.16,1,0.3,1)] hover:after:w-full"
								>
									GitHub
								</a>
							</li>
							<li>
								<a
									href={links.linkedin}
									target="_blank"
									rel="noopener noreferrer"
									className="relative text-sm text-surface-400 hover:text-accent-400 after:content-[''] after:absolute after:-bottom-0.5 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-accent-500 after:to-accent-400 after:transition-[width] after:duration-300 after:ease-[cubic-bezier(0.16,1,0.3,1)] hover:after:w-full"
								>
									LinkedIn
								</a>
							</li>
							<li>
								<a
									href={links.email}
									className="relative text-sm text-surface-400 hover:text-accent-400 after:content-[''] after:absolute after:-bottom-0.5 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-accent-500 after:to-accent-400 after:transition-[width] after:duration-300 after:ease-[cubic-bezier(0.16,1,0.3,1)] hover:after:w-full"
								>
									Email
								</a>
							</li>
						</ul>
					</nav>

					{/* Divider */}
					<div className="h-px w-24 bg-gradient-to-r from-transparent via-surface-700 to-transparent" />

					{/* Tech stack & copyright */}
					<div className="text-center space-y-3">
						<p className="text-xs text-surface-500 flex items-center justify-center gap-1.5">
							Built with
							<Heart className="h-3 w-3 text-accent-500 fill-accent-500" />
							using React 19, Tailwind CSS, and Cloudflare Workers
						</p>
						<p className="text-xs text-surface-600">
							<a
								href={`${links.github}/portfolio`}
								target="_blank"
								rel="noopener noreferrer"
								className="relative text-accent-500 hover:text-accent-400 after:content-[''] after:absolute after:-bottom-0.5 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-accent-500 after:to-accent-400 after:transition-[width] after:duration-300 after:ease-[cubic-bezier(0.16,1,0.3,1)] hover:after:w-full"
							>
								View source on GitHub
							</a>
						</p>
					</div>

					{/* Copyright */}
					<p className="text-xs text-surface-600">
						&copy; {currentYear} {profile.name}. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
