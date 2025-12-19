// resume-generator.tsx
import React from 'react';
import {
	Document,
	Page,
	Text,
	View,
	Link,
	StyleSheet,
	renderToFile,
} from '@react-pdf/renderer';

// ============================================================================
// RESUME DATA
// ============================================================================
const resumeData = {
	name: 'Adam Grady',
	title: 'Senior Software Engineer',
	contact: {
		phone: '402-616-5375',
		email: 'adam.grady@live.com',
		location: 'Sioux Falls, SD',
		linkedin: 'linkedin.com/in/adam-grady',
		github: 'github.com/BlueFrog130',
		website: 'adamgrady.dev',
	},
	summary:
		'Senior Software Engineer with 6+ years building healthcare software at scale. Led React/TypeScript adoption across 4 development teams. Architected AI-integrated systems and mentored 10+ engineers. Passionate about developer experience and modern web technologies.',
	experience: [
		{
			title: 'Senior Software Engineer',
			company: 'Solarity',
			location: 'Sioux Falls, SD',
			period: 'Jun 2025 – Present',
			bullets: [
				'Spearhead AI adoption across 3 engineering teams, implementing MCP tools for devs, QA, and tech writers',
				'Architect agentic AI integrations within healthcare systems serving 140+ medical facilities',
				'Develop internal developer tools using Claude API and custom agents, accelerating feature delivery',
				'Mentor engineers on AI best practices through knowledge-sharing sessions',
			],
		},
		{
			title: 'Software Engineer II',
			company: 'Solarity',
			location: 'Sioux Falls, SD',
			period: 'Apr 2023 – Jun 2025',
			bullets: [
				'Led React/TypeScript adoption across 4 teams, establishing patterns that reduced frontend bugs',
				'Architected replacement backend using .NET Core state machines, significantly reducing maintenance burden',
				'Created Figma design system and trained 15+ developers, improving how designs are implemented',
			],
		},
		{
			title: 'Software Engineer',
			company: 'Solarity',
			location: 'Sioux Falls, SD',
			period: 'Jan 2022 – Apr 2023',
			bullets: [
				'Drove Figma adoption across 4 development teams',
				'Modernized legacy ASP.NET MVC codebase, migrating 20+ pages to ES6+ JavaScript patterns',
				'Designed 4 UI/UX prototypes that increased developer implementation rates',
			],
		},
		{
			title: 'Software Engineer Intern',
			company: 'Solarity',
			location: 'Sioux Falls, SD',
			period: 'May 2019 – Jun 2022',
			bullets: [
				'Built full-stack inventory management app with Vue.js and ASP.NET Core, used by warehouse staff',
				'Implemented Docker containerization and GitLab CI/CD, reducing deployment time from hours to minutes',
				'Promoted from intern to full-time after demonstrating ownership of production systems',
			],
		},
	],
	education: [
		{
			degree: 'M.S. Computer Science',
			school: 'University of South Dakota',
			period: '2020 – 2021',
			details: '4+1 Accelerated Program • ML/AI Focus',
		},
		{
			degree: 'B.S. Computer Science',
			school: 'University of South Dakota',
			period: '2017 – 2021',
			details: 'ACM • Research • eSports',
		},
	],
	skills: {
		Languages: 'TypeScript, JavaScript, C#, SQL, Python, Java',
		Frontend: 'React, Vue, Svelte, Tailwind CSS, HTML/CSS, UI/UX Design',
		Backend: 'ASP.NET Core, .NET, REST APIs, Node.js, GraphQL, Redis',
		Infrastructure: 'Docker, CI/CD, Azure, AWS, Cloudflare, Git',
	},
	publications: [
		{
			title:
				'Experimental Study of Network Traffic Overhead in Cloud Environments',
			venue: 'IEEE IETC 2020',
		},
	],
	projects: [
		{
			name: 'Superstar Series',
			description:
				'Polyglot esports platform for Rocket League tournaments with Discord integration',
			tech: 'SvelteKit, C#/.NET, Discord API',
		},
		{
			name: 'Volleyball Assist',
			description:
				'Tournament management with real-time scoring and multi-device sync',
			tech: 'SvelteKit, Firebase, Stripe',
		},
		{
			name: 'wMammogram',
			description:
				'7-day interactive health education app for breast cancer awareness among indigenous women',
			tech: 'Vue.js, Firebase, TypeScript',
		},
	],
};

// ============================================================================
// STYLES - Clean, professional design
// ============================================================================
const colors = {
	primary: '#111827', // Near black
	secondary: '#374151', // Dark gray
	accent: '#1d4ed8', // Professional blue
	text: '#1f2937',
	muted: '#6b7280',
	border: '#d1d5db',
};

