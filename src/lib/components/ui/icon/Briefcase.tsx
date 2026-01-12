export interface BriefcaseIconProps {
	className?: string;
	style?: React.CSSProperties;
}

export function BriefcaseIcon({ className, style }: BriefcaseIconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			className={className}
			style={style}
			xmlns="http://www.w3.org/2000/svg"
		>
			{/* Handle */}
			<path
				d="M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6"
				stroke="var(--color-accent-600)"
				strokeWidth="2"
				strokeLinecap="round"
			/>

			{/* Main body */}
			<rect
				x="2"
				y="7"
				width="20"
				height="14"
				rx="2"
				fill="var(--color-accent-700)"
			/>

			{/* Documents inside - visible when open */}
			<g
				style={{
					opacity: 'calc(var(--active, 0) * 1)',
					transform: 'translateY(calc(var(--active, 0) * -2px))',
					transition: 'opacity 0.2s ease, transform 0.3s ease',
				}}
			>
				<rect
					x="6"
					y="10"
					width="5"
					height="7"
					rx="0.5"
					fill="var(--color-accent-200)"
				/>
				<rect
					x="13"
					y="11"
					width="5"
					height="6"
					rx="0.5"
					fill="var(--color-accent-300)"
				/>
			</g>

			{/* Lid - hinges from back edge */}
			<g
				style={{
					transformOrigin: '12px 7px',
					transform: `rotateX(calc(var(--active, 0) * 45deg)) translateY(calc(var(--active, 0) * -1px))`,
					transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
				}}
			>
				<rect
					x="2"
					y="7"
					width="20"
					height="6"
					rx="2"
					fill="var(--color-accent-500)"
				/>
				{/* Center clasp */}
				<rect
					x="10"
					y="9"
					width="4"
					height="2"
					rx="0.5"
					fill="var(--color-accent-300)"
				/>
			</g>

			{/* Buckle/latch detail */}
			<rect
				x="10"
				y="12"
				width="4"
				height="3"
				rx="0.5"
				fill="var(--color-accent-400)"
				style={{
					opacity: 'calc(1 - var(--active, 0) * 0.5)',
					transition: 'opacity 0.2s ease',
				}}
			/>
		</svg>
	);
}
