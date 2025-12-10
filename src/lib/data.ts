export interface Experience {
	company: string;
	role: string;
	location: string;
	period: string;
	description: string[];
	current?: boolean;
}

export interface Education {
	institution: string;
	degree: string;
	field: string;
	startDate: string;
	endDate: string;
	location: string;
	highlight?: string;
	activities?: string[];
	skills?: string[];
}

export interface Research {
	institution: string;
	role: string;
	period: string;
	location: string;
	description: string;
}

export const profile = {
	name: 'Adam Grady',
	title: 'Senior Software Engineer',
	summary:
		'Experienced Software Engineer specializing in full-stack web development with React, TypeScript, and modern web technologies. Passionate about building performant, accessible applications.',
	email: 'adam.grady@live.com',
	phone: '402.616.5375',
};

export const experiences: Experience[] = [
	{
		company: 'Solarity Health',
		role: 'Senior Software Engineer',
		location: 'Sioux Falls, SD',
		period: 'May 2019 - Present',
		current: true,
		description: [
			'Full-stack web developer working with JavaScript, TypeScript, React, CSS, HTML, C#, and SQL',
			'Led migration to modern tech stack, championing TypeScript and React adoption',
			'Created internal full-stack web application for billing and operating system configuration using ASP.NET Core and Vue',
		],
	},
	{
		company: 'Grady Development',
		role: 'Founder',
		location: 'Vermillion, SD',
		period: 'Jan 2022 - Present',
		current: true,
		description: [
			'Founded software development company providing custom solutions to small businesses',
			'Developed SEO-optimized websites achieving first-page search rankings',
			'Created wMammogram, an interactive course that substantially increased mammogram awareness',
			'Deployed applications across AWS, Azure, Google Cloud, and Cloudflare',
		],
	},
];

export const research: Research[] = [
	{
		institution: 'University of South Dakota',
		role: 'Graduate Assistant',
		period: 'Jan 2021 - Jun 2022',
		location: 'Vermillion, SD',
		description:
			'Built CodingStub, a full-stack online coding environment using containerized microservices. Taught lectures and mentored students.',
	},
	{
		institution: 'University of South Dakota',
		role: 'Research Assistant',
		period: 'Jan 2019 - May 2020',
		location: 'Vermillion, SD',
		description:
			'Researched Software-Defined Networking in cloud environments. Presented findings at 2020 IETC Conference and USD Research Fair.',
	},
];

export const education: Education[] = [
	{
		institution: 'University of South Dakota',
		degree: 'Master of Science',
		field: 'Computer Science',
		startDate: 'Aug 2020',
		endDate: 'Dec 2021',
		location: 'Vermillion, SD',
		highlight: '4+1 Accelerated Program',
		skills: [
			'Machine Learning',
			'Artificial Intelligence',
			'Databases',
			'Mentoring',
			'Teaching',
		],
	},
	{
		institution: 'University of South Dakota',
		degree: 'Bachelor of Science',
		field: 'Computer Science',
		startDate: 'Aug 2017',
		endDate: 'May 2021',
		location: 'Vermillion, SD',
		activities: ['ACM', 'Research', 'eSports'],
		skills: [
			'Web Development',
			'Core Java',
			'Databases',
			'Machine Learning',
			'Programming',
		],
	},
];

export interface Skill {
	name: string;
	level: 1 | 2 | 3 | 4 | 5; // 1=Learning, 2=Familiar, 3=Proficient, 4=Advanced, 5=Expert
}

export interface SkillCategory {
	title: string;
	skills: Skill[];
}

export const skills: SkillCategory[] = [
	{
		title: 'Languages',
		skills: [
			{ name: 'TypeScript', level: 5 },
			{ name: 'JavaScript', level: 5 },
			{ name: 'C#', level: 5 },
			{ name: 'SQL', level: 4 },
			{ name: 'Python', level: 3 },
			{ name: 'Java', level: 3 },
			{ name: 'Go', level: 2 },
			{ name: 'Rust', level: 2 },
		],
	},
	{
		title: 'Frontend',
		skills: [
			{ name: 'React', level: 5 },
			{ name: 'HTML', level: 5 },
			{ name: 'CSS', level: 5 },
			{ name: 'Tailwind', level: 5 },
			{ name: 'Vue', level: 4 },
			{ name: 'Svelte', level: 3 },
			{ name: 'UI Design', level: 4 },
			{ name: 'UX Design', level: 3 },
		],
	},
	{
		title: 'Backend',
		skills: [
			{ name: 'ASP.NET Core', level: 5 },
			{ name: '.NET', level: 5 },
			{ name: 'REST APIs', level: 5 },
			{ name: 'Node.js', level: 4 },
			{ name: 'GraphQL', level: 3 },
			{ name: 'Redis', level: 3 },
		],
	},
	{
		title: 'Tools & Infrastructure',
		skills: [
			{ name: 'Git', level: 5 },
			{ name: 'Docker', level: 4 },
			{ name: 'CI/CD', level: 4 },
			{ name: 'Azure', level: 4 },
			{ name: 'AWS', level: 3 },
			{ name: 'Cloudflare', level: 4 },
			{ name: 'Google Cloud', level: 2 },
		],
	},
];

export const links = {
	github: 'https://github.com/BlueFrog130',
	linkedin: 'https://www.linkedin.com/in/adam-grady/',
	website: 'https://gradydevelopment.com/',
	email: 'mailto:adam.grady@live.com',
};
