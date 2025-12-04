import { registerCommand } from './registry';
import type { CommandResult } from './types';

// ls command - list sections as directories
registerCommand({
	name: 'ls',
	description: 'List sections as directories',
	execute: (): CommandResult => ({
		output: [
			'drwxr-xr-x  about/',
			'drwxr-xr-x  experience/',
			'drwxr-xr-x  projects/',
			'drwxr-xr-x  skills/',
			'drwxr-xr-x  education/',
			'drwxr-xr-x  research/',
			'drwxr-xr-x  contact/',
			'-rw-r--r--  resume.md',
		],
	}),
});

// cd command - navigate to section
registerCommand({
	name: 'cd',
	description: 'Navigate to section',
	usage: 'cd <section>',
	execute: (args): CommandResult => {
		if (args.length === 0) {
			return {
				output: ['Usage: cd <section>', 'Try: cd about, cd projects, etc.'],
			};
		}

		const section = args[0].replace('/', '').toLowerCase();
		const validSections = [
			'about',
			'experience',
			'projects',
			'skills',
			'education',
			'research',
			'contact',
		];

		if (section === '~' || section === '..' || section === '/') {
			return { output: [`guest@portfolio:~$`] };
		}

		if (!validSections.includes(section)) {
			return {
				output: [`cd: no such directory: ${args[0]}`],
				isError: true,
			};
		}

		return {
			output: [
				`Now in ~/${section}/`,
				`Type '${section}' to view contents, or 'cd ..' to go back.`,
			],
		};
	},
});

// cat command - display resume
registerCommand({
	name: 'cat',
	description: 'Display file contents',
	usage: 'cat <file>',
	execute: (args, ctx): CommandResult => {
		if (args.length === 0) {
			return { output: ['Usage: cat <file>'], isError: true };
		}

		const file = args[0].toLowerCase();

		if (file === 'resume.md' || file === 'resume') {
			const { profile, experiences, skills } = ctx.content;
			return {
				output: [
					`# ${profile.name}`,
					'',
					`## ${profile.title}`,
					'',
					profile.summary,
					'',
					'## Experience',
					'',
					...experiences.flatMap((e) => [
						`### ${e.company} - ${e.role}`,
						`${e.period}`,
						...e.description.map((d) => `- ${d}`),
						'',
					]),
					'## Skills',
					'',
					`Languages: ${skills.languages.join(', ')}`,
					`Frontend: ${skills.frontend.join(', ')}`,
					`Backend: ${skills.backend.join(', ')}`,
					`Tools: ${skills.tools.join(', ')}`,
				],
			};
		}

		return {
			output: [`cat: ${args[0]}: No such file or directory`],
			isError: true,
		};
	},
});

// neofetch command - system info style display
registerCommand({
	name: 'neofetch',
	description: 'Display system info style output',
	execute: (_, ctx): CommandResult => {
		const { profile, skills } = ctx.content;
		return {
			output: [
				'',
				'       ██████╗  ██████╗       guest@portfolio',
				'      ██╔════╝ ██╔════╝       ───────────────',
				'      ██║  ███╗██║  ███╗      OS: React 19 + Vite',
				'      ██║   ██║██║   ██║      Host: Cloudflare Pages',
				'      ╚██████╔╝╚██████╔╝      Kernel: TypeScript 5.x',
				'       ╚═════╝  ╚═════╝       Shell: Terminal Mode v1.0',
				'',
				`      Name: ${profile.name}`,
				`      Role: ${profile.title}`,
				`      Languages: ${skills.languages.slice(0, 4).join(', ')}`,
				`      Frontend: ${skills.frontend.slice(0, 4).join(', ')}`,
				`      Backend: ${skills.backend.slice(0, 3).join(', ')}`,
				`      Cloud: AWS, Azure, GCP, Cloudflare`,
				'',
			],
		};
	},
});

// cowsay command - ASCII cow
registerCommand({
	name: 'cowsay',
	description: 'Make a cow say something',
	usage: 'cowsay <message>',
	execute: (args): CommandResult => {
		const message = args.length > 0 ? args.join(' ') : 'Moo!';
		const maxLen = Math.min(message.length, 40);
		const padding = Math.max(0, maxLen - message.length);

		return {
			output: [
				` ${'_'.repeat(maxLen + 2)}`,
				`< ${message}${' '.repeat(padding)} >`,
				` ${'-'.repeat(maxLen + 2)}`,
				'        \\   ^__^',
				'         \\  (oo)\\_______',
				'            (__)\\       )\\/\\',
				'                ||----w |',
				'                ||     ||',
			],
		};
	},
});

// sudo command - easter egg
registerCommand({
	name: 'sudo',
	description: 'Try to get root access',
	execute: (args): CommandResult => {
		if (args.length === 0) {
			return {
				output: ['usage: sudo <command>'],
			};
		}

		return {
			output: [
				'',
				'  ╔════════════════════════════════════════╗',
				"  ║  Nice try, but you don't have root    ║",
				'  ║  access to this portfolio!            ║',
				'  ║                                        ║',
				'  ║  This incident will be reported.       ║',
				"  ║  (just kidding, it won't)             ║",
				'  ╚════════════════════════════════════════╝',
				'',
			],
		};
	},
});

// whoami command
registerCommand({
	name: 'whoami',
	description: 'Display current user',
	execute: (): CommandResult => ({
		output: ['guest'],
	}),
});

// pwd command
registerCommand({
	name: 'pwd',
	description: 'Print working directory',
	execute: (): CommandResult => ({
		output: ['/home/guest/adam-grady-portfolio'],
	}),
});

// echo command
registerCommand({
	name: 'echo',
	description: 'Echo a message',
	execute: (args): CommandResult => ({
		output: [args.join(' ')],
	}),
});
