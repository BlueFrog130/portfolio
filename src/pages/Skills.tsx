import { skills, type Skill } from '@/lib/data';
import { Card, SectionNumber, Tag } from '@/lib/components/ui';
import {
	CodeIcon,
	TerminalIcon,
	ServerIcon,
	CloudIcon,
} from '@/lib/components/ui/icon';
import type { ComponentType } from 'react';

interface IconProps {
	className?: string;
	style?: React.CSSProperties;
}

const CATEGORY_ICONS: Record<string, ComponentType<IconProps>> = {
	Languages: CodeIcon,
	Frontend: TerminalIcon,
	Backend: ServerIcon,
	'Tools & Infrastructure': CloudIcon,
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
	Languages: 'Core programming languages I work with',
	Frontend: 'UI frameworks and design tools',
	Backend: 'Server-side technologies and APIs',
	'Tools & Infrastructure': 'DevOps and cloud platforms',
};

function SkillPill({ skill }: { skill: Skill }) {
	return (
		<Tag variant="accent" className="cursor-default">
			{skill.name}
		</Tag>
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
				<div className="absolute right-1/4 top-0 h-100 w-100 rounded-full bg-accent-500/5 blur-3xl" />
			</div>

			<div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
				{/* Section header */}
				<div className="flex items-end gap-6 mb-16">
					<SectionNumber number={3} />
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
						const Icon = CATEGORY_ICONS[category.title] || CodeIcon;
						const description = CATEGORY_DESCRIPTIONS[category.title] || '';

						// Sort skills by level (highest first)
						const sortedSkills = [...category.skills].sort(
							(a, b) => b.level - a.level,
						);

						return (
							<Card
								key={category.title}
								className="p-6 group hover:border-accent-500/30"
								style={{ animationDelay: `${index * 0.1}s` }}
							>
								{/* Header */}
								<div className="flex items-start justify-between gap-4">
									<div className="flex items-center gap-4">
										<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-500/10 border border-accent-500/20 group-hover:bg-accent-500/20 transition-colors">
											<Icon className="h-5 w-5 group-hover:[--active:1] transition-transform duration-200 ease-out" />
										</div>
										<div>
											<h3 className="font-display text-lg font-semibold text-surface-100">
												{category.title}
											</h3>
											<p className="text-sm text-surface-500">{description}</p>
										</div>
									</div>

									{/* Skills count badge */}
									<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-500/10 border border-accent-500/20">
										<span className="text-xs font-semibold text-accent-400">
											{sortedSkills.length}
										</span>
										<span className="text-xs text-surface-500">skills</span>
									</div>
								</div>

								{/* Skills cloud */}
								<div className="mt-6 flex flex-wrap gap-2">
									{sortedSkills.map((skill) => (
										<SkillPill key={skill.name} skill={skill} />
									))}
								</div>
							</Card>
						);
					})}
				</div>

				{/* Additional skills summary */}
				<Card variant="accent" className="mt-12 p-8">
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
							{['AI/ML', 'Rust', 'Edge Computing', 'WebAssembly'].map(
								(tech) => (
									<Tag key={tech}>{tech}</Tag>
								),
							)}
						</div>
					</div>
				</Card>
			</div>
		</section>
	);
}
