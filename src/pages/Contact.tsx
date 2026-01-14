import { profile, links } from '@/lib/data';
import { GitHubIcon, LinkedInIcon } from '@/lib/components/icons';
import { Button, Card } from '@/lib/components/ui';
import { MailIcon } from '@/lib/components/ui/icon';

export function Contact() {
	return (
		<section
			id="contact"
			className="relative py-24 sm:py-32 overflow-hidden"
			aria-labelledby="contact-heading"
		>
			{/* Dramatic background */}
			<div className="absolute inset-0 -z-10">
				{/* Central glow */}
				<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-150 w-150 rounded-full bg-accent-500/10 blur-3xl" />
				{/* Grid pattern */}
				<div
					className="absolute inset-0 opacity-[0.02]"
					style={{
						backgroundImage: `linear-gradient(var(--color-surface-500) 1px, transparent 1px),
							linear-gradient(90deg, var(--color-surface-500) 1px, transparent 1px)`,
						backgroundSize: '40px 40px',
					}}
				/>
			</div>

			<div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
				<div className="relative">
					{/* Main CTA card */}
					<Card variant="accent" className="p-8 sm:p-12 lg:p-16 text-center">
						{/* Heading */}
						<h2
							id="contact-heading"
							className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-surface-100"
						>
							Let's build something
							<br />
							<span className="text-gradient">amazing together</span>
						</h2>

						<p className="mt-6 text-lg text-surface-400 max-w-2xl mx-auto leading-relaxed">
							I'm always open to discussing new opportunities, interesting
							projects, or just having a chat about technology and engineering.
						</p>

						{/* CTA Buttons */}
						<div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
							<Button
								as="a"
								href={links.email}
								variant="primary"
								className="group/mail w-full sm:w-auto"
							>
								<MailIcon className="h-5 w-5 group-hover/mail:[--active:1]" />
								{profile.email}
							</Button>

							<Button
								as="a"
								href={links.linkedin}
								target="_blank"
								rel="noopener noreferrer"
								variant="secondary"
								className="w-full sm:w-auto group/linkedin"
							>
								<LinkedInIcon className="h-5 w-5" />
								Connect on LinkedIn
							</Button>
						</div>

						{/* Social links */}
						<div className="mt-12 pt-8 border-t border-surface-800/50">
							<p className="text-xs font-medium uppercase tracking-widest text-surface-500 mb-6">
								Find me elsewhere
							</p>
							<div className="flex items-center justify-center gap-6">
								<a
									href={links.github}
									target="_blank"
									rel="noopener noreferrer"
									className="group flex items-center gap-2 text-surface-400 hover:text-accent-400"
									aria-label="GitHub Profile"
								>
									<GitHubIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
									<span className="text-sm font-medium">GitHub</span>
								</a>

								<span className="h-4 w-px bg-surface-700" aria-hidden="true" />

								<a
									href={links.linkedin}
									target="_blank"
									rel="noopener noreferrer"
									className="group flex items-center gap-2 text-surface-400 hover:text-accent-400"
									aria-label="LinkedIn Profile"
								>
									<LinkedInIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
									<span className="text-sm font-medium">LinkedIn</span>
								</a>
							</div>
						</div>
					</Card>

					{/* Decorative elements */}
					<div className="absolute -top-6 -right-6 h-32 w-32 rounded-3xl border border-accent-500/20 bg-accent-500/5 -z-10" />
					<div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-2xl border border-surface-700 bg-surface-800/50 -z-10" />
				</div>
			</div>
		</section>
	);
}
