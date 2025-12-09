import { Link } from '@/lib/router';
import { links } from '@/lib/data';
import { ModeSwitcher } from './ModeSwitcher';
import { GitHubIcon, LinkedInIcon } from './icons';

const navItems = [
	{ href: '/#experience', label: 'Experience' },
	{ href: '/#projects', label: 'Projects' },
	{ href: '/#skills', label: 'Skills' },
	{ href: '/#education', label: 'Education' },
	{ href: '/#contact', label: 'Contact' },
];

export function Header() {
	return (
		<header className="sticky top-0 z-30 w-full border-b border-surface-200 bg-surface-50/80 backdrop-blur-sm">
			<nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
				<Link
					to="/"
					className="text-lg font-semibold text-surface-900 hover:text-accent-600 hover:scale-105"
					aria-label="Home"
				>
					AG
				</Link>

				<ul className="hidden items-center gap-6 sm:flex" role="list">
					{navItems.map((item) => (
						<li key={item.href}>
							<Link
								to={item.href}
								className="text-sm font-medium text-surface-600 hover:text-accent-600 hover:-translate-y-0.5"
							>
								{item.label}
							</Link>
						</li>
					))}
				</ul>

				<div className="flex items-center gap-4">
					<ModeSwitcher />
					<div className="hidden h-6 w-px bg-surface-200 sm:block" />
					<a
						href={links.github}
						target="_blank"
						rel="noopener noreferrer"
						className="text-surface-600 hover:text-accent-600 hover:scale-110"
						aria-label="GitHub Profile"
					>
						<GitHubIcon className="h-5 w-5" />
					</a>
					<a
						href={links.linkedin}
						target="_blank"
						rel="noopener noreferrer"
						className="text-surface-600 hover:text-accent-600 hover:scale-110"
						aria-label="LinkedIn Profile"
					>
						<LinkedInIcon className="h-5 w-5" />
					</a>
				</div>
			</nav>
		</header>
	);
}
