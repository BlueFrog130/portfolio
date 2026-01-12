export interface PenLineIconProps {
	className?: string;
	style?: React.CSSProperties;
}

export function PenLineIcon({ className, style }: PenLineIconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			className={className}
			style={{ overflow: 'visible', ...style }}
			xmlns="http://www.w3.org/2000/svg"
		>
			{/* The drawn line - animates on hover */}
			<line
				x1="4"
				y1="20"
				x2="20"
				y2="20"
				stroke="var(--color-accent-600)"
				strokeWidth="2"
				strokeLinecap="round"
				className="motion-safe:transition-all motion-safe:duration-400 motion-safe:ease-out"
				style={{
					strokeDasharray: '16',
					strokeDashoffset: 'calc(16 - var(--active, 0) * 16)',
				}}
			/>

			{/* Simple pen - moves along with drawing */}
			<g
				className="motion-safe:transition-transform motion-safe:duration-400 motion-safe:ease-out"
				style={{
					transform: `translateX(calc(var(--active, 0) * 12px))`,
				}}
			>
				{/* Pen body */}
				<path
					d="M5 19L15 9L17 11L7 21L5 19Z"
					fill="var(--color-accent-500)"
				/>

				{/* Pen tip */}
				<path
					d="M5 19L4 20L7 21L5 19Z"
					fill="var(--color-accent-700)"
				/>

				{/* Pen top */}
				<path
					d="M15 9L17 7L19 9L17 11L15 9Z"
					fill="var(--color-accent-400)"
				/>
			</g>
		</svg>
	);
}
