import clsx from 'clsx';
import { FolderIcon } from './icon/Folder';
import { FileIcon } from './icon/File';

export interface TreeItem {
	name: string;
	description?: string;
	isFolder?: boolean;
	children?: TreeItem[];
}

interface TreeNodeProps {
	item: TreeItem;
	depth: number;
	isLast: boolean;
	parentLines: boolean[];
}

function TreeNode({ item, depth, isLast, parentLines }: TreeNodeProps) {
	const isFolder = item.isFolder ?? (item.children && item.children.length > 0);

	return (
		<div className="group">
			<div className="flex items-center gap-2 hover:bg-surface-800/50 rounded transition-colors">
				{/* Tree lines */}
				<span className="text-surface-600 font-mono text-sm select-none shrink-0">
					{parentLines.map((showLine, i) => (
						<span key={i} className="inline-block w-4">
							{showLine ? '│' : ' '}
						</span>
					))}
					{isLast ? '└── ' : '├── '}
				</span>

				{/* Icon */}
				{isFolder ? (
					<FolderIcon className="w-4 h-4 shrink-0" />
				) : (
					<FileIcon className="w-4 h-4 shrink-0" />
				)}

				{/* Name */}
				<span
					className={clsx(
						'font-mono text-sm',
						isFolder ? 'text-accent-400 font-medium' : 'text-surface-200',
					)}
				>
					{item.name}
					{isFolder && '/'}
				</span>

				{/* Description */}
				{item.description && (
					<span className="text-surface-500 text-sm ml-2 hidden sm:inline font-mono">
						# {item.description}
					</span>
				)}
			</div>

			{/* Children */}
			{item.children?.map((child, index) => (
				<TreeNode
					key={child.name}
					item={child}
					depth={depth + 1}
					isLast={index === item.children!.length - 1}
					parentLines={[...parentLines, !isLast]}
				/>
			))}
		</div>
	);
}

interface TreeProps {
	items: TreeItem[];
	root?: string;
	className?: string;
}

export function Tree({ items, root, className }: TreeProps) {
	return (
		<div
			className={clsx(
				'bg-surface-900/70 border border-surface-800 rounded-xl p-4 overflow-x-auto leading-0 -space-y-0.5',
				className,
			)}
		>
			{/* Root folder */}
			{root && (
				<div className="flex items-center gap-2 pb-1 mb-1 border-b border-surface-800/50">
					<FolderIcon className="w-5 h-5" />
					<span className="font-mono text-sm text-accent-500 font-semibold">
						{root}/
					</span>
				</div>
			)}

			{/* Tree items */}
			{items.map((item, index) => (
				<TreeNode
					key={item.name}
					item={item}
					depth={0}
					isLast={index === items.length - 1}
					parentLines={[]}
				/>
			))}
		</div>
	);
}
