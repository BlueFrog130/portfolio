import { profile, links } from '@/lib/data';
import { Mail, Globe } from 'lucide-react';
import { GitHubIcon, LinkedInIcon } from '@/components/icons';

export function Contact() {
	return (
		<section
			id="contact"
			className="py-20 sm:py-24"
			aria-labelledby="contact-heading"
		>
			<div className="mx-auto max-w-5xl px-4 sm:px-6">
				<div className="mx-auto max-w-2xl text-center">
					<h2
						id="contact-heading"
						className="text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl"
					>
						Let's Connect
					</h2>

					<p className="mt-4 text-lg text-surface-600">
						I'm always open to discussing new opportunities, interesting
						projects, or just having a chat about technology.
					</p>

					<div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
						<a
							href={links.email}
							className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-accent-700 focus-visible:outline-accent-600 sm:w-auto"
						>
							<Mail className="h-5 w-5" />
							{profile.email}
						</a>

						<a
							href={links.linkedin}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-surface-300 bg-white px-6 py-3 text-sm font-semibold text-surface-700 shadow-sm hover:bg-surface-50 focus-visible:outline-accent-600 sm:w-auto"
						>
							<LinkedInIcon className="h-5 w-5" />
							Connect on LinkedIn
						</a>
					</div>

					<div className="mt-12 flex items-center justify-center gap-6">
						<a
							href={links.github}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 text-surface-500 hover:text-accent-600"
							aria-label="GitHub Profile"
						>
							<GitHubIcon className="h-6 w-6" />
							<span className="text-sm font-medium">GitHub</span>
						</a>

						<span className="h-4 w-px bg-surface-300" aria-hidden="true" />

						<a
							href={links.website}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 text-surface-500 hover:text-accent-600"
							aria-label="Grady Development Website"
						>
							<Globe className="h-6 w-6" />
							<span className="text-sm font-medium">Grady Development</span>
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}
