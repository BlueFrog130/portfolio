export interface ArrowRightIconProps {
	className?: string;
	style?: React.CSSProperties;
}

export function ArrowRightIcon({ className, style }: ArrowRightIconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			className={className}
			style={{ overflow: 'visible', ...style }}
			xmlns="http://www.w3.org/2000/svg"
		>
			<g
				style={{
					transform: `translateX(calc(var(--active, 0) * 3px))`,
					transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
				}}
			>
				{/* Arrow line */}
				<path
					d="M5 12H19"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				{/* Arrow head */}
				<path
					d="M12 5L19 12L12 19"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</g>
		</svg>
	);
}
