import type { SerializedContent } from '@/lib/content';

export interface CommandResult {
	output: string[];
	isError?: boolean;
	clear?: boolean;
	enterChatMode?: { projectSlug: string; projectTitle: string };
}

export interface CommandContext {
	content: SerializedContent;
	navigate: (path: string) => void;
}

export interface Command {
	name: string;
	description: string;
	usage?: string;
	execute: (args: string[], ctx: CommandContext) => CommandResult;
}
