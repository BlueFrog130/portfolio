import { profile, links } from '@/lib/data';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { Button, Card, Tag } from '@/lib/components/ui';

export function Hero() {
	return (
		<section
			className="relative min-h-screen flex items-center overflow-hidden"
			aria-labelledby="hero-heading"
		>
			{/* Ambient glow orbs */}
			<div className="absolute inset-0 -z-10 overflow-hidden">
				{/* Primary amber glow */}
				<div className="absolute -top-40 -left-40 h-125 w-125 rounded-full bg-accent-500/20 blur-[100px] animate-[blob-float-1_25s_infinite_alternate]" />
				{/* Secondary warm glow */}
				<div className="absolute top-1/4 -right-20 h-100 w-100 rounded-full bg-accent-600/15 blur-[100px] animate-[blob-float-2_30s_infinite_alternate]" />
				{/* Subtle accent */}
				<div className="absolute -bottom-32 left-1/3 h-87.5 w-87.5 rounded-full bg-accent-400/10 blur-[100px] animate-[blob-float-3_20s_infinite_alternate]" />
				{/* Grid pattern overlay */}
				<div
					className="absolute inset-0 opacity-[0.02]"
					style={{
						backgroundImage: `linear-gradient(var(--color-surface-500) 1px, transparent 1px),
							linear-gradient(90deg, var(--color-surface-500) 1px, transparent 1px)`,
						backgroundSize: '60px 60px',
					}}
				/>
			</div>

			<div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-8 lg:px-12">
				<div className="grid gap-12 lg:grid-cols-12 lg:gap-8 items-center">
					{/* Left column - Main content */}
					<div className="lg:col-span-7 space-y-8">
						{/* Greeting with accent line */}
						<div
							className="flex items-center gap-4 opacity-0 animate-slide-up"
							style={{ animationDelay: '0.1s' }}
						>
							<div className="h-px w-12 bg-linear-to-r from-accent-500 to-transparent" />
							<span className="text-sm font-medium tracking-widest text-accent-400 uppercase">
								Hello, I'm
							</span>
						</div>

						{/* Name - Massive display typography */}
						<h1
							id="hero-heading"
							className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-surface-100 opacity-0 animate-slide-up"
							style={{ animationDelay: '0.2s' }}
						>
							{profile.name.split(' ')[0]}
							<br />
							<span className="text-gradient">
								{profile.name.split(' ')[1]}
							</span>
						</h1>

						{/* Title with decorative element */}
						<div
							className="flex items-center gap-4 opacity-0 animate-slide-up"
							style={{ animationDelay: '0.3s' }}
						>
							<div className="flex h-3 w-3 items-center justify-center">
								<span className="absolute h-3 w-3 rounded-full bg-accent-500 animate-ping opacity-75" />
								<span className="relative h-2 w-2 rounded-full bg-accent-400" />
							</div>
							<p className="text-xl sm:text-2xl font-medium text-surface-300">
								{profile.title}
							</p>
						</div>

						{/* Summary */}
						<p
							className="max-w-xl text-lg leading-relaxed text-surface-400 opacity-0 animate-slide-up"
							style={{ animationDelay: '0.4s' }}
						>
							{profile.summary}
						</p>

						{/* CTA buttons */}
						<div
							className="flex flex-wrap items-center gap-4 pt-4 opacity-0 animate-slide-up"
							style={{ animationDelay: '0.5s' }}
						>
							<Button
								as="a"
								href="#contact"
								variant="primary"
								className="group"
							>
								Let's talk
								<ArrowRight className="h-4 w-4 group-hover:translate-x-1" />
							</Button>
							<Button
								as="a"
								href={links.github}
								target="_blank"
								rel="noopener noreferrer"
								variant="secondary"
								className="group"
							>
								View GitHub
								<ArrowRight className="h-4 w-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0" />
							</Button>
						</div>
					</div>

					{/* Right column - Stats/decorative */}
					<div className="lg:col-span-5 hidden lg:block">
						<div
							className="relative opacity-0 animate-scale-in"
							style={{ animationDelay: '0.6s' }}
						>
							{/* Decorative card with stats */}
							<Card className="p-8 space-y-8">
								{/* Years of experience */}
								<div className="space-y-2">
									<div className="flex items-baseline gap-2">
										<span className="font-display text-5xl font-black text-accent-400">
											6+
										</span>
										<span className="text-surface-500">years</span>
									</div>
									<p className="text-sm text-surface-400">
										Professional experience in software engineering
									</p>
								</div>

								<div className="h-px bg-linear-to-r from-surface-800 via-surface-700 to-surface-800" />

								{/* Current focus */}
								<div className="space-y-3">
									<p className="text-xs font-medium uppercase tracking-widest text-surface-500">
										Currently focused on
									</p>
									<div className="flex flex-wrap gap-2">
										{['React', 'TypeScript', 'AI Integration', '.NET'].map(
											(tech) => (
												<Tag key={tech} variant="accent">
													{tech}
												</Tag>
											),
										)}
									</div>
								</div>

								<div className="h-px bg-linear-to-r from-surface-800 via-surface-700 to-surface-800" />

								{/* Status */}
								<div className="flex items-center gap-3">
									<div className="relative flex h-3 w-3">
										<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
										<span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
									</div>
									<span className="text-sm text-surface-300">
										Available for new opportunities
									</span>
								</div>
							</Card>

							{/* Floating decorative elements */}
							<div className="absolute -z-10 -top-4 -right-4 h-24 w-24 rounded-2xl border border-accent-500/20 bg-accent-500/5" />
							<div className="absolute -z-10 -bottom-6 -left-6 h-16 w-16 rounded-xl border border-surface-700 bg-surface-800/50" />
						</div>
					</div>
				</div>

				{/* Scroll indicator */}
				<div
					className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-fade-in"
					style={{ animationDelay: '1s' }}
				>
					<span className="text-xs font-medium uppercase tracking-widest text-surface-500">
						Scroll
					</span>
					<ArrowDown className="h-4 w-4 text-surface-500 animate-bounce" />
				</div>
			</div>
		</section>
	);
}
