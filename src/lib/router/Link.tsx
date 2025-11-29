import type { AnchorHTMLAttributes, MouseEvent } from 'react';
import { useRouter } from './context';

interface LinkProps
	extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
	to: string;
}

export function Link({ to, children, onClick, ...props }: LinkProps) {
	const { navigate } = useRouter();

	const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
		// Allow default behavior for modifier keys, external links, etc.
		if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
			return;
		}

		e.preventDefault();
		onClick?.(e);
		navigate(to);
	};

	return (
		<a href={to} onClick={handleClick} {...props}>
			{children}
		</a>
	);
}
