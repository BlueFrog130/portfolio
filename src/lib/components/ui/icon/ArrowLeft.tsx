export interface ArrowLeftIconProps {
	className?: string;
	style?: React.CSSProperties;
}

export function ArrowLeftIcon({ className, style }: ArrowLeftIconProps) {
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
					transform: `translateX(calc(var(--active, 0) * -3px))`,
					transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
				}}
			>
				{/* Arrow line */}
				<path
					d="M19 12H5"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				{/* Arrow head */}
				<path
					d="M12 19L5 12L12 5"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</g>
		</svg>
	);
}
