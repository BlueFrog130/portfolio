import { type ResumeData } from '@/lib/resumeTypes';

export const resume: ResumeData = {
	name: 'Adam Grady',
	title: 'Senior Software Engineer',
	summary:
		'Experienced Software Engineer aiming for a Senior Software Engineer role to leverage full-stack web development expertise and contribute to innovation in a collaborative setting.',
	location: 'Sioux Falls, SD',
	email: 'adam.grady@live.com',
	website: 'https://github.com/BlueFrog130',
	experiences: [
		{
			company: 'Solarity Health',
			title: 'Senior Software Engineer',
			start: '05/2019',
			end: 'Present',
			description:
				'Full-stack web developer - Wrote and reviewed code for JS, TS, React, CSS, HTML, C#, and SQL. Led modern migration - Pushed for the adoption of TypeScript, React, and modern standards. As an intern, created internal application - Created an internal full-stack web application to aide in configuration of billing and operating systems. Utilized a modern web stack using ASP.NET Core, and Vue.'
		},
		{
			company: 'Grady Development',
			title: 'Founder',
			start: '01/2022',
			end: 'Present',
			description:
				'Founded a software development company to provide custom software solutions to small businesses. Developed a website for a local landlord displaying properties for rent which maximized the number of rentals and landed first on search engines. Created wMammogram, an interactive web course promoting mammogram awareness that substantially increased the number of mammograms performed among those who took the course. Deployed applications to modern cloud services such as AWS, Azure, Google Cloud, and Cloudflare.'
		},
		{
			company: 'University of South Dakota',
			title: 'Graduate Assistant',
			start: '01/2021',
			end: '06/2022',
			description:
				'Both taught students and built a full-stack web application CodingStub, an online coding environment for students to practice coding problems. The application was built using a modern web stack, and containerized to provide a secure environment and split into microservices. Teaching duties included lectures and mentoring students.'
		},
		{
			company: 'University of South Dakota',
			title: 'Research Assistant',
			start: '01/2019',
			end: '05/2020',
			description:
				'Conducted research into Software-Defined Networking capabilities in cloud environments. The goal was to gain more insight into the performance, and security implications of SDN in cloud environments. Presented research at 2020 Intermountain Engineering, Technology and Computing (IETC) Conference and again at 2020 USD Research Fair.'
		}
	],
	education: [
		{
			school: 'University of South Dakota',
			degree: 'Masters in Computer Science',
			start: '01/2020',
			end: '12/2021'
		},
		{
			school: 'University of South Dakota',
			degree: 'BS in Computer Science',
			start: '08/2017',
			end: '05/2021'
		}
	],
	skills: [
		{ name: 'JavaScript', level: 'Frontend' },
		{ name: 'TypeScript', level: 'Frontend' },
		{ name: 'React', level: 'Frontend' },
		{ name: 'Vue', level: 'Frontend' },
		{ name: 'Svelte', level: 'Frontend' },
		{ name: 'CSS', level: 'Frontend' },
		{ name: 'HTML', level: 'Frontend' },
		{ name: 'C#', level: 'Backend' },
		{ name: 'Java', level: 'Backend' },
		{ name: 'Python', level: 'Backend' },
		{ name: 'Rust', level: 'Systems' },
		{ name: 'C', level: 'Systems' },
		{ name: 'C++', level: 'Systems' },
		{ name: 'SQL' },
		{ name: 'AI, MCP, Agentic Development' },
		{ name: 'UX Design' },
		{ name: 'CI/CD' },
		{ name: 'DevOps' },
		{ name: 'Docker' },
		{ name: 'Cloud Computing (AWS, Google Cloud, Azure, Cloudflare)' },
		{ name: 'Mentoring' },
		{ name: 'Teaching' },
		{ name: 'Problem Solving' },
		{ name: 'Leadership' },
		{ name: 'Communication' },
		{ name: 'Teamwork' },
		{ name: 'Passion' }
	],
	// Additional contact and publication info
	phone: '402-616-5375',
	github: 'https://github.com/BlueFrog130',
	linkedin: 'https://linkedin.com/in/adam-grady',
	publications: [
		{
			title: '2020 Experimental study of network traffic overhead in cloud environments',
			publisher: 'Intermountain Engineering, Technology and Computing (IETC)',
			year: '2020'
		}
	]
};
