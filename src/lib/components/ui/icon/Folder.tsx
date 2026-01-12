export interface FolderIconProps {
	className?: string;
	style?: React.CSSProperties;
}

export function FolderIcon({ className, style }: FolderIconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			className={className}
			style={style}
			xmlns="http://www.w3.org/2000/svg"
		>
			{/* Folder back */}
			<path
				d="M2 7C2 5.89543 2.89543 5 4 5H8.17157C8.70201 5 9.21071 5.21071 9.58579 5.58579L10.4142 6.41421C10.7893 6.78929 11.298 7 11.8284 7H20C21.1046 7 22 7.89543 22 9V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V7Z"
				fill="var(--color-accent-700)"
			/>

			{/* Inner dark area - visible when open */}
			<rect
				x="3"
				y="9"
				width="18"
				height="10"
				rx="1"
				fill="var(--color-accent-900)"
				style={{
					opacity: 'calc(var(--active, 0) * 1)',
					transition: 'opacity 0.2s ease',
				}}
			/>

			{/* Front panel - bottom stays fixed, top comes down and to the right */}
			<g
				style={{
					transformOrigin: '12px 20px',
					transform:
						'scaleY(calc(1 - var(--active, 0) * 0.2)) skewX(calc(var(--active, 0) * -8deg))',
					transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
				}}
			>
				<path
					d="M2 10C2 8.89543 2.89543 8 4 8H20C21.1046 8 22 8.89543 22 10V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V10Z"
					fill="var(--color-accent-500)"
				/>
				{/* Highlight on front panel */}
				<path
					d="M3 10C3 9.44772 3.44772 9 4 9H20C20.5523 9 21 9.44772 21 10V11H3V10Z"
					fill="var(--color-accent-400)"
				/>
			</g>
		</svg>
	);
}
