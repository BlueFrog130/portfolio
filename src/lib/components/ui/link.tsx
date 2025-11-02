import { cn } from '@/lib/utils';
import { createLink } from '@tanstack/react-router';

function LinkComponent({ className, ...rest }: React.ComponentProps<'a'>) {
	return (
		<a
			className={cn('text-foreground transition-colors hover:text-primary', className)}
			{...rest}
		/>
	);
}

export const Link = createLink(LinkComponent);

export function ExternalLink({ className, ...rest }: React.ComponentProps<'a'>) {
	return (
		<a
			className={cn('text-foreground transition-colors hover:text-primary', className)}
			target="_blank"
			rel="noopener noreferrer"
			{...rest}
		/>
	);
}
