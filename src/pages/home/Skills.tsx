import { skills } from '@/lib/data';

export function Skills() {
	const skillCategories = [
		{ title: 'Languages', items: skills.languages, icon: CodeIcon },
		{ title: 'Frontend', items: skills.frontend, icon: LayoutIcon },
		{ title: 'Backend', items: skills.backend, icon: ServerIcon },
		{ title: 'Tools & Cloud', items: skills.tools, icon: CloudIcon },
	];

	return (
		<section
			id="skills"
			className="py-20 sm:py-24"
			aria-labelledby="skills-heading"
		>
			<div className="mx-auto max-w-5xl px-4 sm:px-6">
				<h2
					id="skills-heading"
					className="text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl"
				>
					Skills & Technologies
				</h2>

				<p className="mt-4 text-lg text-surface-600">
					Technologies I work with regularly to build modern web applications.
				</p>

				<div className="mt-12 grid gap-8 sm:grid-cols-2">
					{skillCategories.map((category, index) => (
						<div
							key={category.title}
							className="rounded-xl border border-surface-200 bg-white p-6"
							style={{ animationDelay: `${index * 0.1}s` }}
						>
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-100">
									<category.icon className="h-5 w-5 text-accent-600" />
								</div>
								<h3 className="text-lg font-semibold text-surface-900">
									{category.title}
								</h3>
							</div>

							<div className="mt-4 flex flex-wrap gap-2">
								{category.items.map((skill) => (
									<span
										key={skill}
										className="inline-flex items-center rounded-full border border-surface-200 bg-surface-50 px-3 py-1 text-sm font-medium text-surface-700 transition-colors hover:border-accent-300 hover:bg-accent-50 hover:text-accent-700"
									>
										{skill}
									</span>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function CodeIcon({ className }: { className?: string }) {
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
				d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
			/>
		</svg>
	);
}

function LayoutIcon({ className }: { className?: string }) {
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
				d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"
			/>
		</svg>
	);
}

function ServerIcon({ className }: { className?: string }) {
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
				d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z"
			/>
		</svg>
	);
}

function CloudIcon({ className }: { className?: string }) {
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
				d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z"
			/>
		</svg>
	);
}
