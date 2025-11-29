import { profile, links } from '@/lib/data';

export function Hero() {
	return (
		<section
			className="relative overflow-hidden bg-linear-to-b from-accent-50/50 to-surface-50 py-20 sm:py-32"
			aria-labelledby="hero-heading"
		>
			{/* Decorative background */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-100/50 blur-3xl" />
			</div>

			<div className="mx-auto max-w-5xl px-4 sm:px-6">
				<div className="animate-slide-up text-center">
					<p className="text-sm font-medium tracking-wide text-accent-600 sm:text-base">
						Hello, I'm
					</p>

					<h1
						id="hero-heading"
						className="mt-2 text-4xl font-bold tracking-tight text-surface-900 sm:text-5xl lg:text-6xl"
					>
						{profile.name}
					</h1>

					<p className="mt-4 text-xl font-medium text-accent-600 sm:text-2xl">
						{profile.title}
					</p>

					<p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-surface-600">
						{profile.summary}
					</p>

					<div className="mt-10 flex flex-wrap items-center justify-center gap-4">
						<a
							href="#contact"
							className="inline-flex items-center justify-center rounded-lg bg-accent-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-accent-700 focus-visible:outline-accent-600"
						>
							Get in touch
						</a>
						<a
							href={links.github}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center justify-center rounded-lg border border-surface-300 bg-white px-6 py-3 text-sm font-semibold text-surface-700 shadow-sm hover:bg-surface-50 focus-visible:outline-accent-600"
						>
							View GitHub
							<ArrowIcon className="ml-2 h-4 w-4" />
						</a>
					</div>
				</div>
			</div>
		</section>
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
