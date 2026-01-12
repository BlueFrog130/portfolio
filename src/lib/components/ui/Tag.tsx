import type { ReactNode, HTMLAttributes } from 'react';
import clsx from 'clsx';

interface TagProps extends HTMLAttributes<HTMLSpanElement> {
	children: ReactNode;
	variant?: 'default' | 'accent';
}

export function Tag({
	children,
	variant = 'default',
	className,
	...props
}: TagProps) {
	return (
		<span
			className={clsx(
				// Base tag styles
				'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
				'transition-all duration-200',
				// Default variant
				variant === 'default' && [
					'bg-surface-800 text-surface-300 border border-surface-700',
					'hover:bg-surface-700 hover:border-surface-600 hover:text-surface-200',
				],
				// Accent variant
				variant === 'accent' && [
					'bg-accent-500/10 text-accent-400 border border-accent-500/30',
					'hover:bg-accent-500/20 hover:border-accent-500/50',
				],
				className,
			)}
			{...props}
		>
			{children}
		</span>
	);
}
