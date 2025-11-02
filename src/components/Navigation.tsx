import { Link } from '@/lib/router';

export function Navigation() {
	return (
		<nav className="fixed top-4 right-4 z-50">
			<div className="rounded-lg border bg-background/80 p-2 shadow-lg backdrop-blur-sm">
				<div className="flex flex-col gap-1">
					<Link to="/" className="rounded px-3 py-1 text-sm transition-colors hover:bg-muted">
						Home
					</Link>
					<Link to="/about" className="rounded px-3 py-1 text-sm transition-colors hover:bg-muted">
						About
					</Link>
					<Link
						to="/projects"
						className="rounded px-3 py-1 text-sm transition-colors hover:bg-muted"
					>
						Projects
					</Link>
					<Link to="/demo" className="rounded px-3 py-1 text-sm transition-colors hover:bg-muted">
						Router Demo
					</Link>
				</div>
			</div>
		</nav>
	);
}
