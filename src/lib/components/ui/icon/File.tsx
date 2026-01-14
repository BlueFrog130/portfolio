export interface FileIconProps {
	className?: string;
	style?: React.CSSProperties;
}

export function FileIcon({ className, style }: FileIconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			className={className}
			style={style}
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"
				fill="var(--color-surface-700)"
				stroke="var(--color-surface-500)"
				strokeWidth="1.5"
			/>
			<path
				d="M14 2V8H20"
				fill="var(--color-surface-600)"
				stroke="var(--color-surface-500)"
				strokeWidth="1.5"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
