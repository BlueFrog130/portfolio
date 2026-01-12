import { education, research, publications } from '@/lib/data';
import {
	GraduationCap,
	Sparkles,
	FlaskConical,
	FileText,
	Calendar,
	MapPin,
} from 'lucide-react';
import { Card, SectionNumber, Tag } from '@/lib/components/ui';
import { ExternalLinkIcon } from '@/lib/components/ui/icon';

export function Education() {
	return (
		<section
			id="education"
			className="relative py-24 sm:py-32"
			aria-labelledby="education-heading"
		>
			{/* Background accents */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute left-0 bottom-1/4 h-100 w-100 rounded-full bg-accent-500/5 blur-3xl" />
				<div className="absolute right-1/4 top-1/4 h-75 w-75 rounded-full bg-accent-600/5 blur-3xl" />
			</div>

			<div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
				{/* Section header */}
				<div className="flex items-end gap-6 mb-16">
					<SectionNumber number={4} />
					<div>
						<h2
							id="education-heading"
							className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-surface-100"
						>
							Education
						</h2>
						<p className="mt-2 text-surface-400">
							Academic background and research experience
						</p>
					</div>
				</div>

				{/* Institution header card */}
				<Card variant="accent" className="p-6 lg:p-8 mb-8">
					<div className="flex flex-col sm:flex-row sm:items-center gap-6">
						<div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-accent-500/20 border border-accent-500/30">
							<GraduationCap className="h-8 w-8 text-accent-400" />
						</div>
						<div className="flex-1">
							<h3 className="font-display text-2xl font-bold text-surface-100">
								University of South Dakota
							</h3>
							<p className="mt-1 text-surface-400 flex items-center gap-2">
								<MapPin className="h-4 w-4" />
								Vermillion, SD
							</p>
						</div>
						<div className="flex flex-wrap gap-3">
							{education.map((edu) => (
								<Tag
									key={edu.degree}
									variant="accent"
									className="whitespace-nowrap"
								>
									{edu.degree}
								</Tag>
							))}
						</div>
					</div>
				</Card>

				{/* Education cards grid */}
				<div className="grid gap-6 lg:grid-cols-2">
					{education.map((edu, index) => (
						<Card
							as="article"
							key={`${edu.institution}-${edu.degree}`}
							className="p-6 group hover:border-accent-500/30"
							style={{ animationDelay: `${index * 0.1}s` }}
						>
							{/* Header */}
							<div className="flex items-start justify-between gap-4">
								<div>
									<h4 className="font-display text-xl font-semibold text-surface-100">
										{edu.degree}
									</h4>
									<p className="mt-1 text-accent-400 font-medium">
										{edu.field}
									</p>
								</div>
								<div
									className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
										index === 0
											? 'bg-accent-500/20 border border-accent-500/30'
											: 'bg-surface-800 border border-surface-700'
									}`}
								>
									<GraduationCap
										className={`h-5 w-5 ${index === 0 ? 'text-accent-400' : 'text-surface-400'}`}
									/>
								</div>
							</div>

							{/* Date */}
							<div className="mt-4 flex items-center gap-2 text-sm text-surface-500">
								<Calendar className="h-4 w-4" />
								{edu.startDate} - {edu.endDate}
							</div>

							{/* Highlight badge */}
							{edu.highlight && (
								<div className="mt-4">
									<span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-500/10 border border-accent-500/20 text-sm font-medium text-accent-400">
										<Sparkles className="h-3.5 w-3.5" />
										{edu.highlight}
									</span>
								</div>
							)}

							{/* Activities */}
							{edu.activities && edu.activities.length > 0 && (
								<div className="mt-5">
									<p className="text-xs font-medium uppercase tracking-widest text-surface-500 mb-3">
										Activities
									</p>
									<div className="flex flex-wrap gap-2">
										{edu.activities.map((activity) => (
											<Tag key={activity}>{activity}</Tag>
										))}
									</div>
								</div>
							)}

							{/* Key skills */}
							{edu.skills && edu.skills.length > 0 && (
								<div className="mt-5 pt-5 border-t border-surface-800">
									<p className="text-xs font-medium uppercase tracking-widest text-surface-500 mb-3">
										Key Skills
									</p>
									<div className="flex flex-wrap gap-2">
										{edu.skills.map((skill) => (
											<Tag key={skill} variant="accent">
												{skill}
											</Tag>
										))}
									</div>
								</div>
							)}
						</Card>
					))}
				</div>

				{/* Research Experience */}
				<div className="mt-16">
					<h3 className="flex items-center gap-3 font-display text-2xl font-bold text-surface-100 mb-8">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500/10 border border-accent-500/20">
							<FlaskConical className="h-5 w-5 text-accent-400" />
						</div>
						Research Experience
					</h3>

					<div className="grid gap-6 lg:grid-cols-2">
						{research.map((res, index) => (
							<Card
								as="article"
								key={`${res.institution}-${res.role}`}
								className="p-6 group hover:border-accent-500/30"
								style={{ animationDelay: `${index * 0.1}s` }}
							>
								<div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
									<h4 className="font-display text-lg font-semibold text-surface-100">
										{res.role}
									</h4>
									<span className="text-sm text-accent-400">
										{res.institution}
									</span>
								</div>

								<div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-surface-500">
									<span className="inline-flex items-center gap-1.5">
										<Calendar className="h-3.5 w-3.5" />
										{res.period}
									</span>
									<span className="inline-flex items-center gap-1.5">
										<MapPin className="h-3.5 w-3.5" />
										{res.location}
									</span>
								</div>

								<p className="mt-4 text-surface-400 leading-relaxed">
									{res.description}
								</p>
							</Card>
						))}
					</div>
				</div>

				{/* Publications */}
				<div className="mt-16">
					<h3 className="flex items-center gap-3 font-display text-2xl font-bold text-surface-100 mb-8">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500/10 border border-accent-500/20">
							<FileText className="h-5 w-5 text-accent-400" />
						</div>
						Publications
					</h3>

					<div className="space-y-4">
						{publications.map((pub) => (
							<a
								key={pub.title}
								href={pub.url}
								target="_blank"
								rel="noopener noreferrer"
								className="card p-6 flex flex-col sm:flex-row sm:items-center gap-4 group hover:border-accent-500/30"
							>
								<div className="flex-1">
									<h4 className="font-display text-lg font-semibold text-surface-100 group-hover:text-accent-400 transition-colors">
										{pub.title}
									</h4>
									<p className="mt-2 text-sm text-surface-500">{pub.date}</p>
								</div>
								<div className="flex items-center gap-2 text-sm font-medium text-accent-400 group-hover:text-accent-300 shrink-0">
									View on IEEE Xplore
									<ExternalLinkIcon className="h-4 w-4 group-hover:[--active:1]" />
								</div>
							</a>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
