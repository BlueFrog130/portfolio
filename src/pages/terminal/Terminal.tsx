'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { executeCommand, type CommandContext } from './commands';
import { getSerializedContent } from '@/lib/content';
import { useRouter } from '@/lib/router';

interface HistoryEntry {
	input: string;
	output: string[];
	isError?: boolean;
	isChatMode?: boolean;
	isStreaming?: boolean;
}

interface ChatMessage {
	role: 'user' | 'assistant';
	content: string;
}

interface ChatMode {
	active: boolean;
	projectSlug: string | null;
	projectTitle: string | null;
}

const WELCOME_MESSAGE = [
	'',
	'╔═══════════════════════════════════════════════════════╗',
	'║                                                       ║',
	"║   Adam Grady's Portfolio Terminal                     ║",
	"║   Type 'help' for available commands                  ║",
	'║                                                       ║',
	'╚═══════════════════════════════════════════════════════╝',
	'',
];

const STORAGE_KEY_PREFIX = 'chat_messages_';

function getStorageKey(slug: string): string {
	return `${STORAGE_KEY_PREFIX}${slug}`;
}

function loadChatMessages(slug: string): ChatMessage[] {
	try {
		const stored = sessionStorage.getItem(getStorageKey(slug));
		if (stored) {
			return JSON.parse(stored);
		}
	} catch {
		// Invalid JSON, reset
	}
	return [];
}

function saveChatMessages(slug: string, messages: ChatMessage[]): void {
	sessionStorage.setItem(getStorageKey(slug), JSON.stringify(messages));
}

function getSessionId(): string {
	let sessionId = sessionStorage.getItem('analytics_session_id');
	if (!sessionId) {
		sessionId = crypto.randomUUID();
		sessionStorage.setItem('analytics_session_id', sessionId);
	}
	return sessionId;
}

