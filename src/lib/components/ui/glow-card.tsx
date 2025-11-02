import { cn } from '@/lib/utils';
import { createContext, useContext, useRef } from 'react';

const CardsContext = createContext<Set<HTMLDivElement>>(new Set());

function Container({ className, ...props }: React.ComponentProps<'div'>) {
	const cards = useRef<Set<HTMLDivElement>>(new Set());

	const mousePosition = (el: HTMLDivElement) => {
		if (!el) return;
		const handleMouseMove = (e: MouseEvent) => {
			for (const card of cards.current) {
				const rect = card.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;
				card.style.setProperty('--mouse-x', `${x}px`);
				card.style.setProperty('--mouse-y', `${y}px`);
			}
		};
		el.addEventListener('mousemove', handleMouseMove);
		return () => {
			el.removeEventListener('mousemove', handleMouseMove);
		};
	};

	return (
		<CardsContext.Provider value={cards.current}>
			<div ref={mousePosition} className={cn('group', className)} {...props} />
		</CardsContext.Provider>
	);
}

function Card({ className, ...props }: React.ComponentProps<'div'>) {
	const ctx = useContext(CardsContext);

	const register = (el: HTMLDivElement) => {
		if (!el) return;
		ctx.add(el);
		return () => {
			ctx.delete(el);
		};
	};

	return (
		<div
			ref={register}
			className={cn(
				'relative flex flex-col rounded-xl bg-stone-50/10 p-[1px] text-card-foreground',
				'before:pointer-events-none before:absolute before:inset-0 before:z-30 before:rounded-xl before:bg-[radial-gradient(800px_circle_at_var(--mouse-x)_var(--mouse-y),_rgba(255,255,255,0.06),_transparent_40%)] before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100',
				'after:absolute after:inset-0 after:z-10 after:rounded-xl after:opacity-0 after:transition-opacity after:duration-500 group-hover:after:bg-[radial-gradient(600px_circle_at_var(--mouse-x)_var(--mouse-y),_rgba(255,255,255,0.4),_transparent_40%)] group-hover:after:opacity-100',
				className
			)}
			{...props}
		/>
	);
}

function Content({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="card-content"
			className={cn('z-20 flex flex-col rounded-xl bg-card p-4 px-6', className)}
			{...props}
		/>
	);
}

export { Card, Content, Container as Ctx };
