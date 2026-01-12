import type { ReactNode, HTMLAttributes } from 'react';
import clsx from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	variant?: 'default' | 'accent';
	as?: 'div' | 'article' | 'section' | 'nav';
}

/**
 * Basic card component with solid border
 */
export function Card({
	children,
	variant = 'default',
	as: Component = 'div',
	className,
	...props
}: CardProps) {
	return (
		<Component
			className={clsx(
				'rounded-2xl backdrop-blur-sm transition-all duration-300',
				variant === 'default' && [
					'bg-surface-900/50 border border-surface-800',
					'hover:border-surface-700 hover:bg-surface-900/70',
					'hover:shadow-[0_0_0_1px_rgba(245,158,11,0.1),0_20px_40px_-20px_rgba(0,0,0,0.5)]',
				],
				variant === 'accent' && [
					'bg-linear-to-br from-accent-500/10 to-accent-600/5 border border-accent-500/20',
					'hover:border-accent-500/40',
					'hover:shadow-[0_0_0_1px_rgba(245,158,11,0.2),0_20px_40px_-20px_rgba(245,158,11,0.2)]',
				],
				className,
			)}
			{...props}
		>
			{children}
		</Component>
	);
}

interface GradientCardProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	/** Classes for the inner content area (padding, flex layout, etc.) */
	contentClassName?: string;
	as?: 'div' | 'article' | 'section' | 'nav';
}

/**
 * Card with animated gradient border on hover.
 * Uses padded content approach - outer element has gradient bg, inner has solid bg.
 *
 * - `className` applies to outer wrapper (grid positioning, z-index, etc.)
 * - `contentClassName` applies to inner content (padding, flex, etc.)
 */
export function GradientCard({
	children,
	contentClassName,
	as: Component = 'div',
	className,
	...props
}: GradientCardProps) {
	return (
		<Component
			className={clsx(
				'group rounded-2xl p-px transition-all duration-300',
				'bg-surface-800',
				'hover:bg-[linear-gradient(135deg,var(--color-accent-500),var(--color-accent-600),var(--color-surface-700),var(--color-accent-500))]',
				'hover:animate-gradient-shift hover:bg-size-[300%_300%]',
				className,
			)}
			{...props}
		>
			<div
				className={clsx(
					'h-full rounded-2xl bg-surface-900 backdrop-blur-sm transition-all duration-300',
					'hover:shadow-[0_0_0_1px_rgba(245,158,11,0.1),0_20px_40px_-20px_rgba(0,0,0,0.5)]',
					contentClassName,
				)}
			>
				{children}
			</div>
		</Component>
	);
}
