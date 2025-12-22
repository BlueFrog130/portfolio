import {
	getProjectMeta,
	loadProjectContent,
	projects,
} from '@/content/projects';
import { PageLoad, PageMeta, RouteEntries } from '@/lib/router/types';

export const meta: PageMeta = (params) => getProjectMeta(params.slug);

export const load: PageLoad<any> = async ({ params }) => {
	const project = await loadProjectContent(params.slug);
	return { project };
};

export const entries: RouteEntries = () =>
	projects.map((p) => `/project/${p.slug}`);
