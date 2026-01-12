export interface CloudIconProps {
	className?: string;
	style?: React.CSSProperties;
}

export function CloudIcon({ className, style }: CloudIconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			className={className}
			style={{ overflow: 'visible', ...style }}
			xmlns="http://www.w3.org/2000/svg"
		>
			{/* Main cloud body - lifts slightly on hover */}
			<g
				style={{
					transform: `translateY(calc(var(--active, 0) * -1px))`,
					transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
				}}
			>
				{/* Cloud shape */}
				<path
					d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"
					fill="var(--color-accent-600)"
				/>
				{/* Cloud highlight */}
				<path
					d="M18 10h-1.26A8 8 0 0 0 6.07 8.5 6 6 0 0 1 16.74 10H18a5 5 0 0 1 4.9 4A5 5 0 0 0 18 10z"
					fill="var(--color-accent-500)"
				/>
			</g>

			{/* Upload arrow - appears and animates on hover */}
			<g
				style={{
					opacity: `calc(var(--active, 0) * 1)`,
					transform: `translateY(calc(2px - var(--active, 0) * 2px))`,
					transition: 'opacity 0.2s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
				}}
			>
				{/* Arrow line */}
				<line
					x1="12"
					y1="16"
					x2="12"
					y2="22"
					stroke="var(--color-accent-400)"
					strokeWidth="2"
					strokeLinecap="round"
				/>
				{/* Arrow head */}
				<path
					d="M8 20L12 16L16 20"
					stroke="var(--color-accent-400)"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</g>

			{/* Sync dots - pulse on hover */}
			<circle
				cx="9"
				cy="13"
				r="1.5"
				fill="var(--color-accent-400)"
				style={{
					opacity: `calc(0.3 + var(--active, 0) * 0.7)`,
					transform: `scale(calc(1 + var(--active, 0) * 0.3))`,
					transformOrigin: 'center',
					transition: 'opacity 0.2s ease, transform 0.3s ease',
				}}
			/>
			<circle
				cx="13"
				cy="11"
				r="1.5"
				fill="var(--color-accent-300)"
				style={{
					opacity: `calc(0.3 + var(--active, 0) * 0.7)`,
					transform: `scale(calc(1 + var(--active, 0) * 0.3))`,
					transformOrigin: 'center',
					transition: 'opacity 0.2s ease 0.1s, transform 0.3s ease 0.1s',
				}}
			/>
			<circle
				cx="17"
				cy="13"
				r="1.5"
				fill="var(--color-accent-400)"
				style={{
					opacity: `calc(0.3 + var(--active, 0) * 0.7)`,
					transform: `scale(calc(1 + var(--active, 0) * 0.3))`,
					transformOrigin: 'center',
					transition: 'opacity 0.2s ease 0.2s, transform 0.3s ease 0.2s',
				}}
			/>
		</svg>
	);
}
