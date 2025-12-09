// Import commands to register them
import './core';
import './fun';
import './ai';

// Re-export registry functions
export { executeCommand, getAllCommands, getCommand } from './registry';
export type { Command, CommandResult, CommandContext } from './types';
