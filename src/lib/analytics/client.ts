import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from 'web-vitals';
import type { AnalyticsConfig, AnalyticsEvent } from './types';
import {
	generateId,
	parseUserAgent,
	parseUtmParams,
	getExternalReferrer,
} from './utils';

const DEFAULT_CONFIG: Required<AnalyticsConfig> = {
	endpoint: '/api/analytics',
	batchSize: 10,
	flushInterval: 5000,
};

class AnalyticsClient {
	private config: Required<AnalyticsConfig>;
	private queue: AnalyticsEvent[] = [];
	private sessionId: string;
	private currentPath: string;
	private pageEnteredAt: number;
	private flushTimer: number | null = null;
	private initialized = false;

	constructor(config: AnalyticsConfig = {}) {
		this.config = { ...DEFAULT_CONFIG, ...config };
		this.sessionId = this.getOrCreateSessionId();
		this.currentPath = window.location.pathname;
		this.pageEnteredAt = Date.now();
	}

	private getOrCreateSessionId(): string {
		const stored = sessionStorage.getItem('analytics_session_id');
		if (stored) return stored;

		const newId = generateId();
		sessionStorage.setItem('analytics_session_id', newId);
		return newId;
	}

	private enqueue(event: AnalyticsEvent): void {
		this.queue.push(event);

		if (this.queue.length >= this.config.batchSize) {
			this.flush();
		}
	}

	private flush(): void {
		if (this.queue.length === 0) return;

		const batch = [...this.queue];
		this.queue = [];

		const blob = new Blob([JSON.stringify(batch)], {
			type: 'application/json',
		});
		const sent = navigator.sendBeacon(this.config.endpoint, blob);

		if (!sent) {
			fetch(this.config.endpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(batch),
				keepalive: true,
			}).catch(() => {
				if (this.queue.length < 100) {
					this.queue.unshift(...batch);
				}
			});
		}
	}

	private startFlushTimer(): void {
		if (this.flushTimer) return;

		this.flushTimer = window.setInterval(() => {
			this.flush();
		}, this.config.flushInterval);
	}

	private stopFlushTimer(): void {
		if (this.flushTimer) {
			clearInterval(this.flushTimer);
			this.flushTimer = null;
		}
	}

	init(): void {
		if (this.initialized) return;
		this.initialized = true;

		const ua = parseUserAgent();
		const utm = parseUtmParams();

		this.enqueue({
			type: 'session',
			id: this.sessionId,
			...ua,
			screenWidth: window.screen.width,
			screenHeight: window.screen.height,
			referrer: getExternalReferrer(),
			...utm,
		});

		this.trackPageView(this.currentPath);
		this.setupWebVitals();
		this.startFlushTimer();

		document.addEventListener('visibilitychange', () => {
			if (document.visibilityState === 'hidden') {
				this.flush();
			}
		});

		window.addEventListener('pagehide', () => {
			this.flush();
		});
	}

	private setupWebVitals(): void {
		const reportMetric = (metric: Metric) => {
			this.enqueue({
				type: 'webvital',
				sessionId: this.sessionId,
				path: this.currentPath,
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
	}

	trackPageView(path: string, referrerPath?: string): void {
		this.enqueue({
			type: 'pageview',
			sessionId: this.sessionId,
			path,
			timestamp: Date.now(),
			referrerPath,
		});
	}

	trackNavigation(newPath: string): void {
		const previousPath = this.currentPath;
		const duration = Date.now() - this.pageEnteredAt;

		if (previousPath !== newPath) {
			this.enqueue({
				type: 'pageview',
				sessionId: this.sessionId,
				path: previousPath,
				timestamp: this.pageEnteredAt,
				duration,
			});
		}

		this.currentPath = newPath;
		this.pageEnteredAt = Date.now();
		this.trackPageView(newPath, previousPath);
	}

	destroy(): void {
		this.stopFlushTimer();
		this.flush();
	}
}

let client: AnalyticsClient | null = null;

export function initAnalytics(config?: AnalyticsConfig): AnalyticsClient {
	if (!client) {
		client = new AnalyticsClient(config);
		client.init();
	}
	return client;
}

export function getAnalyticsClient(): AnalyticsClient | null {
	return client;
}
