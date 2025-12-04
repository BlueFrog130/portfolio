import { skills } from '@/lib/data';
import { Code, SquareTerminal, Server, Cloud } from 'lucide-react';

export function Skills() {
	const skillCategories = [
		{ title: 'Languages', items: skills.languages, icon: Code },
		{ title: 'Frontend', items: skills.frontend, icon: SquareTerminal },
		{ title: 'Backend', items: skills.backend, icon: Server },
		{ title: 'Tools & Cloud', items: skills.tools, icon: Cloud },
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
										className="inline-flex items-center rounded-full border border-surface-200 bg-surface-50 px-3 py-1 text-sm font-medium text-surface-700 transition-all duration-200 hover:border-accent-300 hover:bg-accent-50 hover:text-accent-700 hover:scale-105 hover:-translate-y-0.5 cursor-default"
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
