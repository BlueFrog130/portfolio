export interface ArrowUpRightIconProps {
	className?: string;
	style?: React.CSSProperties;
}

export function ArrowUpRightIcon({ className, style }: ArrowUpRightIconProps) {
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
					transform: `translate(calc(var(--active, 0) * 2px), calc(var(--active, 0) * -2px))`,
					transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
				}}
			>
				{/* Arrow head */}
				<path
					d="M7 17L17 7"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M7 7H17V17"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</g>
		</svg>
	);
}
