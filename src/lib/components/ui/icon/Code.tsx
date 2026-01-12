export interface CodeIconProps {
	className?: string;
	style?: React.CSSProperties;
}

export function CodeIcon({ className, style }: CodeIconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			className={className}
			style={{ overflow: 'visible', ...style }}
			xmlns="http://www.w3.org/2000/svg"
		>
			{/* Left bracket < - slides in from left */}
			<path
				d="M9 18L3 12L9 6"
				stroke="var(--color-accent-500)"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				style={{
					transform: `translateX(calc(var(--active, 0) * -2px))`,
					transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
				}}
			/>

			{/* Right bracket > - slides in from right */}
			<path
				d="M15 6L21 12L15 18"
				stroke="var(--color-accent-500)"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				style={{
					transform: `translateX(calc(var(--active, 0) * 2px))`,
					transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
				}}
			/>

			{/* Slash / in the middle - fades in and scales */}
			<path
				d="M10 18L14 6"
				stroke="var(--color-accent-400)"
				strokeWidth="2"
				strokeLinecap="round"
				style={{
					opacity: `calc(0.4 + var(--active, 0) * 0.6)`,
					transform: `scaleY(calc(1 + var(--active, 0) * 0.1))`,
					transformOrigin: 'center',
					transition: 'opacity 0.3s ease, transform 0.3s ease',
				}}
			/>
		</svg>
	);
}
