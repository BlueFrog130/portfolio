import { Tree, type TreeItem } from '@/lib/components/ui/Tree';

const monorepoStructure: TreeItem[] = [
	{
		name: 'SuperstarSeries.Website',
		description: 'SvelteKit static site (TypeScript)',
		isFolder: true,
	},
	{
		name: 'SuperstarSeries.Functions',
		description: 'Firebase Cloud Functions (TypeScript)',
		isFolder: true,
	},
	{
		name: 'SuperstarSeries.Scripts',
		description: 'Deployment utilities (TypeScript)',
		isFolder: true,
	},
	{
		name: 'SuperstarSeries.Bot',
		description: 'Discord bot (C#/.NET 8)',
		isFolder: true,
	},
	{
		name: 'SuperstarSeries.SeriesApi',
		description: 'API client library (C#)',
		isFolder: true,
	},
	{
		name: 'SuperstarSeries.Ballchasing',
		description: 'Ballchasing.com client (C#)',
		isFolder: true,
	},
	{
		name: 'SuperstarSeries.Firestore.Models',
		description: 'Shared data models (C#)',
		isFolder: true,
	},
	{
		name: 'SuperstarSeries.Core',
		description: 'Common utilities (C#)',
		isFolder: true,
	},
	{
		name: 'pnpm-workspace.yaml',
		description: 'Node.js workspace config',
	},
	{
		name: 'SuperstarSeries.sln',
		description: '.NET solution file',
	},
	{
		name: 'firebase.json',
		description: 'Firebase configuration',
	},
];

export function MonorepoTree() {
	return <Tree items={monorepoStructure} root="SuperstarSeriesBot" className="my-6" />;
}
