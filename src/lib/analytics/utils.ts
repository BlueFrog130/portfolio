export function generateId(): string {
	return crypto.randomUUID();
}

export function parseUserAgent(): {
	deviceType: string;
	browser: string;
	browserVersion: string;
	os: string;
} {
	const ua = navigator.userAgent;

	let deviceType = 'desktop';
	if (/Mobi|Android/i.test(ua)) {
		deviceType = /Tablet|iPad/i.test(ua) ? 'tablet' : 'mobile';
	}

	let browser = 'Unknown';
	let browserVersion = '';

	if (ua.includes('Firefox/')) {
		browser = 'Firefox';
		browserVersion = ua.match(/Firefox\/(\d+)/)?.[1] || '';
	} else if (ua.includes('Chrome/') && !ua.includes('Edg/')) {
		browser = 'Chrome';
		browserVersion = ua.match(/Chrome\/(\d+)/)?.[1] || '';
	} else if (ua.includes('Safari/') && !ua.includes('Chrome/')) {
		browser = 'Safari';
		browserVersion = ua.match(/Version\/(\d+)/)?.[1] || '';
	} else if (ua.includes('Edg/')) {
		browser = 'Edge';
		browserVersion = ua.match(/Edg\/(\d+)/)?.[1] || '';
	}

	let os = 'Unknown';
	if (ua.includes('Windows')) os = 'Windows';
	else if (ua.includes('Mac OS')) os = 'macOS';
	else if (ua.includes('Linux')) os = 'Linux';
	else if (ua.includes('Android')) os = 'Android';
	else if (/iPhone|iPad|iPod/.test(ua)) os = 'iOS';

	return { deviceType, browser, browserVersion, os };
}

export function parseUtmParams(): {
	utmSource: string | null;
	utmMedium: string | null;
	utmCampaign: string | null;
} {
	const params = new URLSearchParams(window.location.search);
	return {
		utmSource: params.get('utm_source'),
		utmMedium: params.get('utm_medium'),
		utmCampaign: params.get('utm_campaign'),
	};
}

export function getExternalReferrer(): string | null {
	const referrer = document.referrer;
	if (!referrer) return null;

	try {
		const referrerUrl = new URL(referrer);
		if (referrerUrl.hostname === window.location.hostname) {
			return null;
		}
		return referrer;
	} catch {
		return null;
	}
}
