import { useCallback, useRef } from 'react';
import { useAnalytics } from '@/lib/analytics';
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
	const { trackEvent } = useAnalytics();
	const openedAtRef = useRef<number | null>(null);

	const track = useCallback(
		(eventType: ChatEventType, eventData: Record<string, unknown>) => {
			trackEvent(eventType, 'chat', eventData);
		},
		[trackEvent],
	);

	const trackChatOpened = useCallback(() => {
		openedAtRef.current = Date.now();
		track('chat_opened', { projectSlug });
	}, [projectSlug, track]);

	const trackChatClosed = useCallback(
		(messageCount: number) => {
			const durationMs = openedAtRef.current
				? Date.now() - openedAtRef.current
				: 0;
			openedAtRef.current = null;

			track('chat_closed', {
				projectSlug,
				durationMs,
				messageCount,
			});
		},
		[projectSlug, track],
	);

	const trackMessageSent = useCallback(
		(
			messageLength: number,
			isStarterQuestion: boolean,
			messageIndex: number,
		) => {
			track('message_sent', {
				projectSlug,
				messageLength,
				isStarterQuestion,
				messageIndex,
			});
		},
		[projectSlug, track],
	);

	const trackStarterQuestionClicked = useCallback(
		(questionIndex: number, questionText: string) => {
			track('starter_question_clicked', {
				projectSlug,
				questionIndex,
				questionText,
			});
		},
		[projectSlug, track],
	);

	const trackChatCleared = useCallback(
		(messageCount: number) => {
			track('chat_cleared', {
				projectSlug,
				messageCount,
			});
		},
		[projectSlug, track],
	);

	const trackStreamCompleted = useCallback(
		(responseLength: number, streamDurationMs: number) => {
			track('stream_completed', {
				projectSlug,
				responseLength,
				streamDurationMs,
			});
		},
		[projectSlug, track],
	);

	const trackStreamErrored = useCallback(
		(errorMessage: string, partialResponseLength?: number) => {
			track('stream_errored', {
				projectSlug,
				errorMessage,
				partialResponseLength,
			});
		},
		[projectSlug, track],
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
