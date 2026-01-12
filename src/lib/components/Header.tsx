import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { Link } from '@/lib/router';
import { links } from '@/lib/data';
import { ModeSwitcher } from './ModeSwitcher';
import { Tooltip } from './Tooltip';
import { GitHubIcon, LinkedInIcon } from './icons';
import { Menu, X } from 'lucide-react';

const emptySubscribe = () => () => {};
function useIsClient() {
	return useSyncExternalStore(
		emptySubscribe,
		() => true,
		() => false,
	);
}

const navItems = [
	{ href: '/#experience', label: 'Experience' },
	{ href: '/#projects', label: 'Projects' },
	{ href: '/#skills', label: 'Skills' },
	{ href: '/#education', label: 'Education' },
	{ href: '/#contact', label: 'Contact' },
	{ href: '/blog', label: 'Blog' },
];

export function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const isClient = useIsClient();

	const closeMenu = useCallback(() => {
		setMobileMenuOpen(false);
	}, []);

	// Track scroll position for header background
	useEffect(() => {
		function handleScroll() {
			setScrolled(window.scrollY > 50);
		}
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	// Close menu on escape key and prevent scrolling
	useEffect(() => {
		if (!mobileMenuOpen) return;

		function handleEscape(e: KeyboardEvent) {
			if (e.key === 'Escape') {
				closeMenu();
			}
		}

		// Prevent body scroll when menu is open
		const scrollY = window.scrollY;
		document.body.style.position = 'fixed';
		document.body.style.top = `-${scrollY}px`;
		document.body.style.left = '0';
		document.body.style.right = '0';
		document.body.style.overflow = 'hidden';

		document.addEventListener('keydown', handleEscape);

		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.body.style.position = '';
			document.body.style.top = '';
			document.body.style.left = '';
			document.body.style.right = '';
			document.body.style.overflow = '';
			window.scrollTo(0, scrollY);
		};
	}, [mobileMenuOpen, closeMenu]);

	return (
		<header
			className={clsx(
				'fixed top-0 z-30 w-full border-b transition-all duration-300',
				scrolled
					? 'bg-surface-950/80 backdrop-blur-xl border-surface-800/50'
					: 'bg-transparent border-transparent',
			)}
		>
			<nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-8 lg:px-12">
				{/* Logo */}
				<Link
					to="/"
					className="group relative font-display text-xl font-black text-surface-100 hover:text-accent-400"
					aria-label="Home"
				>
					<span className="relative z-10">AG</span>
					<span className="absolute inset-0 -z-10 scale-0 rounded-lg bg-accent-500/10 transition-transform duration-300 group-hover:scale-110" />
				</Link>

				{/* Desktop Navigation */}
				<ul className="hidden items-center gap-1 sm:flex" role="list">
					{navItems.map((item) => (
						<li key={item.href}>
							<Link
								to={item.href}
								className="relative px-4 py-2 text-sm font-medium text-surface-400 hover:text-surface-100 after:content-[''] after:absolute after:-bottom-0.5 after:left-0 after:w-0 after:h-0.5 after:bg-linear-to-r after:from-accent-500 after:to-accent-400 after:transition-[width] after:duration-300 after:ease-[cubic-bezier(0.16,1,0.3,1)] hover:after:w-full"
							>
								{item.label}
							</Link>
						</li>
					))}
				</ul>

				<div className="flex items-center gap-3">
					<ModeSwitcher />

					<div className="hidden h-5 w-px bg-surface-800 sm:block" />

					<div className="hidden sm:flex items-center gap-2">
						<Tooltip content="GitHub">
							<a
								href={links.github}
								target="_blank"
								rel="noopener noreferrer"
								className="text-surface-300 hover:text-accent-400 shrink-0 hover:bg-surface-800/50 p-2 rounded-lg transition-all duration-300"
								aria-label="GitHub Profile"
							>
								<GitHubIcon className="h-5 w-5" />
							</a>
						</Tooltip>
						<Tooltip content="LinkedIn">
							<a
								href={links.linkedin}
								target="_blank"
								rel="noopener noreferrer"
								className="text-surface-300 hover:text-accent-400 shrink-0 hover:bg-surface-800/50 p-2 rounded-lg transition-all duration-300"
								aria-label="LinkedIn Profile"
							>
								<LinkedInIcon className="h-5 w-5" />
							</a>
						</Tooltip>
					</div>

					{/* Mobile Menu Button */}
					<button
						type="button"
						className="text-surface-300 hover:text-accent-400 hover:bg-surface-800/50 p-2 rounded-lg transition-all duration-300 sm:hidden"
						onClick={() => setMobileMenuOpen(true)}
						aria-label="Open main menu"
					>
						<Menu className="h-6 w-6" />
					</button>
				</div>
			</nav>

			{/* Mobile Menu Portal */}
			{isClient &&
				createPortal(
					<div
						className={clsx(
							'sm:hidden',
							mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none',
						)}
						role="dialog"
						aria-modal="true"
						aria-label="Mobile navigation"
					>
						{/* Overlay */}
						<div
							className={clsx(
								'fixed inset-0 z-40 bg-surface-950/80 backdrop-blur-sm transition-opacity duration-300',
								mobileMenuOpen ? 'opacity-100' : 'opacity-0',
							)}
							onClick={closeMenu}
							aria-hidden="true"
						/>

						{/* Panel */}
						<div
							className={clsx(
								'fixed inset-y-0 right-0 z-50 w-full max-w-sm transform bg-surface-900 border-l border-surface-800 px-6 py-6 shadow-2xl transition-transform duration-300 ease-out',
								mobileMenuOpen ? 'translate-x-0' : 'translate-x-full',
							)}
						>
							<div className="flex items-center justify-between">
								<Link
									to="/"
									className="font-display text-xl font-black text-surface-100"
									onClick={closeMenu}
								>
									AG
								</Link>
								<button
									type="button"
									className="text-surface-300 hover:text-accent-400 hover:bg-surface-800/50 p-2 rounded-lg transition-all duration-300"
									onClick={closeMenu}
									aria-label="Close menu"
								>
									<X className="h-6 w-6" />
								</button>
							</div>

							<nav className="mt-8 flow-root">
								<ul className="space-y-1" role="list">
									{navItems.map((item, index) => (
										<li
											key={item.href}
											className="opacity-0 animate-slide-in-right"
											style={{ animationDelay: `${index * 0.05}s` }}
										>
											<Link
												to={item.href}
												className="block rounded-xl px-4 py-3 text-lg font-medium text-surface-300 hover:bg-surface-800 hover:text-accent-400"
												onClick={closeMenu}
											>
												{item.label}
											</Link>
										</li>
									))}
								</ul>

								<div className="mt-8 pt-8 border-t border-surface-800">
									<div className="flex items-center gap-4">
										<a
											href={links.github}
											target="_blank"
											rel="noopener noreferrer"
											className="text-surface-300 hover:text-accent-400 hover:bg-surface-800/50 flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
											aria-label="GitHub Profile"
										>
											<GitHubIcon className="h-5 w-5" />
											<span className="text-sm font-medium">GitHub</span>
										</a>
										<a
											href={links.linkedin}
											target="_blank"
											rel="noopener noreferrer"
											className="text-surface-300 hover:text-accent-400 hover:bg-surface-800/50 flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
											aria-label="LinkedIn Profile"
										>
											<LinkedInIcon className="h-5 w-5" />
											<span className="text-sm font-medium">LinkedIn</span>
										</a>
									</div>
								</div>
							</nav>
						</div>
					</div>,
					document.body,
				)}
		</header>
	);
}
