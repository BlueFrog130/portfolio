import { experiences } from '@/lib/data';
import { BriefcaseIcon } from '@/lib/components/ui/icon';
import { MapPin, Calendar } from 'lucide-react';
import { Card, SectionNumber, Tag } from '@/lib/components/ui';
import clsx from 'clsx';

// Calculate gradient position (0-100) for timeline dot
// Matches the line's gradient: from-accent-500 via-surface-700 to-transparent
// The "via" point (surface-700) is at 50%, so we double the rate to reach gray faster
function getGradientPosition(index: number, total: number): number {
	if (total <= 1) return 0;
	const position = (index / (total - 1)) * 100;
	// Double the rate, cap at 100%
	return Math.min(position * 2, 100);
}

export function Experience() {
	return (
		<section
			id="experience"
			className="relative py-24 sm:py-32"
			aria-labelledby="experience-heading"
		>
			{/* Background accent */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute top-1/4 right-0 h-100 w-100 rounded-full bg-accent-500/5 blur-3xl" />
			</div>

			<div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
				{/* Section header with number */}
				<div className="flex items-end gap-6 mb-16">
					<SectionNumber number={1} />
					<div>
						<h2
							id="experience-heading"
							className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-surface-100"
						>
							Experience
						</h2>
						<p className="mt-2 text-surface-400">
							My professional journey in software engineering
						</p>
					</div>
				</div>

				{/* Timeline */}
				<div className="relative">
					{/* Timeline line */}
					<div className="absolute left-0 top-2 bottom-0 w-px bg-linear-to-b from-accent-500 via-surface-700 to-transparent lg:left-1/2 lg:-translate-x-1/2" />

					<div className="space-y-12 lg:space-y-16">
						{experiences.map((exp, index) => (
							<article
								key={`${exp.company}-${exp.role}`}
								className={clsx(
									'relative lg:grid lg:grid-cols-2 lg:gap-8',
									index % 2 === 0 ? '' : 'lg:text-right',
								)}
							>
								{/* Timeline dot */}
								<div className="absolute left-0 top-0 -translate-x-1/2 lg:left-1/2">
									<div className="relative flex h-4 w-4 items-center justify-center">
										{exp.current && (
											<span className="absolute h-4 w-4 rounded-full bg-accent-500 animate-ping opacity-50" />
										)}
										<span
											className="relative h-3 w-3 rounded-full"
											style={{
												backgroundColor: `color-mix(in srgb, var(--color-surface-700) ${getGradientPosition(index, experiences.length)}%, var(--color-accent-500))`,
												boxShadow: `0 0 0 4px color-mix(in srgb, color-mix(in srgb, var(--color-surface-700) ${getGradientPosition(index, experiences.length)}%, var(--color-accent-500)) 20%, transparent)`,
											}}
										/>
									</div>
								</div>

								{/* Content */}
								<div
									className={`pl-8 lg:pl-0 ${
										index % 2 === 0
											? 'lg:pr-12'
											: 'lg:col-start-2 lg:pl-12 lg:text-left'
									}`}
								>
									<Card
										className="p-6 group hover:border-accent-500/30"
										style={{ animationDelay: `${index * 0.1}s` }}
									>
										{/* Header */}
										<div
											className={`flex items-start gap-4 ${
												index % 2 === 0 ? '' : 'lg:flex-row'
											}`}
										>
											<div
												className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-500/10 border border-accent-500/20 group-hover:bg-accent-500/20 transition-colors`}
											>
												<BriefcaseIcon className="h-5 w-5 group-hover:[--active:1] transition-transform duration-200 ease-out group-hover:-translate-y-0.5" />
											</div>

											<div className="flex-1 min-w-0">
												<div className="flex flex-wrap items-center gap-2">
													<h3 className="font-display text-lg font-semibold text-surface-100">
														{exp.role}
													</h3>
													{exp.current && (
														<Tag variant="accent" className="text-[10px]">
															Current
														</Tag>
													)}
												</div>
												<p className="mt-1 text-accent-400 font-medium">
													{exp.company}
												</p>
											</div>
										</div>

										{/* Meta */}
										<div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-surface-500">
											<span className="inline-flex items-center gap-1.5">
												<Calendar className="h-3.5 w-3.5" />
												{exp.period}
											</span>
											<span className="inline-flex items-center gap-1.5">
												<MapPin className="h-3.5 w-3.5" />
												{exp.location}
											</span>
										</div>

										{/* Description */}
										<ul className="mt-5 space-y-2.5" role="list">
											{exp.description.map((item, i) => (
												<li
													key={i}
													className={`flex items-start gap-3 text-surface-400 text-sm leading-relaxed ${
														index % 2 === 0 ? '' : 'lg:flex-row'
													}`}
												>
													<span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-500/50" />
													<span>{item}</span>
												</li>
											))}
										</ul>
									</Card>
								</div>

								{/* Empty column for alternating layout */}
								{index % 2 === 0 && <div className="hidden lg:block" />}
							</article>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
