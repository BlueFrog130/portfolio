export function MatchReportingFlow() {
	return (
		<svg
			viewBox="0 0 400 580"
			className="w-full max-w-sm mx-auto my-8"
			style={{ fontFamily: 'Geist, sans-serif' }}
		>
			{/* Hand-drawn style filter */}
			<defs>
				<filter id="roughen2" x="-5%" y="-5%" width="110%" height="110%">
					<feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
					<feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
				</filter>
				<marker id="arrowhead2" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
					<polygon points="0 0, 10 3.5, 0 7" fill="#78716c" />
				</marker>
			</defs>

			{/* Step 1: User submits link */}
			<g filter="url(#roughen2)">
				<rect x="50" y="20" width="300" height="50" rx="6" fill="#292524" stroke="#f59e0b" strokeWidth="2" />
			</g>
			<text x="200" y="50" textAnchor="middle" fill="#f5f5f4" fontSize="13" fontWeight="500">
				User submits Ballchasing link
			</text>

			{/* Arrow 1 */}
			<path d="M200 70 L200 100" stroke="#78716c" strokeWidth="2" fill="none" markerEnd="url(#arrowhead2)" />

			{/* Step 2: Fetch replay */}
			<g filter="url(#roughen2)">
				<rect x="50" y="105" width="300" height="65" rx="6" fill="#292524" stroke="#f59e0b" strokeWidth="2" />
			</g>
			<text x="200" y="132" textAnchor="middle" fill="#f5f5f4" fontSize="13" fontWeight="500">
				Fetch replay from API
			</text>
			<text x="200" y="152" textAnchor="middle" fill="#a8a29e" fontSize="11">
				Extract player platform IDs
			</text>

			{/* Arrow 2 */}
			<path d="M200 170 L200 200" stroke="#78716c" strokeWidth="2" fill="none" markerEnd="url(#arrowhead2)" />

			{/* Step 3: Map platform IDs */}
			<g filter="url(#roughen2)">
				<rect x="50" y="205" width="300" height="65" rx="6" fill="#292524" stroke="#f59e0b" strokeWidth="2" />
			</g>
			<text x="200" y="232" textAnchor="middle" fill="#f5f5f4" fontSize="13" fontWeight="500">
				Map platform IDs → Discord
			</text>
			<text x="200" y="252" textAnchor="middle" fill="#a8a29e" fontSize="11">
				(Interactive if unknown)
			</text>

			{/* Arrow 3 */}
			<path d="M200 270 L200 300" stroke="#78716c" strokeWidth="2" fill="none" markerEnd="url(#arrowhead2)" />

			{/* Step 4: Validate */}
			<g filter="url(#roughen2)">
				<rect x="50" y="305" width="300" height="85" rx="6" fill="#292524" stroke="#f59e0b" strokeWidth="2" />
			</g>
			<text x="200" y="328" textAnchor="middle" fill="#f5f5f4" fontSize="13" fontWeight="500">
				Validate
			</text>
			<text x="200" y="348" textAnchor="middle" fill="#a8a29e" fontSize="11">
				• Team membership
			</text>
			<text x="200" y="365" textAnchor="middle" fill="#a8a29e" fontSize="11">
				• Player count (≤3/side)
			</text>
			<text x="200" y="382" textAnchor="middle" fill="#a8a29e" fontSize="11">
				• Not duplicate
			</text>

			{/* Arrow 4 */}
			<path d="M200 390 L200 420" stroke="#78716c" strokeWidth="2" fill="none" markerEnd="url(#arrowhead2)" />

			{/* Step 5: Firestore Transaction */}
			<g filter="url(#roughen2)">
				<rect x="50" y="425" width="300" height="85" rx="6" fill="#292524" stroke="#f59e0b" strokeWidth="2" />
			</g>
			<text x="200" y="448" textAnchor="middle" fill="#f5f5f4" fontSize="13" fontWeight="500">
				Firestore Transaction
			</text>
			<text x="200" y="468" textAnchor="middle" fill="#a8a29e" fontSize="11">
				• Create/update series
			</text>
			<text x="200" y="485" textAnchor="middle" fill="#a8a29e" fontSize="11">
				• Add game record
			</text>
			<text x="200" y="502" textAnchor="middle" fill="#a8a29e" fontSize="11">
				• Update player stats
			</text>

			{/* Arrow 5 */}
			<path d="M200 510 L200 535" stroke="#78716c" strokeWidth="2" fill="none" markerEnd="url(#arrowhead2)" />

			{/* Step 6: Post results */}
			<g filter="url(#roughen2)">
				<rect x="50" y="540" width="300" height="30" rx="6" fill="#1c1917" stroke="#57534e" strokeWidth="2" />
			</g>
			<text x="200" y="560" textAnchor="middle" fill="#d6d3d1" fontSize="12">
				Post results • Check series completion
			</text>
		</svg>
	);
}