export function Terminal() {
	const [history, setHistory] = useState<HistoryEntry[]>([]);
	const [input, setInput] = useState('');
	const [commandHistory, setCommandHistory] = useState<string[]>([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const [chatMode, setChatMode] = useState<ChatMode>({
		active: false,
		projectSlug: null,
		projectTitle: null,
	});
	const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
	const [isStreaming, setIsStreaming] = useState(false);
	const [streamingContent, setStreamingContent] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const abortControllerRef = useRef<AbortController | null>(null);
	const { navigate } = useRouter();

	const content = getSerializedContent();

	const ctx: CommandContext = {
		content,
		navigate,
	};

	// Enter chat mode
	const enterChatMode = useCallback(
		(projectSlug: string, projectTitle: string) => {
			const messages = loadChatMessages(projectSlug);
			setChatMessages(messages);
			setChatMode({ active: true, projectSlug, projectTitle });

			// Show welcome message for chat mode
			const welcomeOutput = [
				'',
				`Entering AI chat mode for '${projectTitle}'`,
				"Type 'exit' to return to terminal",
				'─'.repeat(40),
				'',
			];

			// Show existing chat history
			if (messages.length > 0) {
				welcomeOutput.push('Previous conversation:');
				welcomeOutput.push('');
				messages.forEach((msg) => {
					if (msg.role === 'user') {
						welcomeOutput.push(`you> ${msg.content}`);
					} else {
						welcomeOutput.push(`ai> ${msg.content}`);
					}
					welcomeOutput.push('');
				});
				welcomeOutput.push('─'.repeat(40));
				welcomeOutput.push('');
			}

			setHistory((prev) => [
				...prev,
				{
					input: `ai projects ${projectSlug}`,
					output: welcomeOutput,
					isChatMode: true,
				},
			]);
		},
		[],
	);

	// Exit chat mode
	const exitChatMode = useCallback(() => {
		setChatMode({ active: false, projectSlug: null, projectTitle: null });
		setChatMessages([]);
		setHistory((prev) => [
			...prev,
			{
				input: 'exit',
				output: ['Exiting AI chat mode...'],
				isChatMode: true,
			},
		]);
	}, []);

	// Send message to AI
	const sendChatMessage = useCallback(
		async (message: string) => {
			if (!chatMode.projectSlug || isStreaming) return;

			const userMessage: ChatMessage = { role: 'user', content: message };
			const newMessages = [...chatMessages, userMessage];
			setChatMessages(newMessages);
			saveChatMessages(chatMode.projectSlug, newMessages);

			// Add user message to history
			setHistory((prev) => [
				...prev,
				{ input: message, output: [], isChatMode: true },
			]);

			setIsStreaming(true);
			setStreamingContent('');

			// Cancel any existing request
			abortControllerRef.current?.abort();
			abortControllerRef.current = new AbortController();

			try {
				const sessionId = getSessionId();
				const response = await fetch(
					`/api/chat/projects/${chatMode.projectSlug}`,
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							sessionId,
							messages: newMessages,
						}),
						signal: abortControllerRef.current.signal,
					},
				);

				if (!response.ok) {
					throw new Error(`Request failed: ${response.status}`);
				}

				if (!response.body) {
					throw new Error('No response body');
				}

				// Process SSE stream
				const reader = response.body.getReader();
				const decoder = new TextDecoder();
				let assistantContent = '';
				let buffer = '';

				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					buffer += decoder.decode(value, { stream: true });
					const lines = buffer.split('\n');
					buffer = lines.pop() || '';

					for (const line of lines) {
						if (line.startsWith('data: ')) {
							const data = line.slice(6);
							if (data === '[DONE]') continue;

							try {
								const parsed = JSON.parse(data);
								if (parsed.response) {
									assistantContent += parsed.response;
									setStreamingContent(assistantContent);
								}
							} catch {
								// Skip non-JSON lines
							}
						}
					}
				}

				// Save assistant message
				const assistantMessage: ChatMessage = {
					role: 'assistant',
					content: assistantContent,
				};
				const finalMessages = [...newMessages, assistantMessage];
				setChatMessages(finalMessages);
				saveChatMessages(chatMode.projectSlug, finalMessages);

				// Add final response to history
				setHistory((prev) => [
					...prev,
					{
						input: '',
						output: [assistantContent],
						isChatMode: true,
					},
				]);
			} catch (err) {
				if (err instanceof Error && err.name === 'AbortError') {
					return;
				}

				const errorMessage =
					err instanceof Error ? err.message : 'An error occurred';
				setHistory((prev) => [
					...prev,
					{
						input: '',
						output: [`Error: ${errorMessage}`],
						isError: true,
						isChatMode: true,
					},
				]);
			} finally {
				setIsStreaming(false);
				setStreamingContent('');
			}
		},
		[chatMode.projectSlug, chatMessages, isStreaming],
	);

	const handleSubmit = useCallback(() => {
		if (!input.trim()) {
			if (!chatMode.active) {
				setHistory((prev) => [...prev, { input: '', output: [] }]);
			}
			return;
		}

		// Handle chat mode
		if (chatMode.active) {
			const trimmed = input.trim().toLowerCase();
			if (trimmed === 'exit' || trimmed === 'quit') {
				exitChatMode();
			} else {
				sendChatMessage(input.trim());
			}
			setInput('');
			setHistoryIndex(-1);
			return;
		}

		// Normal command mode
		const result = executeCommand(input, ctx);

		if (result.clear) {
			setHistory([]);
		} else if (result.enterChatMode) {
			enterChatMode(
				result.enterChatMode.projectSlug,
				result.enterChatMode.projectTitle,
			);
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
	}, [
		input,
		ctx,
		chatMode.active,
		exitChatMode,
		sendChatMessage,
		enterChatMode,
	]);

	// Auto-scroll to bottom
	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollTop = containerRef.current.scrollHeight;
		}
	}, [history, streamingContent]);

	// Focus input on mount and click
	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			abortControllerRef.current?.abort();
		};
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
		} else if (e.key === 'c' && e.ctrlKey && chatMode.active && isStreaming) {
			e.preventDefault();
			abortControllerRef.current?.abort();
			setIsStreaming(false);
			setStreamingContent('');
		}
	};

	// Render prompt based on mode
	const renderPrompt = (showInput = true) => {
		if (chatMode.active) {
			return (
				<div className="flex mt-2">
					<span className="text-accent-400">ai</span>
					<span className="text-surface-400">:</span>
					<span className="text-blue-400">{chatMode.projectSlug}</span>
					<span className="text-surface-400">&gt; </span>
					{showInput && (
						<>
							<input
								ref={inputRef}
								type="text"
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={handleKeyDown}
								disabled={isStreaming}
								className="flex-1 bg-transparent text-surface-100 outline-none caret-accent-400 disabled:opacity-50"
								autoComplete="off"
								spellCheck="false"
								autoCapitalize="off"
							/>
							<span className="animate-pulse text-accent-400">█</span>
						</>
					)}
				</div>
			);
		}

		return (
			<div className="flex mt-2">
				<span className="text-green-400">guest</span>
				<span className="text-surface-400">@</span>
				<span className="text-blue-400">portfolio</span>
				<span className="text-surface-400">:</span>
				<span className="text-purple-400">~</span>
				<span className="text-surface-400">$ </span>
				{showInput && (
					<>
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
					</>
				)}
			</div>
		);
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
						{entry.input !== '' && (
							<div className="flex">
								{entry.isChatMode ? (
									<>
										<span className="text-accent-400">ai</span>
										<span className="text-surface-400">:</span>
										<span className="text-blue-400">
											{chatMode.projectSlug}
										</span>
										<span className="text-surface-400">&gt; </span>
									</>
								) : (
									<>
										<span className="text-green-400">guest</span>
										<span className="text-surface-400">@</span>
										<span className="text-blue-400">portfolio</span>
										<span className="text-surface-400">:</span>
										<span className="text-purple-400">~</span>
										<span className="text-surface-400">$ </span>
									</>
								)}
								<span className="text-surface-100">{entry.input}</span>
							</div>
						)}
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

			{/* Streaming response */}
			{isStreaming && streamingContent && (
				<div className="whitespace-pre-wrap text-surface-300">
					{streamingContent}
					<span className="animate-pulse text-accent-400">▌</span>
				</div>
			)}

			{/* Streaming indicator without content */}
			{isStreaming && !streamingContent && (
				<div className="text-surface-400">
					<span className="animate-pulse">Thinking...</span>
				</div>
			)}

			{/* Input line */}
			{renderPrompt()}
		</div>
	);
}
