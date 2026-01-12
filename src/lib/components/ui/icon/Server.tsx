export interface ServerIconProps {
	className?: string;
	style?: React.CSSProperties;
}

export function ServerIcon({ className, style }: ServerIconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			className={className}
			style={{ overflow: 'visible', ...style }}
			xmlns="http://www.w3.org/2000/svg"
		>
			{/* Top server unit */}
			<rect
				x="3"
				y="3"
				width="18"
				height="6"
				rx="1.5"
				fill="var(--color-accent-700)"
			/>
			{/* Top unit front panel */}
			<rect
				x="3"
				y="5"
				width="18"
				height="4"
				rx="1"
				fill="var(--color-accent-600)"
			/>
			{/* Top unit indicator light */}
			<circle
				cx="17"
				cy="6"
				r="1.5"
				fill="var(--color-accent-400)"
				style={{
					opacity: `calc(0.4 + var(--active, 0) * 0.6)`,
					transition: 'opacity 0.2s ease',
				}}
			/>

			{/* Middle server unit */}
			<rect
				x="3"
				y="10"
				width="18"
				height="6"
				rx="1.5"
				fill="var(--color-accent-700)"
			/>
			{/* Middle unit front panel */}
			<rect
				x="3"
				y="12"
				width="18"
				height="4"
				rx="1"
				fill="var(--color-accent-600)"
			/>
			{/* Middle unit indicator light - pulses on hover */}
			<circle
				cx="17"
				cy="13"
				r="1.5"
				fill="var(--color-accent-300)"
				style={{
					opacity: `calc(0.6 + var(--active, 0) * 0.4)`,
					transform: `scale(calc(1 + var(--active, 0) * 0.2))`,
					transformOrigin: 'center',
					transition: 'opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s',
				}}
			/>

			{/* Bottom server unit */}
			<rect
				x="3"
				y="17"
				width="18"
				height="6"
				rx="1.5"
				fill="var(--color-accent-700)"
			/>
			{/* Bottom unit front panel */}
			<rect
				x="3"
				y="19"
				width="18"
				height="4"
				rx="1"
				fill="var(--color-accent-600)"
			/>
			{/* Bottom unit indicator light */}
			<circle
				cx="17"
				cy="20"
				r="1.5"
				fill="var(--color-accent-500)"
				style={{
					opacity: `calc(0.5 + var(--active, 0) * 0.5)`,
					transition: 'opacity 0.3s ease 0.2s',
				}}
			/>

			{/* Data flow lines - appear on hover */}
			<g
				style={{
					opacity: `calc(var(--active, 0) * 1)`,
					transition: 'opacity 0.3s ease',
				}}
			>
				<line
					x1="6"
					y1="6"
					x2="10"
					y2="6"
					stroke="var(--color-accent-400)"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeDasharray="2 2"
				/>
				<line
					x1="6"
					y1="13"
					x2="12"
					y2="13"
					stroke="var(--color-accent-400)"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeDasharray="2 2"
				/>
				<line
					x1="6"
					y1="20"
					x2="10"
					y2="20"
					stroke="var(--color-accent-400)"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeDasharray="2 2"
				/>
			</g>
		</svg>
	);
}
