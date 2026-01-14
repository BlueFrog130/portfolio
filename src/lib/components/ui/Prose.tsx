import type { ReactNode, HTMLAttributes } from 'react';
import clsx from 'clsx';

interface ProseProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	as?: 'div' | 'section' | 'article';
}

/**
 * Prose wrapper component for MDX content with dark mode styling.
 * Applies custom typography styles for headings, links, code, and lists.
 */
export function Prose({
	children,
	as: Component = 'div',
	className,
	...props
}: ProseProps) {
	return (
		<Component
			className={clsx(
				'prose prose-lg max-w-none',
				// Base text color
				'text-surface-300',
				// Headings - display font, light color
				'prose-headings:text-surface-100 prose-headings:font-display',
				// Links - accent color
				'prose-a:text-accent-400 hover:prose-a:text-accent-300',
				// Strong text
				'prose-strong:text-surface-100',
				// Inline code
				'prose-code:bg-surface-800 prose-code:text-accent-400 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none',
				// Pre blocks
				'prose-pre:bg-surface-900 prose-pre:border prose-pre:border-surface-800 prose-pre:leading-none [&_pre_code]:bg-transparent [&_pre_code]:p-0',
				// Table headers
				'prose-th:text-surface-100',
				// List markers
				'marker:text-accent-500',
				className,
			)}
			{...props}
		>
			{children}
		</Component>
	);
}
