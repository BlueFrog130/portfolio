import { profile, links } from '@/lib/data';
import { ArrowRight } from 'lucide-react';

export function Hero() {
	return (
		<section className="relative py-20 sm:py-32" aria-labelledby="hero-heading">
			{/* Animated gradient blobs */}
			<div className="absolute inset-0 -z-10">
				{/* Primary indigo blob */}
				<div className="blob blob-1 absolute h-[600px] w-[600px] rounded-full bg-linear-to-br from-accent-400/20 to-accent-600/15 blur-3xl" />
				{/* Purple accent blob */}
				<div className="blob blob-2 absolute h-[500px] w-[500px] rounded-full bg-linear-to-br from-purple-400/15 to-fuchsia-500/10 blur-3xl" />
				{/* Cyan accent blob */}
				<div className="blob blob-3 absolute h-[400px] w-[400px] rounded-full bg-linear-to-br from-cyan-400/12 to-blue-500/10 blur-3xl" />
				{/* Subtle pink blob */}
				<div className="blob blob-4 absolute h-[350px] w-[350px] rounded-full bg-linear-to-br from-pink-300/10 to-rose-400/8 blur-3xl" />
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
							className="inline-flex items-center justify-center rounded-lg bg-accent-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-accent-700 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-accent-600"
						>
							Get in touch
						</a>
						<a
							href={links.github}
							target="_blank"
							rel="noopener noreferrer"
							className="group inline-flex items-center justify-center rounded-lg border border-surface-300 bg-white px-6 py-3 text-sm font-semibold text-surface-700 shadow-sm hover:bg-surface-50 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-accent-600"
						>
							View GitHub
							<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5" />
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}
