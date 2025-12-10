import { experiences } from '@/lib/data';

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

				<div className="group/list mt-12 space-y-4">
					{experiences.map((exp, index) => (
						<article
							key={`${exp.company}-${exp.role}`}
							className="group relative pl-8 transition-opacity duration-300 group-has-[article:hover]/list:opacity-40 hover:opacity-100! after:absolute after:left-[5px] after:top-5 after:h-[calc(100%+1rem)] after:w-0.5 after:bg-surface-200 last:after:hidden"
							style={{ animationDelay: `${index * 0.1}s` }}
						>
							{/* Timeline dot with ping effect on hover */}
							<span className="absolute left-0 top-2 flex h-3 w-3">
								<span className="absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-0 group-hover:animate-ping group-hover:opacity-75" />
								<span className="relative inline-flex h-3 w-3 rounded-full bg-accent-500" />
							</span>
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
			</div>
		</section>
	);
}
