import { education } from '@/lib/data';

export function Education() {
	return (
		<section
			id="education"
			className="bg-surface-100/50 py-20 sm:py-24"
			aria-labelledby="education-heading"
		>
			<div className="mx-auto max-w-5xl px-4 sm:px-6">
				<h2
					id="education-heading"
					className="text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl"
				>
					Education
				</h2>

				<div className="mt-12 grid gap-6 sm:grid-cols-2">
					{education.map((edu, index) => (
						<article
							key={`${edu.institution}-${edu.degree}`}
							className="rounded-xl border border-surface-200 bg-white p-6"
							style={{ animationDelay: `${index * 0.1}s` }}
						>
							<div className="flex items-start gap-4">
								<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent-100">
									<GraduationIcon className="h-6 w-6 text-accent-600" />
								</div>

								<div>
									<h3 className="text-lg font-semibold text-surface-900">
										{edu.degree}
									</h3>
									<p className="mt-1 font-medium text-accent-600">
										{edu.institution}
									</p>
									<p className="mt-1 text-sm text-surface-500">
										{edu.date} • {edu.location}
									</p>
								</div>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}

function GraduationIcon({ className }: { className?: string }) {
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
				d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
			/>
		</svg>
	);
}
