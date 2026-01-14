export interface HomeIconProps {
	className?: string;
	style?: React.CSSProperties;
}

export function HomeIcon({ className, style }: HomeIconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			className={className}
			style={{ overflow: 'visible', ...style }}
			xmlns="http://www.w3.org/2000/svg"
		>
			{/* House base */}
			<path
				d="M3 10.5L12 3L21 10.5V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V10.5Z"
				fill="var(--color-accent-700)"
			/>

			{/* Roof - lifts slightly on hover */}
			<path
				d="M1 11L12 2L23 11"
				stroke="var(--color-accent-500)"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				style={{
					transform: `translateY(calc(var(--active, 0) * -2px))`,
					transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
				}}
			/>

			{/* Door - opens slightly on hover */}
			<rect
				x="9"
				y="13"
				width="6"
				height="8"
				rx="0.5"
				fill="var(--color-accent-500)"
				style={{
					transformOrigin: '9px 17px',
					transform: `scaleX(calc(1 - var(--active, 0) * 0.1)) skewY(calc(var(--active, 0) * -3deg))`,
					transition: 'transform 0.3s ease',
				}}
			/>

			{/* Door knob */}
			<circle
				cx="13.5"
				cy="17"
				r="0.75"
				fill="var(--color-accent-300)"
				style={{
					transform: `translateX(calc(var(--active, 0) * -1px))`,
					transition: 'transform 0.3s ease',
				}}
			/>

			{/* Window */}
			<rect
				x="5"
				y="12"
				width="3"
				height="3"
				rx="0.5"
				fill="var(--color-accent-400)"
				style={{
					opacity: `calc(0.6 + var(--active, 0) * 0.4)`,
					transition: 'opacity 0.2s ease',
				}}
			/>

			{/* Chimney smoke - appears on hover */}
			<g
				style={{
					opacity: `calc(var(--active, 0) * 1)`,
					transform: `translateY(calc(2px - var(--active, 0) * 2px))`,
					transition: 'opacity 0.3s ease, transform 0.4s ease',
				}}
			>
				<circle cx="17" cy="2" r="1" fill="var(--color-accent-400)" />
				<circle cx="18.5" cy="0" r="0.75" fill="var(--color-accent-500)" />
			</g>
		</svg>
	);
}
