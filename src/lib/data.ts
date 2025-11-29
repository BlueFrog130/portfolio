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
	date: string;
	location: string;
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
		degree: 'Masters in Computer Science',
		date: 'Dec 2021',
		location: 'Vermillion, SD',
	},
	{
		institution: 'University of South Dakota',
		degree: 'BS in Computer Science',
		date: 'May 2021',
		location: 'Vermillion, SD',
	},
];

export const skills = {
	languages: ['JavaScript', 'TypeScript', 'C#', 'Python', 'Rust', 'Go', 'SQL'],
	frontend: ['React', 'Svelte', 'Vue', 'HTML', 'CSS', 'Tailwind'],
	backend: ['Node.js', 'ASP.NET Core', 'REST APIs', 'GraphQL'],
	tools: [
		'Docker',
		'Git',
		'CI/CD',
		'AWS',
		'Azure',
		'Google Cloud',
		'Cloudflare',
	],
};

export const links = {
	github: 'https://github.com/BlueFrog130',
	linkedin: 'https://www.linkedin.com/in/adam-grady/',
	website: 'https://gradydevelopment.com/',
	email: 'mailto:adam.grady@live.com',
};
