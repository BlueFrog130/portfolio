import type { Command, CommandContext, CommandResult } from './types';

const commands = new Map<string, Command>();

export function registerCommand(command: Command) {
	commands.set(command.name.toLowerCase(), command);
}

export function getCommand(name: string): Command | undefined {
	return commands.get(name.toLowerCase());
}

export function getAllCommands(): Command[] {
	return Array.from(commands.values());
}

export function executeCommand(
	input: string,
	ctx: CommandContext,
): CommandResult {
	const trimmed = input.trim();
	if (!trimmed) {
		return { output: [] };
	}

	const [name, ...args] = trimmed.split(/\s+/);
	const command = commands.get(name.toLowerCase());

	if (!command) {
		return {
			output: [
				`Command not found: ${name}`,
				`Type 'help' for available commands.`,
			],
			isError: true,
		};
	}

	return command.execute(args, ctx);
}
