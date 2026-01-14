export interface SparklesIconProps {
	className?: string;
	style?: React.CSSProperties;
}

export function SparklesIcon({ className, style }: SparklesIconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			className={className}
			style={{ overflow: 'visible', ...style }}
			xmlns="http://www.w3.org/2000/svg"
		>
			{/* Main large sparkle - pulses and rotates slightly */}
			<path
				d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z"
				fill="currentColor"
				style={{
					transformOrigin: '12px 10px',
					transform: `scale(calc(1 + var(--active, 0) * 0.1)) rotate(calc(var(--active, 0) * 15deg))`,
					transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
				}}
			/>

			{/* Top right small sparkle - twinkles in */}
			<path
				d="M19 3L19.75 5.25L22 6L19.75 6.75L19 9L18.25 6.75L16 6L18.25 5.25L19 3Z"
				fill="currentColor"
				style={{
					transformOrigin: '19px 6px',
					opacity: `calc(0.4 + var(--active, 0) * 0.6)`,
					transform: `scale(calc(0.7 + var(--active, 0) * 0.5))`,
					transition: 'opacity 0.3s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
				}}
			/>

			{/* Bottom left small sparkle - twinkles in with delay */}
			<path
				d="M6 15L6.75 17.25L9 18L6.75 18.75L6 21L5.25 18.75L3 18L5.25 17.25L6 15Z"
				fill="currentColor"
				style={{
					transformOrigin: '6px 18px',
					opacity: `calc(0.3 + var(--active, 0) * 0.7)`,
					transform: `scale(calc(0.6 + var(--active, 0) * 0.6))`,
					transition: 'opacity 0.3s ease 0.1s, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s',
				}}
			/>

			{/* Extra tiny sparkle - appears on hover */}
			<circle
				cx="17"
				cy="14"
				r="1"
				fill="currentColor"
				style={{
					opacity: `calc(var(--active, 0) * 1)`,
					transform: `scale(calc(var(--active, 0) * 1))`,
					transformOrigin: 'center',
					transition: 'opacity 0.2s ease 0.15s, transform 0.3s ease 0.15s',
				}}
			/>
		</svg>
	);
}
