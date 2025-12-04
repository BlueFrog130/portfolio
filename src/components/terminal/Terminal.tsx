'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { executeCommand, type CommandContext } from './commands';
import { getSerializedContent } from '@/lib/content';
import { useRouter } from '@/lib/router';

interface HistoryEntry {
	input: string;
	output: string[];
	isError?: boolean;
}

const WELCOME_MESSAGE = [
	'',
	'╔═══════════════════════════════════════════════════════╗',
	'║                                                       ║',
	'║   Adam Grady\'s Portfolio Terminal                    ║',
	'║   Type \'help\' for available commands                 ║',
	'║                                                       ║',
	'╚═══════════════════════════════════════════════════════╝',
	'',
];

export function Terminal() {
	const [history, setHistory] = useState<HistoryEntry[]>([]);
	const [input, setInput] = useState('');
	const [commandHistory, setCommandHistory] = useState<string[]>([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const inputRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const { navigate } = useRouter();

	const content = getSerializedContent();

	const ctx: CommandContext = {
		content,
		navigate,
	};

	const handleSubmit = useCallback(() => {
		if (!input.trim()) {
			setHistory((prev) => [...prev, { input: '', output: [] }]);
			return;
		}

		const result = executeCommand(input, ctx);

		if (result.clear) {
			setHistory([]);
		} else {
			setHistory((prev) => [
				...prev,
				{
					input,
					output: result.output,
					isError: result.isError,
				},
			]);
		}

		if (input.trim()) {
			setCommandHistory((prev) => [...prev, input]);
		}
		setInput('');
		setHistoryIndex(-1);
	}, [input, ctx]);

	// Auto-scroll to bottom
	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollTop = containerRef.current.scrollHeight;
		}
	}, [history]);

	// Focus input on mount and click
	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	const handleContainerClick = () => {
		inputRef.current?.focus();
	};

	// Keyboard navigation
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (commandHistory.length > 0) {
				const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
				setHistoryIndex(newIndex);
				setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
			}
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (historyIndex > 0) {
				const newIndex = historyIndex - 1;
				setHistoryIndex(newIndex);
				setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
			} else if (historyIndex === 0) {
				setHistoryIndex(-1);
				setInput('');
			}
		} else if (e.key === 'Enter') {
			handleSubmit();
		} else if (e.key === 'l' && e.ctrlKey) {
			e.preventDefault();
			setHistory([]);
		}
	};

	return (
		<div
			ref={containerRef}
			onClick={handleContainerClick}
			className="min-h-screen bg-surface-950 p-4 font-mono text-sm text-surface-100 overflow-auto cursor-text"
		>
			{/* Welcome message */}
			<div className="text-accent-400">
				{WELCOME_MESSAGE.map((line, i) => (
					<div key={i} className="whitespace-pre">
						{line}
					</div>
				))}
			</div>

			{/* History */}
			<div className="space-y-2">
				{history.map((entry, i) => (
					<div key={i}>
						{/* Prompt line */}
						<div className="flex">
							<span className="text-green-400">guest</span>
							<span className="text-surface-400">@</span>
							<span className="text-blue-400">portfolio</span>
							<span className="text-surface-400">:</span>
							<span className="text-purple-400">~</span>
							<span className="text-surface-400">$ </span>
							<span className="text-surface-100">{entry.input}</span>
						</div>
						{/* Output */}
						{entry.output.length > 0 && (
							<div
								className={`whitespace-pre-wrap ${
									entry.isError ? 'text-red-400' : 'text-surface-300'
								}`}
							>
								{entry.output.map((line, j) => (
									<div key={j}>{line}</div>
								))}
							</div>
						)}
					</div>
				))}
			</div>

			{/* Input line */}
			<div className="flex mt-2">
				<span className="text-green-400">guest</span>
				<span className="text-surface-400">@</span>
				<span className="text-blue-400">portfolio</span>
				<span className="text-surface-400">:</span>
				<span className="text-purple-400">~</span>
				<span className="text-surface-400">$ </span>
				<input
					ref={inputRef}
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleKeyDown}
					className="flex-1 bg-transparent text-surface-100 outline-none caret-accent-400"
					autoComplete="off"
					spellCheck="false"
					autoCapitalize="off"
				/>
				<span className="animate-pulse text-accent-400">█</span>
			</div>
		</div>
	);
}
