import { education } from '@/lib/data';
import { GraduationCap } from 'lucide-react';

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
									<GraduationCap className="h-6 w-6 text-accent-600" />
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
