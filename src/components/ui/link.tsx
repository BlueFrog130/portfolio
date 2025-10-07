import { cn } from '@/lib/utils';

export function Link({ children, className, ...rest }: React.ComponentProps<'a'>) {
	return (
		<a
			className={cn('text-foreground transition-colors hover:text-primary', className)}
			target="__blank"
			{...rest}
		>
			{children}
		</a>
	);
}
