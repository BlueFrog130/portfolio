export interface MailIconProps {
	className?: string;
	style?: React.CSSProperties;
}

export function MailIcon({ className, style }: MailIconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			className={className}
			style={{ overflow: 'visible', ...style }}
			xmlns="http://www.w3.org/2000/svg"
		>
			{/* Envelope body */}
			<rect
				x="2"
				y="4"
				width="20"
				height="16"
				rx="2"
				fill="var(--color-accent-700)"
			/>

			{/* Inner area */}
			<rect
				x="3"
				y="7"
				width="18"
				height="12"
				rx="1"
				fill="var(--color-accent-900)"
			/>

			{/* Envelope flap - opens on hover */}
			<path
				d="M2 6C2 4.89543 2.89543 4 4 4H20C21.1046 4 22 4.89543 22 6L12 13L2 6Z"
				fill="var(--color-accent-500)"
				style={{
					transformOrigin: '12px 4px',
					transform: `rotateX(calc(var(--active, 0) * -45deg))`,
					transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
				}}
			/>

			{/* Letter - slides up from inside envelope (rendered last to be on top) */}
			<g
				style={{
					transform: `translateY(calc(6px - var(--active, 0) * 10px))`,
					opacity: `calc(var(--active, 0) * 1)`,
					transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease',
				}}
			>
				<rect
					x="6"
					y="6"
					width="12"
					height="9"
					rx="1"
					fill="var(--color-accent-300)"
				/>
				{/* Letter lines */}
				<line x1="8" y1="9" x2="16" y2="9" stroke="var(--color-accent-600)" strokeWidth="1" />
				<line x1="8" y1="11" x2="14" y2="11" stroke="var(--color-accent-600)" strokeWidth="1" />
				<line x1="8" y1="13" x2="12" y2="13" stroke="var(--color-accent-600)" strokeWidth="1" />
			</g>
		</svg>
	);
}
