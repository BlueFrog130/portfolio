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

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
	Languages: 'Core programming languages I work with',
	Frontend: 'UI frameworks and design tools',
	Backend: 'Server-side technologies and APIs',
	'Tools & Infrastructure': 'DevOps and cloud platforms',
};

function SkillPill({ skill }: { skill: Skill }) {
	// Size and opacity based on level
	const sizeClasses = {
		1: 'text-xs px-2.5 py-1',
		2: 'text-xs px-3 py-1.5',
		3: 'text-sm px-3.5 py-1.5',
		4: 'text-sm px-4 py-2',
		5: 'text-base px-4 py-2 font-semibold',
	};

	const opacityClasses = {
		1: 'opacity-50',
		2: 'opacity-60',
		3: 'opacity-75',
		4: 'opacity-90',
		5: 'opacity-100',
	};

	return (
		<div
			className={`group relative tag tag-accent ${sizeClasses[skill.level]} ${opacityClasses[skill.level]} hover:opacity-100 cursor-default`}
		>
			{skill.name}
			{/* Tooltip on hover */}
			<span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-surface-800 text-xs text-surface-300 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-surface-700">
				{LEVEL_LABELS[skill.level]}
			</span>
		</div>
	);
}

export function Skills() {
	return (
		<section
			id="skills"
			className="relative py-24 sm:py-32"
			aria-labelledby="skills-heading"
		>
			{/* Background accents */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute right-1/4 top-0 h-[400px] w-[400px] rounded-full bg-accent-500/5 blur-3xl" />
			</div>

			<div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
				{/* Section header */}
				<div className="flex items-end gap-6 mb-16">
					<span className="section-number">03</span>
					<div>
						<h2
							id="skills-heading"
							className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-surface-100"
						>
							Skills & Technologies
						</h2>
						<p className="mt-2 text-surface-400">
							Technologies I work with to build modern applications
						</p>
					</div>
				</div>

				{/* Skills grid - Bento style */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
					{skills.map((category, index) => {
						const Icon = CATEGORY_ICONS[category.title] || Code;
						const description = CATEGORY_DESCRIPTIONS[category.title] || '';

						// Sort skills by level (highest first)
						const sortedSkills = [...category.skills].sort(
							(a, b) => b.level - a.level
						);

						// Expert skills count
						const expertCount = sortedSkills.filter(
							(s) => s.level >= 4
						).length;

						return (
							<div
								key={category.title}
								className="card p-6 group hover:border-accent-500/30"
								style={{ animationDelay: `${index * 0.1}s` }}
							>
								{/* Header */}
								<div className="flex items-start justify-between gap-4">
									<div className="flex items-center gap-4">
										<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-500/10 border border-accent-500/20 group-hover:bg-accent-500/20 transition-colors">
											<Icon className="h-5 w-5 text-accent-400" />
										</div>
										<div>
											<h3 className="font-display text-lg font-semibold text-surface-100">
												{category.title}
											</h3>
											<p className="text-sm text-surface-500">{description}</p>
										</div>
									</div>

									{/* Expert count badge */}
									<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-500/10 border border-accent-500/20">
										<span className="text-xs font-semibold text-accent-400">
											{expertCount}
										</span>
										<span className="text-xs text-surface-500">advanced+</span>
									</div>
								</div>

								{/* Skills cloud */}
								<div className="mt-6 flex flex-wrap gap-2">
									{sortedSkills.map((skill) => (
										<SkillPill key={skill.name} skill={skill} />
									))}
								</div>

								{/* Level legend */}
								<div className="mt-6 pt-4 border-t border-surface-800">
									<div className="flex items-center justify-between text-xs text-surface-500">
										<span>Size indicates proficiency level</span>
										<div className="flex items-center gap-3">
											<span className="flex items-center gap-1">
												<span className="h-1.5 w-1.5 rounded-full bg-accent-500/40" />
												Learning
											</span>
											<span className="flex items-center gap-1">
												<span className="h-2 w-2 rounded-full bg-accent-500" />
												Expert
											</span>
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>

				{/* Additional skills summary */}
				<div className="mt-12 card card-accent p-8">
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
						<div>
							<h3 className="font-display text-xl font-semibold text-surface-100">
								Always Learning
							</h3>
							<p className="mt-2 text-surface-400 max-w-xl">
								I'm passionate about staying current with emerging technologies.
								Currently exploring AI/ML integration, Rust, and edge computing.
							</p>
						</div>
						<div className="flex flex-wrap gap-2">
							{['AI/ML', 'Rust', 'Edge Computing', 'WebAssembly'].map((tech) => (
								<span key={tech} className="tag">
									{tech}
								</span>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
