import { skills, type Skill } from '@/lib/data';
import {
	Code,
	SquareTerminal,
	Server,
	Cloud,
	type LucideIcon,
} from 'lucide-react';

const LEVEL_LABELS: Record<Skill['level'], string> = {
	1: 'Learning',
	2: 'Familiar',
	3: 'Proficient',
	4: 'Advanced',
	5: 'Expert',
};

const CATEGORY_ICONS: Record<string, LucideIcon> = {
	Languages: Code,
	Frontend: SquareTerminal,
	Backend: Server,
	'Tools & Infrastructure': Cloud,
};

function SkillBar({ skill }: { skill: Skill }) {
	const percentage = (skill.level / 5) * 100;

	return (
		<div className="group">
			<div className="mb-1.5 flex items-center justify-between">
				<span className="text-sm font-medium text-surface-700 group-hover:text-accent-700 transition-colors">
					{skill.name}
				</span>
				<span className="text-xs text-surface-500 opacity-0 group-hover:opacity-100 transition-opacity">
					{LEVEL_LABELS[skill.level]}
				</span>
			</div>
			<div className="h-2 w-full overflow-hidden rounded-full bg-surface-100">
				<div
					className="h-full rounded-full bg-linear-to-r from-accent-400 to-accent-600 transition-all duration-500 ease-out group-hover:from-accent-500 group-hover:to-accent-700"
					style={{ width: `${percentage}%` }}
				/>
			</div>
		</div>
	);
}

export function Skills() {
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

				{/* Legend */}
				<div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-surface-500">
					<span className="font-medium">Proficiency:</span>
					{([1, 2, 3, 4, 5] as const).map((level) => (
						<div key={level} className="flex items-center gap-1.5">
							<div className="flex gap-0.5">
								{[1, 2, 3, 4, 5].map((dot) => (
									<div
										key={dot}
										className={`h-1.5 w-1.5 rounded-full ${
											dot <= level ? 'bg-accent-500' : 'bg-surface-200'
										}`}
									/>
								))}
							</div>
							<span>{LEVEL_LABELS[level]}</span>
						</div>
					))}
				</div>

				<div className="mt-12 grid gap-8 sm:grid-cols-2">
					{skills.map((category, index) => {
						const Icon = CATEGORY_ICONS[category.title] || Code;
						return (
							<div
								key={category.title}
								className="rounded-xl border border-surface-200 bg-white p-6"
								style={{ animationDelay: `${index * 0.1}s` }}
							>
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-100">
										<Icon className="h-5 w-5 text-accent-600" />
									</div>
									<h3 className="text-lg font-semibold text-surface-900">
										{category.title}
									</h3>
								</div>

								<div className="mt-6 space-y-4">
									{category.skills.map((skill) => (
										<SkillBar key={skill.name} skill={skill} />
									))}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
