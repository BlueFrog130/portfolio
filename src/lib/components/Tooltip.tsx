import {
	useFloating,
	autoUpdate,
	offset,
	flip,
	shift,
	useHover,
	useFocus,
	useDismiss,
	useRole,
	useInteractions,
	useTransitionStatus,
	FloatingPortal,
	type Placement,
} from '@floating-ui/react';
import clsx from 'clsx';
import { useState, type ReactNode } from 'react';

type TooltipProps = {
	children: ReactNode;
	content: ReactNode;
	placement?: Placement;
	delay?: number;
};

export function Tooltip({
	children,
	content,
	placement = 'top',
	delay = 300,
}: TooltipProps) {
	const [isOpen, setIsOpen] = useState(false);

	const { refs, floatingStyles, context } = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen,
		placement,
		middleware: [
			offset(6),
			flip({ fallbackAxisSideDirection: 'start' }),
			shift({ padding: 5 }),
		],
		whileElementsMounted: autoUpdate,
	});

	const hover = useHover(context, { move: false, delay: { open: delay } });
	const focus = useFocus(context);
	const dismiss = useDismiss(context);
	const role = useRole(context, { role: 'tooltip' });
	const { isMounted, status } = useTransitionStatus(context, {
		duration: 150,
	});

	const { getReferenceProps, getFloatingProps } = useInteractions([
		hover,
		focus,
		dismiss,
		role,
	]);

	return (
		<>
			<span ref={refs.setReference} {...getReferenceProps()}>
				{children}
			</span>
			<FloatingPortal>
				{isMounted && (
					<div
						ref={refs.setFloating}
						style={floatingStyles}
						className={clsx(
							'z-50 rounded-md bg-surface-800 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg transition-opacity duration-150',
							{
								'opacity-100': status === 'open',
								'opacity-0': status !== 'open',
							},
						)}
						{...getFloatingProps()}
					>
						{content}
					</div>
				)}
			</FloatingPortal>
		</>
	);
}
