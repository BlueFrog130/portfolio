import { registerCommand } from './registry';
import type { CommandResult } from './types';

// Help command
registerCommand({
	name: 'help',
	description: 'Show available commands',
	execute: (): CommandResult => ({
		output: [
			'Available commands:',
			'',
			'  help          Show this help message',
			'  about         Display profile information',
			'  experience    List work experience',
			'  projects      List projects (use: projects <slug> for details)',
			'  skills        Show skills by category',
			'  education     Show education history',
			'  research      Show research experience',
			'  contact       Display contact information',
			'  clear         Clear the terminal',
			'  exit          Switch to web mode',
			'',
			'AI commands:',
			'  ai projects             List available projects for AI chat',
			'  ai projects <slug>      Start AI chat session for a project',
			'',
			'Fun commands:',
			'  ls            List sections as directories',
			'  cd <section>  Navigate to section content',
			'  cat resume.md Display formatted resume',
			'  neofetch      Show system info style display',
			'  cowsay <msg>  Make a cow say something',
			'  sudo          Try to get root access',
		],
	}),
});

// About command
registerCommand({
	name: 'about',
	description: 'Display profile information',
	execute: (_, ctx): CommandResult => {
		const { profile } = ctx.content;
		return {
			output: [
				`┌${'─'.repeat(52)}┐`,
				`│  ${profile.name.padEnd(48)}  │`,
				`│  ${profile.title.padEnd(48)}  │`,
				`├${'─'.repeat(52)}┤`,
				`│  ${profile.summary.slice(0, 48).padEnd(48)}  │`,
				`│  ${profile.summary.slice(48, 96).padEnd(48)}  │`,
				`│  ${profile.summary.slice(96, 144).padEnd(48)}  │`,
				`└${'─'.repeat(52)}┘`,
			],
		};
	},
});

// Experience command
registerCommand({
	name: 'experience',
	description: 'List work experience',
	execute: (_, ctx): CommandResult => {
		const output: string[] = ['Work Experience:', ''];

		ctx.content.experiences.forEach((exp) => {
			output.push(
				`  ${exp.company} - ${exp.role}${exp.current ? ' (Current)' : ''}`,
			);
			output.push(`  ${exp.period} | ${exp.location}`);
			exp.description.forEach((d) => output.push(`    • ${d}`));
			output.push('');
		});

		return { output };
	},
});

// Projects command
registerCommand({
	name: 'projects',
	description: 'List projects or show project details',
	usage: 'projects [slug]',
	execute: (args, ctx): CommandResult => {
		if (args.length === 0) {
			const output = ['Projects:', ''];
			ctx.content.projects.forEach((p) => {
				const featured = p.featured ? ' ★' : '';
				output.push(`  ${p.slug.padEnd(20)} ${p.title}${featured}`);
			});
			output.push('');
			output.push('Use: projects <slug> for details');
			return { output };
		}

		const project = ctx.content.projects.find(
			(p) => p.slug.toLowerCase() === args[0].toLowerCase(),
		);
		if (!project) {
			return {
				output: [`Project not found: ${args[0]}`],
				isError: true,
			};
		}

		const output = [
			project.title,
			'─'.repeat(project.title.length),
			'',
			project.description,
			'',
			`Technologies: ${project.technologies.join(', ')}`,
		];

		if (project.link) output.push(`Link: ${project.link}`);
		if (project.github) output.push(`GitHub: ${project.github}`);

		return { output };
	},
});

// Skills command
registerCommand({
	name: 'skills',
	description: 'Show skills by category',
	execute: (_, ctx): CommandResult => {
		const { skills } = ctx.content;
		return {
			output: [
				'Technical Skills:',
				'',
				`  Languages:  ${skills.languages.join(', ')}`,
				`  Frontend:   ${skills.frontend.join(', ')}`,
				`  Backend:    ${skills.backend.join(', ')}`,
				`  Tools:      ${skills.tools.join(', ')}`,
			],
		};
	},
});

// Education command
registerCommand({
	name: 'education',
	description: 'Show education history',
	execute: (_, ctx): CommandResult => {
		const output = ['Education:', ''];

		ctx.content.education.forEach((e) => {
			output.push(`  ${e.degree}`);
			output.push(`  ${e.institution} | ${e.date}`);
			output.push(`  ${e.location}`);
			output.push('');
		});

		return { output };
	},
});

// Research command
registerCommand({
	name: 'research',
	description: 'Show research experience',
	execute: (_, ctx): CommandResult => {
		const output = ['Research Experience:', ''];

		ctx.content.research.forEach((r) => {
			output.push(`  ${r.institution} - ${r.role}`);
			output.push(`  ${r.period} | ${r.location}`);
			output.push(`  ${r.description}`);
			output.push('');
		});

		return { output };
	},
});

// Contact command
registerCommand({
	name: 'contact',
	description: 'Display contact information',
	execute: (_, ctx): CommandResult => {
		const { profile, links } = ctx.content;
		return {
			output: [
				'Contact Information:',
				'',
				`  Email:    ${profile.email}`,
				`  Phone:    ${profile.phone}`,
				`  GitHub:   ${links.github}`,
				`  LinkedIn: ${links.linkedin}`,
				`  Website:  ${links.website}`,
			],
		};
	},
});

// Clear command
registerCommand({
	name: 'clear',
	description: 'Clear the terminal',
	execute: (): CommandResult => ({
		output: [],
		clear: true,
	}),
});

// Exit command
registerCommand({
	name: 'exit',
	description: 'Switch to web mode',
	execute: (_, ctx): CommandResult => {
		ctx.navigate('/');
		return { output: ['Switching to web mode...'] };
	},
});
