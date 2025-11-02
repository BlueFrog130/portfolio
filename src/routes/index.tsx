import * as Card from '@/lib/components/ui/glow-card';
import { ExternalLink } from '@/lib/components/ui/link';
import { createFileRoute } from '@tanstack/react-router';
import { type MouseEventHandler, useEffect, useRef } from 'react';

export const Route = createFileRoute('/')({
	component: Home
});

const navLinks = [
	{ label: 'About', href: '#about' },
	{ label: 'Experience', href: '#experience' }
];

interface ExperienceItem {
	company: string;
	role: string;
	start: string; // ISO or human-readable (MMM YYYY)
	end: string; // "Present" or end date
	location: string;
	bullets: string[];
	link: string;
}

const experience: ExperienceItem[] = [
	{
		company: 'Solarity Health',
		role: 'Senior Software Engineer (Full-Stack)',
		start: 'May 2019',
		end: 'Present',
		location: 'Sioux Falls, SD',
		link: 'https://solarityhealth.com/',
		bullets: [
			'Write and review production code across JS, TypeScript, React, C#, SQL, HTML, and CSS.',
			'Led modernization initiative adopting TypeScript, React, and contemporary engineering standards.',
			'Built internal full-stack tooling to streamline configuration of billing and operational systems, improving reliability and developer efficiency.',
			'Progressed from intern to senior-level contributor while mentoring peers and reinforcing code quality practices.'
		]
	},
	{
		company: 'Grady Development',
		role: 'Founder / Full-Stack Engineer',
		start: 'Jan 2022',
		end: 'Present',
		location: 'Vermillion, SD',
		link: 'https://gradydevelopment.com/',
		bullets: [
			'Founded a consultancy delivering bespoke software solutions for small businesses.',
			'Developed a rental property platform improving search ranking and maximizing occupancy.',
			'Created wMammogram—an interactive educational course increasing mammogram screening uptake among participants.',
			'Architected and deployed solutions across AWS, Azure, Google Cloud, and Cloudflare with CI/CD and performance-focused designs.'
		]
	},
	{
		company: 'University of South Dakota',
		role: 'Graduate Assistant',
		start: 'Jan 2021',
		end: 'Jun 2022',
		location: 'Vermillion, SD',
		link: 'https://www.usd.edu/Academics/Colleges-and-Schools/college-of-arts-sciences/computer-science',
		bullets: [
			'Designed and built CodingStub—containerized, microservice-based coding practice environment for students.',
			'Delivered lectures, mentored students, and supported curriculum execution.',
			'Integrated secure, isolated execution environments to enhance learning outcomes.'
		]
	},
	{
		company: 'University of South Dakota',
		role: 'Research Assistant',
		start: 'Jan 2019',
		end: 'May 2020',
		location: 'Vermillion, SD',
		link: 'https://www.usd.edu/Academics/Colleges-and-Schools/college-of-arts-sciences/computer-science',
		bullets: [
			'Researched SDN performance and security implications in cloud environments.',
			'Presented findings at the 2020 Intermountain Engineering, Technology & Computing (IETC) Conference and USD Research Fair.',
			'Produced empirical analysis of network traffic overhead to inform future architectural decisions.'
		]
	}
];

