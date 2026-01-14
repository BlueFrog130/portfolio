export function DeploymentPipeline() {
	return (
		<svg
			viewBox="0 0 600 210"
			className="w-full max-w-xl mx-auto my-8"
			style={{ fontFamily: 'Geist, sans-serif' }}
		>
			{/* Hand-drawn style filter */}
			<defs>
				<filter id="roughen3" x="-5%" y="-5%" width="110%" height="110%">
					<feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
					<feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
				</filter>
				<marker id="arrowhead3" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
					<polygon points="0 0, 10 3.5, 0 7" fill="#78716c" />
				</marker>
			</defs>

			{/* Row 1: PR Open → Preview */}
			<g filter="url(#roughen3)">
				<rect x="20" y="20" width="120" height="45" rx="6" fill="#292524" stroke="#f59e0b" strokeWidth="2" />
			</g>
			<text x="80" y="48" textAnchor="middle" fill="#f5f5f4" fontSize="13" fontWeight="500">
				PR Open
			</text>

			<path d="M140 42 L185 42" stroke="#78716c" strokeWidth="2" fill="none" markerEnd="url(#arrowhead3)" />

			<g filter="url(#roughen3)">
				<rect x="195" y="20" width="155" height="45" rx="6" fill="#1c1917" stroke="#57534e" strokeWidth="2" />
			</g>
			<text x="272" y="48" textAnchor="middle" fill="#d6d3d1" fontSize="13">
				Preview Deployment
			</text>

			{/* Row 2: Merge → Live */}
			<g filter="url(#roughen3)">
				<rect x="20" y="85" width="120" height="45" rx="6" fill="#292524" stroke="#f59e0b" strokeWidth="2" />
			</g>
			<text x="80" y="113" textAnchor="middle" fill="#f5f5f4" fontSize="12" fontWeight="500">
				Merge to Release
			</text>

			<path d="M140 107 L420 107" stroke="#78716c" strokeWidth="2" fill="none" markerEnd="url(#arrowhead3)" />

			{/* Live Site - right side spanning both rows */}
			<g filter="url(#roughen3)">
				<rect x="430" y="55" width="150" height="70" rx="6" fill="#292524" stroke="#f59e0b" strokeWidth="2.5" />
			</g>
			<text x="505" y="85" textAnchor="middle" fill="#f5f5f4" fontSize="14" fontWeight="600">
				Live Site
			</text>
			<text x="505" y="105" textAnchor="middle" fill="#a8a29e" fontSize="11">
				Production
			</text>

			{/* Row 3: Nightly → Live */}
			<g filter="url(#roughen3)">
				<rect x="20" y="150" width="180" height="45" rx="6" fill="#292524" stroke="#57534e" strokeWidth="2" />
			</g>
			<text x="110" y="170" textAnchor="middle" fill="#f5f5f4" fontSize="12" fontWeight="500">
				5 AM UTC (Nightly)
			</text>
			<text x="110" y="186" textAnchor="middle" fill="#a8a29e" fontSize="10">
				Refresh cached data
			</text>

			<path d="M200 172 L400 172 L400 125 L420 125" stroke="#78716c" strokeWidth="2" fill="none" markerEnd="url(#arrowhead3)" />
		</svg>
	);
}
