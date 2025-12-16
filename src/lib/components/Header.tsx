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
	const isClient = useIsClient();

	const closeMenu = useCallback(() => {
		setMobileMenuOpen(false);
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
		<header className="sticky top-0 z-30 w-full border-b border-surface-200 bg-surface-50/80 backdrop-blur-sm">
			<nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
				<Link
					to="/"
					className="text-lg font-semibold text-surface-900 hover:text-accent-600 hover:scale-105"
					aria-label="Home"
				>
					AG
				</Link>

				{/* Desktop Navigation */}
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
					<Tooltip content="GitHub">
						<a
							href={links.github}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex text-surface-600 hover:text-accent-600 hover:scale-110"
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
							className="inline-flex text-surface-600 hover:text-accent-600 hover:scale-110"
							aria-label="LinkedIn Profile"
						>
							<LinkedInIcon className="h-5 w-5" />
						</a>
					</Tooltip>

					{/* Mobile Menu Button */}
					<button
						type="button"
						className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-surface-700 sm:hidden"
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
								'fixed inset-0 z-40 bg-surface-900/20 backdrop-blur-sm transition-opacity duration-300',
								mobileMenuOpen ? 'opacity-100' : 'opacity-0',
							)}
							onClick={closeMenu}
							aria-hidden="true"
						/>

						{/* Panel */}
						<div
							className={clsx(
								'fixed inset-y-0 right-0 z-50 w-full max-w-xs transform bg-surface-50 px-6 py-6 shadow-xl transition-transform duration-300 ease-in-out',
								mobileMenuOpen ? 'translate-x-0' : 'translate-x-full',
							)}
						>
							<div className="flex items-center justify-between">
								<Link
									to="/"
									className="text-lg font-semibold text-surface-900"
									onClick={closeMenu}
								>
									AG
								</Link>
								<button
									type="button"
									className="-m-2.5 rounded-md p-2.5 text-surface-700"
									onClick={closeMenu}
									aria-label="Close menu"
								>
									<X className="h-6 w-6" />
								</button>
							</div>
							<nav className="mt-6 flow-root">
								<ul className="-my-2 divide-y divide-surface-200" role="list">
									{navItems.map((item) => (
										<li key={item.href}>
											<Link
												to={item.href}
												className="block py-3 text-base font-medium text-surface-900 hover:text-accent-600"
												onClick={closeMenu}
											>
												{item.label}
											</Link>
										</li>
									))}
								</ul>
								<div className="mt-6 flex items-center gap-4 border-t border-surface-200 pt-6">
									<a
										href={links.github}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-2 text-surface-600 hover:text-accent-600"
										aria-label="GitHub Profile"
									>
										<GitHubIcon className="h-5 w-5" />
										<span className="text-sm font-medium">GitHub</span>
									</a>
									<a
										href={links.linkedin}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-2 text-surface-600 hover:text-accent-600"
										aria-label="LinkedIn Profile"
									>
										<LinkedInIcon className="h-5 w-5" />
										<span className="text-sm font-medium">LinkedIn</span>
									</a>
								</div>
							</nav>
						</div>
					</div>,
					document.body,
				)}
		</header>
	);
}