const styles = StyleSheet.create({
	page: {
		padding: 40,
		paddingTop: 36,
		paddingBottom: 36,
		fontSize: 10,
		fontFamily: 'Helvetica',
		color: colors.text,
		lineHeight: 1.3,
	},

	// Header - compact, professional
	header: {
		marginBottom: 12,
		borderBottom: `1.5 solid ${colors.primary}`,
		paddingBottom: 10,
	},
	nameRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'baseline',
		marginBottom: 12,
	},
	name: {
		fontSize: 22,
		fontFamily: 'Helvetica-Bold',
		color: colors.primary,
		letterSpacing: 0.5,
	},
	title: {
		fontSize: 11,
		color: colors.secondary,
		fontFamily: 'Helvetica',
	},
	contactRow: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		gap: 4,
	},
	contactLink: {
		fontSize: 9,
		color: colors.accent,
		textDecoration: 'none',
	},
	contactText: {
		fontSize: 9,
		color: colors.secondary,
	},
	contactSeparator: {
		fontSize: 9,
		color: colors.muted,
		marginHorizontal: 6,
	},

	// Sections
	section: {
		marginBottom: 10,
	},
	sectionHeader: {
		fontSize: 10,
		fontFamily: 'Helvetica-Bold',
		color: colors.primary,
		textTransform: 'uppercase',
		letterSpacing: 1,
		marginBottom: 6,
		paddingBottom: 2,
		borderBottom: `0.5 solid ${colors.border}`,
	},

	// Summary
	summary: {
		fontSize: 9.5,
		color: colors.secondary,
		lineHeight: 1.4,
	},

	// Experience
	experienceItem: {
		marginBottom: 8,
	},
	experienceHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'baseline',
		marginBottom: 1,
	},
	jobTitleRow: {
		flexDirection: 'row',
		alignItems: 'baseline',
	},
	jobTitle: {
		fontSize: 10,
		fontFamily: 'Helvetica-Bold',
		color: colors.primary,
	},
	companySeparator: {
		fontSize: 10,
		color: colors.muted,
		marginHorizontal: 4,
	},
	company: {
		fontSize: 10,
		color: colors.secondary,
	},
	periodLocation: {
		fontSize: 9,
		color: colors.muted,
		fontFamily: 'Helvetica-Oblique',
	},
	bulletList: {
		marginTop: 3,
		paddingLeft: 8,
	},
	bulletItem: {
		flexDirection: 'row',
		marginBottom: 1.5,
	},
	bullet: {
		width: 10,
		fontSize: 9,
		color: colors.muted,
	},
	bulletText: {
		flex: 1,
		fontSize: 9,
		color: colors.text,
		lineHeight: 1.35,
	},

	// Education
	educationItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'baseline',
		marginBottom: 3,
	},
	educationLeft: {
		flexDirection: 'row',
		alignItems: 'baseline',
		flex: 1,
	},
	degree: {
		fontSize: 10,
		fontFamily: 'Helvetica-Bold',
		color: colors.primary,
	},
	school: {
		fontSize: 9,
		color: colors.secondary,
		marginLeft: 6,
	},
	educationDetails: {
		fontSize: 8,
		color: colors.muted,
		fontFamily: 'Helvetica-Oblique',
		marginLeft: 6,
	},
	period: {
		fontSize: 9,
		color: colors.muted,
		fontFamily: 'Helvetica-Oblique',
	},

	// Skills - compact inline
	skillsGrid: {
		flexDirection: 'column',
		gap: 2,
	},
	skillRow: {
		flexDirection: 'row',
	},
	skillCategory: {
		width: 75,
		fontSize: 9,
		fontFamily: 'Helvetica-Bold',
		color: colors.secondary,
	},
	skillValues: {
		flex: 1,
		fontSize: 9,
		color: colors.text,
	},

	// Projects - compact
	projectsGrid: {
		flexDirection: 'column',
		gap: 4,
	},
	projectItem: {
		flexDirection: 'row',
	},
	projectName: {
		fontSize: 9,
		fontFamily: 'Helvetica-Bold',
		color: colors.primary,
		width: 95,
	},
	projectDescription: {
		flex: 1,
		fontSize: 9,
		color: colors.text,
	},
	projectTech: {
		fontSize: 8,
		color: colors.muted,
		fontFamily: 'Helvetica-Oblique',
		marginLeft: 4,
	},

	// Publications
	publication: {
		fontSize: 9,
		color: colors.text,
	},
	pubVenue: {
		fontFamily: 'Helvetica-Oblique',
		color: colors.muted,
	},
});

// ============================================================================
// COMPONENTS
// ============================================================================
const Header = ({ data }: { data: typeof resumeData }) => (
	<View style={styles.header}>
		<View style={styles.nameRow}>
			<Text style={styles.name}>{data.name}</Text>
			<Text style={styles.title}>{data.title}</Text>
		</View>
		<View style={styles.contactRow}>
			<Text style={styles.contactText}>{data.contact.phone}</Text>
			<Text style={styles.contactSeparator}>|</Text>
			<Link src={`mailto:${data.contact.email}`} style={styles.contactLink}>
				{data.contact.email}
			</Link>
			<Text style={styles.contactSeparator}>|</Text>
			<Text style={styles.contactText}>{data.contact.location}</Text>
			<Text style={styles.contactSeparator}>|</Text>
			<Link src={`https://${data.contact.linkedin}`} style={styles.contactLink}>
				{data.contact.linkedin}
			</Link>
			<Text style={styles.contactSeparator}>|</Text>
			<Link src={`https://${data.contact.github}`} style={styles.contactLink}>
				{data.contact.github}
			</Link>
			<Text style={styles.contactSeparator}>|</Text>
			<Link src={`https://${data.contact.website}`} style={styles.contactLink}>
				{data.contact.website}
			</Link>
		</View>
	</View>
);