function Home() {
	const sections = useRef<HTMLElement[]>([]);

	useEffect(() => {
		const navLinks = document.querySelectorAll('nav a');
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						// Clear all active states
						navLinks.forEach((link) => link.setAttribute('data-active', 'false'));
						// Set active state on the link corresponding to the intersecting section
						const id = entry.target.getAttribute('id');
						const activeLink = Array.from(navLinks).find(
							(link) => link.getAttribute('href') === `#${id}`
						);
						if (activeLink) {
							activeLink.setAttribute('data-active', 'true');
						}
					}
				});
			},
			{ rootMargin: '0px 0px -50% 0px', threshold: 0 }
		);

		sections.current.forEach((section) => {
			if (section) observer.observe(section);
		});

		return () => {
			sections.current.forEach((section) => {
				if (section) observer.unobserve(section);
			});
		};
	}, []);

	const setActiveLink: MouseEventHandler<HTMLAnchorElement> = (e) => {
		const navLinks = document.querySelectorAll('nav a');
		navLinks.forEach((link) => link.setAttribute('data-active', 'false'));
		e.currentTarget!.setAttribute('data-active', 'true');
	};

	return (
		<div className="relative min-h-screen bg-repeat font-sans text-foreground">
			<main className="mx-auto grid max-w-5xl gap-6 px-4 py-24 lg:grid-cols-[auto_1fr] lg:py-0">
				<aside className="">
					<div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:py-20">
						<h1 className="text-5xl font-bold tracking-tighter">Adam Grady</h1>
						<p className="mt-2 text-lg">Senior Software Engineer</p>
						<p className="mt-4 text-lg text-muted-foreground">
							Building elegant and performant solutions.
						</p>
						{/* TODO: Socials */}
						<nav className="mt-10 hidden lg:block lg:grow">
							<ul>
								{navLinks.map((link, i) => (
									<li key={link.href}>
										<a
											href={link.href}
											className="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:font-bold hover:text-primary data-[active=true]:font-bold data-[active=true]:text-primary"
											data-active={i === 0}
											onClick={setActiveLink}
										>
											<div className="h-[1px] w-6 bg-current transition-all group-hover:w-10 group-[&[data-active=true]]:w-10"></div>
											{link.label}
										</a>
									</li>
								))}
							</ul>
						</nav>
						<ul className="mt-6 flex items-center gap-4">
							<li>
								<a
									href="https://github.com/BlueFrog130"
									className="text-foreground transition-colors hover:text-primary"
								>
									<span className="sr-only">GitHub</span>
									<svg
										className="h-6 w-6 fill-current"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<title>GitHub</title>
										<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
									</svg>
								</a>
							</li>
							<li>
								<a
									href="https://www.linkedin.com/in/adam-grady/"
									className="text-foreground transition-colors hover:text-primary"
								>
									<span className="sr-only">LinkedIn</span>
									<svg
										className="h-6 w-6 fill-current"
										viewBox="0 0 28 28"
										xmlns="http://www.w3.org/2000/svg"
									>
										<title>LinkedIn logo</title>
										<path d="m25.9 0h-23.8c-1.2 0-2.1 0.9-2.1 2v24c0 1.1 0.9 2 2.1 2h23.9c1.1 0 2.1-0.9 2.1-2v-24c-0.1-1.1-1-2-2.2-2zm-17.6 23.9h-4.1v-13.4h4.2v13.4zm-2.1-15.2c-1.3 0-2.4-1.1-2.4-2.4s1.1-2.4 2.4-2.4 2.4 1.1 2.4 2.4-1 2.4-2.4 2.4zm17.7 15.2h-4.1v-6.5c0-1.5 0-3.5-2.2-3.5s-2.5 1.7-2.5 3.4v6.6h-4.1v-13.4h4v1.8h0.1c0.6-1 1.9-2.2 3.9-2.2 4.2 0 5 2.8 5 6.4v7.4z" />
									</svg>
								</a>
							</li>
						</ul>
					</div>
				</aside>
				<div className="space-y-8 pt-24 lg:py-20">
					<section
						ref={(e) => {
							if (!e) return;
							sections.current[0] = e;
						}}
						id="about"
						className="scroll-m-20 space-y-4 leading-relaxed text-muted-foreground"
					>
						<h2 className="mb-6 font-bold tracking-tight uppercase">About</h2>
						<p>
							I&apos;m a Senior Software Engineer who loves turning complex domain problems into
							elegant, resilient, and accessible web experiences. I thrive at the intersection of
							product thinking, modern full‑stack engineering, and systems awareness—shaping
							codebases that are a joy to extend while delivering measurable impact for users and
							stakeholders.
						</p>
						<p>
							Since 2019 at{' '}
							<ExternalLink href="https://solarityhealth.com/">Solarity Health</ExternalLink>{' '}
							I&apos;ve grown from an intern writing early production features to leading
							modernization efforts—driving the adoption of TypeScript, React, and contemporary
							engineering standards. I build and review code across the stack (JS/TS, React, C#,
							SQL, CSS) and helped create internal tooling that streamlines configuration of billing
							and operational systems, improving productivity and reliability. Mentorship, code
							quality, and calm incremental change are core to how I work.
						</p>
						<p>
							As founder of{' '}
							<ExternalLink href="https://gradydevelopment.com/">Grady Development</ExternalLink> I
							deliver pragmatic software for small businesses:{' '}
							<ExternalLink href="https://dukestreetvermillion.com/">
								a high‑visibility rental property platform that improved search ranking and
								occupancy
							</ExternalLink>
							; <ExternalLink href="https://wmammogram.com/">wMammogram</ExternalLink>—an increased
							screening uptake; and cloud‑deployed solutions spanning AWS, Azure, Google Cloud, and
							Cloudflare. I lean on containerization, microservice boundaries where they add
							clarity, disciplined CI/CD, and performance-aware architecture.
						</p>
						<p>
							In academia I built CodingStub, a containerized, microservice based coding practice
							environment as a Graduate Assistant while teaching and mentoring students.{' '}
							<ExternalLink href="https://ieeexplore.ieee.org/document/9249222">
								My research on Software‑Defined Networking performance and security in cloud
								environments
							</ExternalLink>{' '}
							was presented at the IETC Conference and the USD Research Fair. I enjoy bridging
							low‑level understanding (Rust, C, C++) with product delivery, and I care deeply about
							accessibility, clarity, and craftsmanship. I&apos;m energized by opportunities to
							modernize platforms, elevate developer experience, and build software that genuinely
							helps people.
						</p>
						<p>
							When I am not busy coding, you can find me spending time with my two bunnies, my wife,
							or exploring the outdoors.
						</p>
					</section>

					<section
						ref={(e) => {
							if (!e) return;
							sections.current[1] = e;
						}}
						id="experience"
						className="scroll-m-20 space-y-4 leading-relaxed text-muted-foreground"
					>
						<h2 className="mb-6 font-bold tracking-tight uppercase">Experience</h2>
						<Card.Ctx className="grid gap-6">
							{experience.map((item, idx) => (
								<Card.Card key={idx}>
									<Card.Content className="flex flex-col">
										<h3>
											{item.link ? (
												<a
													href={item.link}
													className="transition-colors hover:text-primary"
													target="_blank"
													rel="noopener noreferrer"
												>
													{item.role} @ {item.company}
												</a>
											) : (
												<>
													{item.role} @ {item.company}
												</>
											)}
										</h3>
										<p className="text-sm text-muted-foreground">
											{item.start} - {item.end} &middot; {item.location}
										</p>
										{/* Bullets */}
										<ul className="col-span-2 mt-2 list-outside list-disc space-y-1 pl-5 text-muted-foreground">
											{item.bullets.map((bullet, bidx) => (
												<li key={bidx}>{bullet}</li>
											))}
										</ul>
									</Card.Content>
								</Card.Card>
							))}
						</Card.Ctx>
					</section>
				</div>
			</main>
		</div>
	);
}
