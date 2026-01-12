export interface TerminalIconProps {
	className?: string;
	style?: React.CSSProperties;
}

export function TerminalIcon({ className, style }: TerminalIconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			className={className}
			style={{ overflow: 'visible', ...style }}
			xmlns="http://www.w3.org/2000/svg"
		>
			{/* Terminal window frame */}
			<rect
				x="2"
				y="4"
				width="20"
				height="16"
				rx="2"
				fill="var(--color-accent-700)"
			/>

			{/* Inner screen */}
			<rect
				x="3"
				y="5"
				width="18"
				height="14"
				rx="1"
				fill="var(--color-accent-900)"
			/>

			{/* Prompt arrow > */}
			<path
				d="M6 9L9 12L6 15"
				stroke="var(--color-accent-400)"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>

			{/* Blinking cursor */}
			<rect
				x="11"
				y="10"
				width="2.5"
				height="5"
				rx="0.5"
				fill="var(--color-accent-400)"
				className="opacity-50 group-hover:animate-blink"
			/>
		</svg>
	);
}