const Summary = ({ text }: { text: string }) => (
	<View style={styles.section}>
		<Text style={styles.sectionHeader}>Summary</Text>
		<Text style={styles.summary}>{text}</Text>
	</View>
);

const ExperienceItem = ({
	job,
}: {
	job: (typeof resumeData.experience)[0];
}) => (
	<View style={styles.experienceItem}>
		<View style={styles.experienceHeader}>
			<View style={styles.jobTitleRow}>
				<Text style={styles.jobTitle}>{job.title}</Text>
				<Text style={styles.companySeparator}>—</Text>
				<Text style={styles.company}>{job.company}</Text>
			</View>
			<Text style={styles.periodLocation}>
				{job.period} · {job.location}
			</Text>
		</View>
		<View style={styles.bulletList}>
			{job.bullets.map((bullet, i) => (
				<View key={i} style={styles.bulletItem}>
					<Text style={styles.bullet}>•</Text>
					<Text style={styles.bulletText}>{bullet}</Text>
				</View>
			))}
		</View>
	</View>
);

const Experience = ({ jobs }: { jobs: typeof resumeData.experience }) => (
	<View style={styles.section}>
		<Text style={styles.sectionHeader}>Experience</Text>
		{jobs.map((job, i) => (
			<ExperienceItem key={i} job={job} />
		))}
	</View>
);

const Education = ({
	education,
}: {
	education: typeof resumeData.education;
}) => (
	<View style={styles.section}>
		<Text style={styles.sectionHeader}>Education</Text>
		{education.map((edu, i) => (
			<View key={i} style={styles.educationItem}>
				<View style={styles.educationLeft}>
					<Text style={styles.degree}>{edu.degree}</Text>
					<Text style={styles.school}>{edu.school}</Text>
					{edu.details && (
						<Text style={styles.educationDetails}>({edu.details})</Text>
					)}
				</View>
				<Text style={styles.period}>{edu.period}</Text>
			</View>
		))}
	</View>
);

const Skills = ({ skills }: { skills: typeof resumeData.skills }) => (
	<View style={styles.section}>
		<Text style={styles.sectionHeader}>Technical Skills</Text>
		<View style={styles.skillsGrid}>
			{Object.entries(skills).map(([category, values], i) => (
				<View key={i} style={styles.skillRow}>
					<Text style={styles.skillCategory}>{category}:</Text>
					<Text style={styles.skillValues}>{values}</Text>
				</View>
			))}
		</View>
	</View>
);

const Projects = ({ projects }: { projects: typeof resumeData.projects }) => (
	<View style={styles.section}>
		<Text style={styles.sectionHeader}>Projects</Text>
		<View style={styles.projectsGrid}>
			{projects.map((project, i) => (
				<View key={i} style={styles.projectItem}>
					<Text style={styles.projectName}>{project.name}</Text>
					<Text style={styles.projectDescription}>
						{project.description}
						<Text style={styles.projectTech}> [{project.tech}]</Text>
					</Text>
				</View>
			))}
		</View>
	</View>
);

const Publications = ({
	publications,
}: {
	publications: typeof resumeData.publications;
}) => (
	<View style={styles.section}>
		<Text style={styles.sectionHeader}>Publications</Text>
		{publications.map((pub, i) => (
			<Text key={i} style={styles.publication}>
				{pub.title} — <Text style={styles.pubVenue}>{pub.venue}</Text>
			</Text>
		))}
	</View>
);

// ============================================================================
// MAIN DOCUMENT
// ============================================================================
const ResumeDocument = ({ data }: { data: typeof resumeData }) => (
	<Document
		title={`${data.name} - Resume`}
		author={data.name}
		subject="Professional Resume"
		keywords="software engineer, react, typescript, full-stack, AI, healthcare"
		creator={data.name}
	>
		<Page size="LETTER" style={styles.page}>
			<Header data={data} />
			<Summary text={data.summary} />
			<Skills skills={data.skills} />
			<Experience jobs={data.experience} />
			<Education education={data.education} />
			<Projects projects={data.projects} />
			<Publications publications={data.publications} />
		</Page>
	</Document>
);

// ============================================================================
// GENERATE PDF
// ============================================================================
const outputPath = './adam-grady-resume.pdf';

renderToFile(<ResumeDocument data={resumeData} />, outputPath)
	.then(() => {
		console.log(`✅ Resume PDF generated successfully!`);
		console.log(`📄 Output: ${outputPath}`);
		console.log(JSON.stringify(resumeData, null, 2));
	})
	.catch((err) => {
		console.error('❌ Error generating PDF:', err);
		process.exit(1);
	});
