'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

export interface ChatMessage {
	role: 'user' | 'assistant';
	content: string;
}

interface UseProjectChatOptions {
	slug: string;
	onStreamCompleted?: (
		responseLength: number,
		streamDurationMs: number,
	) => void;
	onStreamErrored?: (
		errorMessage: string,
		partialResponseLength?: number,
	) => void;
	onClear?: (messageCount: number) => void;
}

interface UseProjectChatReturn {
	messages: ChatMessage[];
	sendMessage: (content: string) => Promise<void>;
	isLoading: boolean;
	error: string | null;
	clearMessages: () => void;
}

const STORAGE_KEY_PREFIX = 'chat_messages_';

function getSessionId(): string {
	let sessionId = sessionStorage.getItem('analytics_session_id');
	if (!sessionId) {
		sessionId = crypto.randomUUID();
		sessionStorage.setItem('analytics_session_id', sessionId);
	}
	return sessionId;
}

function getStorageKey(slug: string): string {
	return `${STORAGE_KEY_PREFIX}${slug}`;
}

function loadMessages(slug: string): ChatMessage[] {
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

function saveMessages(slug: string, messages: ChatMessage[]): void {
	sessionStorage.setItem(getStorageKey(slug), JSON.stringify(messages));
}

export function useProjectChat({
	slug,
	onStreamCompleted,
	onStreamErrored,
	onClear,
}: UseProjectChatOptions): UseProjectChatReturn {
	const [messages, setMessages] = useState<ChatMessage[]>(() =>
		loadMessages(slug),
	);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const abortControllerRef = useRef<AbortController | null>(null);

	// Sync messages to sessionStorage whenever they change
	useEffect(() => {
		saveMessages(slug, messages);
	}, [slug, messages]);

	// Load messages when slug changes
	useEffect(() => {
		setMessages(loadMessages(slug));
	}, [slug]);

	const sendMessage = useCallback(
		async (content: string) => {
			if (!content.trim() || isLoading) return;

			setError(null);
			setIsLoading(true);

			const userMessage: ChatMessage = {
				role: 'user',
				content: content.trim(),
			};
			const newMessages = [...messages, userMessage];
			setMessages(newMessages);

			// Cancel any existing request
			abortControllerRef.current?.abort();
			abortControllerRef.current = new AbortController();

			const streamStartTime = Date.now();
			let assistantContent = '';

			try {
				const sessionId = getSessionId();

				const response = await fetch(`/api/chat/projects/${slug}`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						sessionId,
						messages: newMessages,
					}),
					signal: abortControllerRef.current.signal,
				});

				if (!response.ok) {
					throw new Error(`Request failed: ${response.status}`);
				}

				if (!response.body) {
					throw new Error('No response body');
				}

				// Process SSE stream
				const reader = response.body.getReader();
				const decoder = new TextDecoder();
				let buffer = '';

				// Add placeholder assistant message
				setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					buffer += decoder.decode(value, { stream: true });
					const lines = buffer.split('\n');

					// Keep the last (potentially incomplete) line in the buffer
					buffer = lines.pop() || '';

					for (const line of lines) {
						if (line.startsWith('data: ')) {
							const data = line.slice(6);
							if (data === '[DONE]') continue;

							try {
								const parsed = JSON.parse(data);
								if (parsed.response) {
									assistantContent += parsed.response;
									// Update the assistant message in place
									setMessages((prev) => {
										const updated = [...prev];
										const lastIdx = updated.length - 1;
										if (updated[lastIdx]?.role === 'assistant') {
											updated[lastIdx] = {
												role: 'assistant',
												content: assistantContent,
											};
										}
										return updated;
									});
								}
							} catch {
								// Skip non-JSON lines
							}
						}
					}
				}

				// Track successful stream completion
				const streamDurationMs = Date.now() - streamStartTime;
				onStreamCompleted?.(assistantContent.length, streamDurationMs);
			} catch (err) {
				if (err instanceof Error && err.name === 'AbortError') {
					// Request was cancelled, don't show error
					return;
				}

				const errorMessage =
					err instanceof Error ? err.message : 'An error occurred';
				setError(errorMessage);

				// Track stream error
				onStreamErrored?.(errorMessage, assistantContent.length || undefined);

				// Remove the failed assistant message placeholder
				setMessages((prev) => {
					const lastMsg = prev[prev.length - 1];
					if (lastMsg?.role === 'assistant' && lastMsg.content === '') {
						return prev.slice(0, -1);
					}
					return prev;
				});
			} finally {
				setIsLoading(false);
			}
		},
		[slug, messages, isLoading, onStreamCompleted, onStreamErrored],
	);

	const clearMessages = useCallback(() => {
		const count = messages.length;
		setMessages([]);
		sessionStorage.removeItem(getStorageKey(slug));
		onClear?.(count);
	}, [slug, messages.length, onClear]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			abortControllerRef.current?.abort();
		};
	}, []);

	return {
		messages,
		sendMessage,
		isLoading,
		error,
		clearMessages,
	};
}
