export interface ExternalLinkIconProps {
	className?: string;
	style?: React.CSSProperties;
}

export function ExternalLinkIcon({ className, style }: ExternalLinkIconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			className={className}
			style={{ overflow: 'visible', ...style }}
			xmlns="http://www.w3.org/2000/svg"
		>
			{/* Box/window frame */}
			<path
				d="M18 13V19C18 20.1046 17.1046 21 16 21H5C3.89543 21 3 20.1046 3 19V8C3 6.89543 3.89543 6 5 6H11"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>

			{/* Arrow group - animates on hover */}
			<g
				className="motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out"
				style={{
					transform: `translate(calc(var(--active, 0) * 2px), calc(var(--active, 0) * -2px))`,
				}}
			>
				{/* Arrow line */}
				<path
					d="M15 3H21V9"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>

				{/* Diagonal line */}
				<path
					d="M10 14L21 3"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</g>
		</svg>
	);
}
