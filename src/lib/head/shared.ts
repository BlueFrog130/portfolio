import { links, profile } from '../data';

export const DEFAULT_OG_IMAGE = '/og-image.png';
export const SITE_NAME = profile.name;
export const AUTHOR = {
	name: profile.name,
	url: import.meta.env.VITE_BASE_URL,
	github: links.github,
	linkedin: links.linkedin,
};
export const BASE_URL = import.meta.env.VITE_BASE_URL || '';
