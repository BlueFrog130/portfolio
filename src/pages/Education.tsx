import { education, research, publications } from '@/lib/data';
import { GraduationCap, Sparkles, FlaskConical, FileText } from 'lucide-react';

const monthMap: Record<string, number> = {
	Jan: 0,
	Feb: 1,
	Mar: 2,
	Apr: 3,
	May: 4,
	Jun: 5,
	Jul: 6,
	Aug: 7,
	Sep: 8,
	Oct: 9,
	Nov: 10,
	Dec: 11,
};

// Parse "Aug 2017" format to decimal year (e.g., 2017.58)
function parseDate(dateStr: string): number {
	const [month, year] = dateStr.split(' ');
	const monthNum = monthMap[month] ?? 0;
	return parseInt(year) + monthNum / 12;
}

export function Education() {
	// Timeline spans from Aug 2017 to Dec 2021
	const timelineStart = parseDate('Aug 2017');
	const timelineEnd = parseDate('Dec 2021');
	const totalSpan = timelineEnd - timelineStart;

	const getPosition = (dateStr: string) => {
		const date = parseDate(dateStr);
		return ((date - timelineStart) / totalSpan) * 100;
	};

	const getWidth = (start: string, end: string) => {
		const startDate = parseDate(start);
		const endDate = parseDate(end);
		return ((endDate - startDate) / totalSpan) * 100;
	};

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

				{/* Institution header */}
				<div className="mt-12 flex items-center gap-3">
					<div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent-100">
						<GraduationCap className="h-7 w-7 text-accent-600" />
					</div>
					<div>
						<h3 className="text-xl font-semibold text-surface-900">
							University of South Dakota
						</h3>
						<p className="text-sm text-surface-500">Vermillion, SD</p>
					</div>
				</div>

				{/* Horizontal Timeline */}
				<div className="mt-10">
					{/* Timeline track with year markers */}
					<div className="relative">
						{/* Background track */}
						<div className="h-3 w-full rounded-full bg-surface-200" />

						{/* Year tick marks and labels */}
						{[2018, 2019, 2020, 2021].map((year) => {
							const position = getPosition(`Jan ${year}`);
							return (
								<div
									key={year}
									className="absolute top-0 flex flex-col items-center"
									style={{
										left: `${position}%`,
										transform: 'translateX(-50%)',
									}}
								>
									<div className="h-3 w-0.5 bg-surface-400" />
									<span className="mt-2 text-xs font-medium text-surface-500">
										{year}
									</span>
								</div>
							);
						})}

						{/* Start label */}
						<div className="absolute -top-6 left-0 text-xs font-medium text-surface-500">
							Aug 2017
						</div>

						{/* End label */}
						<div className="absolute -top-6 right-0 text-xs font-medium text-surface-500">
							Dec 2021
						</div>
					</div>

					{/* Degree bars */}
					<div className="relative mt-10 space-y-4">
						{/* Bachelor's degree bar */}
						<div className="group relative h-16">
							<div
								className="absolute flex h-full items-center rounded-lg bg-linear-to-r from-accent-500 to-accent-400 px-4 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
								style={{
									left: `${getPosition(education[1].startDate)}%`,
									width: `${getWidth(education[1].startDate, education[1].endDate)}%`,
								}}
							>
								<div className="min-w-0 text-white">
									<p className="truncate font-semibold">
										{education[1].degree}
									</p>
									<p className="truncate text-sm text-accent-100">
										{education[1].field}
									</p>
								</div>
							</div>
						</div>

						{/* Master's degree bar - overlapping to show 4+1 */}
						<div className="group relative h-16">
							<div
								className="absolute flex h-full items-center rounded-lg bg-linear-to-r from-accent-700 to-accent-600 px-4 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
								style={{
									left: `${getPosition(education[0].startDate)}%`,
									width: `${getWidth(education[0].startDate, education[0].endDate)}%`,
								}}
							>
								<div className="min-w-0 text-white">
									<p className="truncate font-semibold">
										{education[0].degree}
									</p>
									<p className="truncate text-sm text-accent-200">
										{education[0].field}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Details cards */}
				<div className="mt-10 grid gap-6 sm:grid-cols-2">
					{education.map((edu, index) => (
						<article
							key={`${edu.institution}-${edu.degree}`}
							className="rounded-xl border border-surface-200 bg-white p-6 transition-shadow hover:shadow-md"
						>
							<div className="flex items-start justify-between">
								<div>
									<h4 className="text-lg font-semibold text-surface-900">
										{edu.degree}
									</h4>
									<p className="mt-1 font-medium text-accent-600">
										{edu.field}
									</p>
									<p className="mt-1 text-sm text-surface-500">
										{edu.startDate} - {edu.endDate}
									</p>
								</div>
								<div
									className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${index === 0 ? 'bg-accent-700' : 'bg-accent-500'}`}
								>
									<GraduationCap className="h-5 w-5 text-white" />
								</div>
							</div>

							{edu.highlight && (
								<div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent-100 px-3 py-1 text-sm font-medium text-accent-700">
									<Sparkles className="h-3.5 w-3.5" />
									{edu.highlight}
								</div>
							)}

							{edu.activities && edu.activities.length > 0 && (
								<div className="mt-4">
									<p className="text-xs font-medium uppercase tracking-wide text-surface-500">
										Activities
									</p>
									<div className="mt-2 flex flex-wrap gap-2">
										{edu.activities.map((activity) => (
											<span
												key={activity}
												className="rounded-full bg-surface-100 px-3 py-1 text-sm text-surface-700"
											>
												{activity}
											</span>
										))}
									</div>
								</div>
							)}

							{edu.skills && edu.skills.length > 0 && (
								<div className="mt-4">
									<p className="text-xs font-medium uppercase tracking-wide text-surface-500">
										Key Skills
									</p>
									<div className="mt-2 flex flex-wrap gap-2">
										{edu.skills.map((skill) => (
											<span
												key={skill}
												className="rounded-full border border-surface-200 bg-white px-3 py-1 text-sm text-surface-600"
											>
												{skill}
											</span>
										))}
									</div>
								</div>
							)}
						</article>
					))}
				</div>

				{/* Research Experience */}
				<h3 className="mt-16 flex items-center gap-3 text-2xl font-bold tracking-tight text-surface-900">
					<FlaskConical className="h-6 w-6 text-accent-600" />
					Research Experience
				</h3>

				<div className="mt-8 space-y-6">
					{research.map((res) => (
						<article
							key={`${res.institution}-${res.role}`}
							className="rounded-xl border border-surface-200 bg-white p-6 transition-shadow hover:shadow-md"
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

				{/* Publications */}
				<h3 className="mt-16 flex items-center gap-3 text-2xl font-bold tracking-tight text-surface-900">
					<FileText className="h-6 w-6 text-accent-600" />
					Publications
				</h3>

				<div className="mt-8 space-y-4">
					{publications.map((pub) => (
						<a
							key={pub.title}
							href={pub.url}
							target="_blank"
							rel="noopener noreferrer"
							className="group block rounded-xl border border-surface-200 bg-white p-6 transition-all hover:border-accent-300 hover:shadow-md"
						>
							<h4 className="text-lg font-semibold text-surface-900 group-hover:text-accent-600">
								{pub.title}
							</h4>
							<p className="mt-1 text-sm text-surface-500">{pub.date}</p>
							<p className="mt-2 text-sm text-accent-600 group-hover:underline">
								View on IEEE Xplore →
							</p>
						</a>
					))}
				</div>
			</div>
		</section>
	);
}
