'use client';

import { useCallback, useRef } from 'react';
import { getAnalyticsClient } from '@/lib/analytics';
import type { ChatEventType } from '@/lib/analytics/types';

interface UseChatAnalyticsOptions {
	projectSlug: string;
}

interface UseChatAnalyticsReturn {
	trackChatOpened: () => void;
	trackChatClosed: (messageCount: number) => void;
	trackMessageSent: (
		messageLength: number,
		isStarterQuestion: boolean,
		messageIndex: number,
	) => void;
	trackStarterQuestionClicked: (
		questionIndex: number,
		questionText: string,
	) => void;
	trackChatCleared: (messageCount: number) => void;
	trackStreamCompleted: (
		responseLength: number,
		streamDurationMs: number,
	) => void;
	trackStreamErrored: (
		errorMessage: string,
		partialResponseLength?: number,
	) => void;
}

export function useChatAnalytics({
	projectSlug,
}: UseChatAnalyticsOptions): UseChatAnalyticsReturn {
	const openedAtRef = useRef<number | null>(null);

	const trackEvent = useCallback(
		(eventType: ChatEventType, eventData: Record<string, unknown>) => {
			const client = getAnalyticsClient();
			if (!client) return;

			client.trackEvent(eventType, 'chat', eventData);
		},
		[],
	);

	const trackChatOpened = useCallback(() => {
		openedAtRef.current = Date.now();
		trackEvent('chat_opened', { projectSlug });
	}, [projectSlug, trackEvent]);

	const trackChatClosed = useCallback(
		(messageCount: number) => {
			const durationMs = openedAtRef.current
				? Date.now() - openedAtRef.current
				: 0;
			openedAtRef.current = null;

			trackEvent('chat_closed', {
				projectSlug,
				durationMs,
				messageCount,
			});
		},
		[projectSlug, trackEvent],
	);

	const trackMessageSent = useCallback(
		(
			messageLength: number,
			isStarterQuestion: boolean,
			messageIndex: number,
		) => {
			trackEvent('message_sent', {
				projectSlug,
				messageLength,
				isStarterQuestion,
				messageIndex,
			});
		},
		[projectSlug, trackEvent],
	);

	const trackStarterQuestionClicked = useCallback(
		(questionIndex: number, questionText: string) => {
			trackEvent('starter_question_clicked', {
				projectSlug,
				questionIndex,
				questionText,
			});
		},
		[projectSlug, trackEvent],
	);

	const trackChatCleared = useCallback(
		(messageCount: number) => {
			trackEvent('chat_cleared', {
				projectSlug,
				messageCount,
			});
		},
		[projectSlug, trackEvent],
	);

	const trackStreamCompleted = useCallback(
		(responseLength: number, streamDurationMs: number) => {
			trackEvent('stream_completed', {
				projectSlug,
				responseLength,
				streamDurationMs,
			});
		},
		[projectSlug, trackEvent],
	);

	const trackStreamErrored = useCallback(
		(errorMessage: string, partialResponseLength?: number) => {
			trackEvent('stream_errored', {
				projectSlug,
				errorMessage,
				partialResponseLength,
			});
		},
		[projectSlug, trackEvent],
	);

	return {
		trackChatOpened,
		trackChatClosed,
		trackMessageSent,
		trackStarterQuestionClicked,
		trackChatCleared,
		trackStreamCompleted,
		trackStreamErrored,
	};
}
