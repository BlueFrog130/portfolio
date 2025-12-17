import {
	createContext,
	useContext,
	useEffect,
	useRef,
	useMemo,
	useCallback,
	type ReactNode,
} from 'react';
import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from 'web-vitals';
import type { AnalyticsConfig, ChatEventType } from './types';
import {
	generateId,
	parseUserAgent,
	parseUtmParams,
	getExternalReferrer,
} from './utils';
import type { AnalyticsEvent } from './types';

const DEFAULT_CONFIG: Required<AnalyticsConfig> = {
	endpoint: '/api/analytics',
	batchSize: 10,
	flushInterval: 5000,
};

interface AnalyticsContextValue {
	trackPageView: (path: string, referrerPath?: string) => void;
	trackNavigation: (newPath: string) => void;
	trackEvent: (
		eventType: string,
		eventCategory: string,
		eventData?: Record<string, unknown>,
	) => void;
	trackChat: (
		eventType: ChatEventType,
		eventData?: Record<string, unknown>,
	) => void;
	sessionId: string;
}

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

interface AnalyticsProviderProps {
	children: ReactNode;
	config?: AnalyticsConfig;
	enabled?: boolean;
}

export function AnalyticsProvider({
	children,
	config = {},
	enabled = true,
}: AnalyticsProviderProps) {
	const mergedConfig = useMemo(
		() => ({ ...DEFAULT_CONFIG, ...config }),
		[config],
	);

	const queueRef = useRef<AnalyticsEvent[]>([]);
	const sessionIdRef = useRef<string>('');
	const currentPathRef = useRef<string>('');
	const pageEnteredAtRef = useRef<number>(Date.now());
	const flushTimerRef = useRef<number | null>(null);
	const initializedRef = useRef(false);

	// Get or create session ID
	const getSessionId = useCallback(() => {
		if (sessionIdRef.current) return sessionIdRef.current;

		if (typeof window === 'undefined') {
			sessionIdRef.current = generateId();
			return sessionIdRef.current;
		}

		const stored = sessionStorage.getItem('analytics_session_id');
		if (stored) {
			sessionIdRef.current = stored;
			return stored;
		}

		const newId = generateId();
		sessionStorage.setItem('analytics_session_id', newId);
		sessionIdRef.current = newId;
		return newId;
	}, []);

	const enqueue = useCallback(
		(event: AnalyticsEvent) => {
			if (!enabled) return;

			queueRef.current.push(event);

			if (queueRef.current.length >= mergedConfig.batchSize) {
				flush();
			}
		},
		[enabled, mergedConfig.batchSize],
	);

	const flush = useCallback(() => {
		if (queueRef.current.length === 0) return;

		const batch = [...queueRef.current];
		queueRef.current = [];

		const blob = new Blob([JSON.stringify(batch)], {
			type: 'application/json',
		});
		const sent = navigator.sendBeacon(mergedConfig.endpoint, blob);

		if (!sent) {
			fetch(mergedConfig.endpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(batch),
				keepalive: true,
			}).catch(() => {
				if (queueRef.current.length < 100) {
					queueRef.current.unshift(...batch);
				}
			});
		}
	}, [mergedConfig.endpoint]);

	const trackPageView = useCallback(
		(path: string, referrerPath?: string) => {
			enqueue({
				type: 'pageview',
				sessionId: getSessionId(),
				path,
				timestamp: Date.now(),
				referrerPath,
			});
		},
		[enqueue, getSessionId],
	);

	const trackNavigation = useCallback(
		(newPath: string) => {
			const previousPath = currentPathRef.current;
			const duration = Date.now() - pageEnteredAtRef.current;

			if (previousPath && previousPath !== newPath) {
				enqueue({
					type: 'pageview',
					sessionId: getSessionId(),
					path: previousPath,
					timestamp: pageEnteredAtRef.current,
					duration,
				});
			}

			currentPathRef.current = newPath;
			pageEnteredAtRef.current = Date.now();
			trackPageView(newPath, previousPath || undefined);
		},
		[enqueue, getSessionId, trackPageView],
	);

	const trackEvent = useCallback(
		(
			eventType: string,
			eventCategory: string,
			eventData?: Record<string, unknown>,
		) => {
			enqueue({
				type: 'event',
				sessionId: getSessionId(),
				timestamp: Date.now(),
				eventType,
				eventCategory,
				eventData,
			});
		},
		[enqueue, getSessionId],
	);

	const trackChat = useCallback(
		(eventType: ChatEventType, eventData?: Record<string, unknown>) => {
			trackEvent(eventType, 'chat', eventData);
		},
		[trackEvent],
	);

	// Initialize analytics on mount
	useEffect(() => {
		if (!enabled || typeof window === 'undefined' || initializedRef.current) {
			return;
		}

		initializedRef.current = true;
		const sessionId = getSessionId();
		currentPathRef.current = window.location.pathname;

		// Track session
		const ua = parseUserAgent();
		const utm = parseUtmParams();

		enqueue({
			type: 'session',
			id: sessionId,
			...ua,
			screenWidth: window.screen.width,
			screenHeight: window.screen.height,
			referrer: getExternalReferrer(),
			...utm,
		});

		// Track initial page view
		trackPageView(currentPathRef.current);

		// Setup web vitals
		const reportMetric = (metric: Metric) => {
			enqueue({
				type: 'webvital',
				sessionId,
				path: currentPathRef.current,
				timestamp: Date.now(),
				name: metric.name,
				value: metric.value,
				rating: metric.rating,
				id: metric.id,
				navigationType: metric.navigationType,
			});
		};

		onCLS(reportMetric);
		onINP(reportMetric);
		onLCP(reportMetric);
		onFCP(reportMetric);
		onTTFB(reportMetric);

		// Start flush timer
		flushTimerRef.current = window.setInterval(
			flush,
			mergedConfig.flushInterval,
		);

		// Flush on visibility change and page hide
		const handleVisibilityChange = () => {
			if (document.visibilityState === 'hidden') {
				flush();
			}
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);
		window.addEventListener('pagehide', flush);

		return () => {
			if (flushTimerRef.current) {
				clearInterval(flushTimerRef.current);
			}
			document.removeEventListener('visibilitychange', handleVisibilityChange);
			window.removeEventListener('pagehide', flush);
			flush();
		};
	}, [
		enabled,
		getSessionId,
		enqueue,
		trackPageView,
		flush,
		mergedConfig.flushInterval,
	]);

	const value = useMemo<AnalyticsContextValue>(
		() => ({
			trackPageView,
			trackNavigation,
			trackEvent,
			trackChat,
			sessionId: sessionIdRef.current || getSessionId(),
		}),
		[trackPageView, trackNavigation, trackEvent, trackChat, getSessionId],
	);

	return (
		<AnalyticsContext.Provider value={value}>
			{children}
		</AnalyticsContext.Provider>
	);
}

export function useAnalytics(): AnalyticsContextValue {
	const context = useContext(AnalyticsContext);
	if (!context) {
		throw new Error('useAnalytics must be used within an AnalyticsProvider');
	}
	return context;
}

export function useTrackEvent() {
	const { trackEvent } = useAnalytics();
	return trackEvent;
}

export function useTrackChat() {
	const { trackChat } = useAnalytics();
	return trackChat;
}
