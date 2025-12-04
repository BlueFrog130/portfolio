import { experiences, research } from '@/lib/data';

export function Experience() {
	return (
		<section
			id="experience"
			className="py-20 sm:py-24"
			aria-labelledby="experience-heading"
		>
			<div className="mx-auto max-w-5xl px-4 sm:px-6">
				<h2
					id="experience-heading"
					className="text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl"
				>
					Experience
				</h2>

				<div className="mt-12 space-y-4">
					{experiences.map((exp, index) => (
						<article
							key={`${exp.company}-${exp.role}`}
							className="relative pl-8 before:absolute before:left-0 before:top-2 before:h-3 before:w-3 before:rounded-full before:bg-accent-500 after:absolute after:left-[5px] after:top-5 after:h-[calc(100%+1rem)] after:w-0.5 after:bg-surface-200 last:after:hidden"
							style={{ animationDelay: `${index * 0.1}s` }}
						>
							<div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
								<h3 className="text-lg font-semibold text-surface-900">
									{exp.role}
								</h3>
								<span className="text-sm font-medium text-accent-600">
									{exp.company}
								</span>
							</div>

							<p className="mt-1 text-sm text-surface-500">
								{exp.period} • {exp.location}
								{exp.current && (
									<span className="ml-2 inline-flex items-center rounded-full bg-accent-100 px-2 py-0.5 text-xs font-medium text-accent-700">
										Current
									</span>
								)}
							</p>

							<ul className="mt-4 space-y-2" role="list">
								{exp.description.map((item, i) => (
									<li key={i} className="flex items-start text-surface-600">
										<span className="mr-3 mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-surface-400" />
										{item}
									</li>
								))}
							</ul>
						</article>
					))}
				</div>

				{/* Research Section */}
				<h3 className="mt-16 text-2xl font-bold tracking-tight text-surface-900">
					Research
				</h3>

				<div className="mt-8 space-y-8">
					{research.map((res) => (
						<article
							key={`${res.institution}-${res.role}`}
							className="rounded-lg border border-surface-200 p-6"
						>
							<div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
								<h4 className="text-lg font-semibold text-surface-900">
									{res.role}
								</h4>
								<span className="text-sm font-medium text-accent-600">
									{res.institution}
								</span>
							</div>

							<p className="mt-1 text-sm text-surface-500">
								{res.period} • {res.location}
							</p>

							<p className="mt-3 text-surface-600">{res.description}</p>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
