import type { HTMLAttributes } from 'react';
import clsx from 'clsx';

interface SectionNumberProps extends HTMLAttributes<HTMLSpanElement> {
	number: number;
}

export function SectionNumber({
	number,
	className,
	...props
}: SectionNumberProps) {
	return (
		<span
			className={clsx(
				'font-display text-8xl sm:text-9xl font-black text-surface-800/50 select-none',
				className,
			)}
			style={{ lineHeight: 0.8 }}
			aria-hidden="true"
			{...props}
		>
			{number.toString().padStart(2, '0')}
		</span>
	);
}
