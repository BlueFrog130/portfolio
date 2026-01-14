export function ArchitectureDiagram() {
	return (
		<svg
			viewBox="0 0 800 520"
			className="w-full max-w-3xl mx-auto my-8"
			style={{ fontFamily: 'Geist, sans-serif' }}
		>
			{/* Hand-drawn style filter */}
			<defs>
				<filter id="roughen" x="-5%" y="-5%" width="110%" height="110%">
					<feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
					<feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
				</filter>
			</defs>

			{/* Discord Users - Top */}
			<g filter="url(#roughen)">
				<rect x="300" y="10" width="200" height="45" rx="6" fill="#292524" stroke="#f59e0b" strokeWidth="2" />
			</g>
			<text x="400" y="38" textAnchor="middle" fill="#f5f5f4" fontSize="14" fontWeight="500">
				Discord Users
			</text>

			{/* Arrows from users */}
			<path d="M340 55 L200 95" stroke="#78716c" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
			<path d="M400 55 L400 95" stroke="#78716c" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
			<path d="M460 55 L600 95" stroke="#78716c" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />

			{/* Arrow marker */}
			<defs>
				<marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
					<polygon points="0 0, 10 3.5, 0 7" fill="#78716c" />
				</marker>
			</defs>

			{/* Application Layer */}
			<g filter="url(#roughen)">
				<rect x="30" y="100" width="740" height="120" rx="8" fill="#1c1917" stroke="#57534e" strokeWidth="2" strokeDasharray="8 4" />
			</g>
			<text x="50" y="125" fill="#a8a29e" fontSize="12" fontWeight="500">
				Application Layer
			</text>

			{/* Discord Bot */}
			<g filter="url(#roughen)">
				<rect x="60" y="140" width="200" height="60" rx="6" fill="#292524" stroke="#f59e0b" strokeWidth="2" />
			</g>
			<text x="160" y="165" textAnchor="middle" fill="#f5f5f4" fontSize="13" fontWeight="500">
				Discord Bot
			</text>
			<text x="160" y="185" textAnchor="middle" fill="#a8a29e" fontSize="11">
				C#/.NET
			</text>

			{/* Website */}
			<g filter="url(#roughen)">
				<rect x="300" y="140" width="200" height="60" rx="6" fill="#292524" stroke="#f59e0b" strokeWidth="2" />
			</g>
			<text x="400" y="165" textAnchor="middle" fill="#f5f5f4" fontSize="13" fontWeight="500">
				Website (Static)
			</text>
			<text x="400" y="185" textAnchor="middle" fill="#a8a29e" fontSize="11">
				SvelteKit
			</text>

			{/* Cloud Functions */}
			<g filter="url(#roughen)">
				<rect x="540" y="140" width="200" height="60" rx="6" fill="#292524" stroke="#f59e0b" strokeWidth="2" />
			</g>
			<text x="640" y="165" textAnchor="middle" fill="#f5f5f4" fontSize="13" fontWeight="500">
				Cloud Functions
			</text>
			<text x="640" y="185" textAnchor="middle" fill="#a8a29e" fontSize="11">
				TypeScript
			</text>

			{/* Arrows to Firestore */}
			<path d="M160 200 L160 260" stroke="#78716c" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
			<path d="M400 200 L400 260" stroke="#78716c" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
			<path d="M640 200 L640 260" stroke="#78716c" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />

			{/* Google Cloud Firestore */}
			<g filter="url(#roughen)">
				<rect x="30" y="265" width="740" height="130" rx="8" fill="#1c1917" stroke="#57534e" strokeWidth="2" strokeDasharray="8 4" />
			</g>
			<text x="50" y="290" fill="#a8a29e" fontSize="12" fontWeight="500">
				Google Cloud Firestore
			</text>

			{/* Firestore items */}
			<g filter="url(#roughen)">
				<rect x="60" y="305" width="320" height="35" rx="4" fill="#292524" stroke="#57534e" strokeWidth="1.5" />
			</g>
			<text x="220" y="328" textAnchor="middle" fill="#d6d3d1" fontSize="11">
				Seasons/&#123;id&#125;/Series → Games → PlayerStats
			</text>

			<g filter="url(#roughen)">
				<rect x="420" y="305" width="320" height="35" rx="4" fill="#292524" stroke="#57534e" strokeWidth="1.5" />
			</g>
			<text x="580" y="328" textAnchor="middle" fill="#d6d3d1" fontSize="11">
				Users/&#123;id&#125; → Profile, Discord mapping
			</text>

			<g filter="url(#roughen)">
				<rect x="60" y="350" width="320" height="35" rx="4" fill="#292524" stroke="#57534e" strokeWidth="1.5" />
			</g>
			<text x="220" y="373" textAnchor="middle" fill="#d6d3d1" fontSize="11">
				Config → Divisions, Teams, Channels
			</text>

			<g filter="url(#roughen)">
				<rect x="420" y="350" width="320" height="35" rx="4" fill="#292524" stroke="#57534e" strokeWidth="1.5" />
			</g>
			<text x="580" y="373" textAnchor="middle" fill="#d6d3d1" fontSize="11">
				Clips → Metadata, Ratings
			</text>

			{/* Arrow to External */}
			<path d="M160 395 L160 430" stroke="#78716c" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />

			{/* External Services */}
			<g filter="url(#roughen)">
				<rect x="30" y="435" width="400" height="75" rx="8" fill="#1c1917" stroke="#57534e" strokeWidth="2" strokeDasharray="8 4" />
			</g>
			<text x="50" y="458" fill="#a8a29e" fontSize="12" fontWeight="500">
				External Services
			</text>

			<g filter="url(#roughen)">
				<rect x="60" y="468" width="160" height="30" rx="4" fill="#292524" stroke="#57534e" strokeWidth="1.5" />
			</g>
			<text x="140" y="488" textAnchor="middle" fill="#d6d3d1" fontSize="11">
				Ballchasing.com API
			</text>

			<g filter="url(#roughen)">
				<rect x="240" y="468" width="160" height="30" rx="4" fill="#292524" stroke="#57534e" strokeWidth="1.5" />
			</g>
			<text x="320" y="488" textAnchor="middle" fill="#d6d3d1" fontSize="11">
				Discord API
			</text>
		</svg>
	);
}
