import { registerCommand } from './registry';
import type { CommandResult } from './types';

// AI projects command
registerCommand({
	name: 'ai',
	description: 'Start AI chat session for a project',
	usage: 'ai projects [slug]',
	execute: (args, ctx): CommandResult => {
		// ai projects - list projects
		if (args.length === 0 || (args[0] === 'projects' && args.length === 1)) {
			const output = [
				'AI Project Chat',
				'',
				'Usage: ai projects <slug>',
				'',
				'Available projects:',
			];

			ctx.content.projects.forEach((p) => {
				output.push(`  ${p.slug.padEnd(20)} ${p.title}`);
			});

			output.push('');
			output.push('Example: ai projects portfolio');

			return { output };
		}

		// ai projects <slug> - enter chat mode
		if (args[0] === 'projects' && args.length >= 2) {
			const slug = args[1].toLowerCase();
			const project = ctx.content.projects.find(
				(p) => p.slug.toLowerCase() === slug,
			);

			if (!project) {
				return {
					output: [
						`Project not found: ${args[1]}`,
						'',
						'Use "ai projects" to see available projects.',
					],
					isError: true,
				};
			}

			return {
				output: [],
				enterChatMode: {
					projectSlug: project.slug,
					projectTitle: project.title,
				},
			};
		}

		// Invalid usage
		return {
			output: [
				'Invalid command.',
				'',
				'Usage:',
				'  ai projects           List available projects',
				'  ai projects <slug>    Start chat session for project',
			],
			isError: true,
		};
	},
});
