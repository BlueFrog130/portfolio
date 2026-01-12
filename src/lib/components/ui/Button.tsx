import type {
	ReactNode,
	ButtonHTMLAttributes,
	AnchorHTMLAttributes,
} from 'react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonBaseProps = {
	children: ReactNode;
	variant?: ButtonVariant;
	className?: string;
};

type ButtonAsButton = ButtonBaseProps &
	Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
		as?: 'button';
		href?: never;
	};

type ButtonAsAnchor = ButtonBaseProps &
	Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
		as: 'a';
		href: string;
	};

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const variantStyles: Record<ButtonVariant, string> = {
	primary: clsx(
		'bg-accent-500 text-surface-950 hover:bg-accent-400',
		'shadow-lg shadow-accent-500/25 hover:shadow-accent-400/30',
		'hover:-translate-y-0.5',
	),
	secondary: clsx(
		'bg-surface-800 text-surface-100 border border-surface-700',
		'hover:bg-surface-700 hover:border-surface-600',
		'hover:-translate-y-0.5',
	),
	ghost: clsx('text-surface-300 hover:text-accent-400 hover:bg-surface-800/50'),
};

export function Button({
	children,
	variant = 'primary',
	className,
	...props
}: ButtonProps) {
	const baseStyles = clsx(
		'inline-flex items-center justify-center gap-2 rounded-xl font-semibold',
		'transition-all duration-300',
		// Only apply padding for non-ghost variants (ghost often used for icon buttons)
		variant !== 'ghost' && 'px-6 py-3',
		variantStyles[variant],
		className,
	);

	if (props.as === 'a') {
		const { as: _, ...anchorProps } = props;
		return (
			<a className={baseStyles} {...anchorProps}>
				{children}
			</a>
		);
	}

	const { as: _, ...buttonProps } = props as ButtonAsButton;
	return (
		<button className={baseStyles} {...buttonProps}>
			{children}
		</button>
	);
}
