export interface AnalyticsConfig {
	endpoint?: string;
	batchSize?: number;
	flushInterval?: number;
}

export interface SessionData {
	id: string;
	deviceType: string;
	browser: string;
	browserVersion: string;
	os: string;
	screenWidth: number;
	screenHeight: number;
	referrer: string | null;
	utmSource: string | null;
	utmMedium: string | null;
	utmCampaign: string | null;
}

export interface PageViewData {
	sessionId: string;
	path: string;
	timestamp: number;
	duration?: number;
	referrerPath?: string;
}

export interface WebVitalData {
	sessionId: string;
	path: string;
	timestamp: number;
	name: string;
	value: number;
	rating: string;
	id: string;
	navigationType: string;
}

export type ChatEventType =
	| 'chat_opened'
	| 'chat_closed'
	| 'message_sent'
	| 'starter_question_clicked'
	| 'chat_cleared'
	| 'stream_completed'
	| 'stream_errored';

export interface EventData {
	sessionId: string;
	timestamp: number;
	eventType: string;
	eventCategory: string;
	eventData?: Record<string, unknown>;
}

export type AnalyticsEvent =
	| ({ type: 'session' } & SessionData)
	| ({ type: 'pageview' } & PageViewData)
	| ({ type: 'webvital' } & WebVitalData)
	| ({ type: 'event' } & EventData);
