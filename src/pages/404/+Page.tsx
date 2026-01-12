import { Layout } from '@/lib/components/Layout';
import { Link } from '@/lib/router';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/lib/components/ui';

export default function NotFound() {
	return (
		<Layout>
			<section className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
				{/* Background glow */}
				<div className="absolute inset-0 -z-10 overflow-hidden">
					<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-accent-500/10 blur-3xl" />
				</div>

				{/* 404 number */}
				<span className="font-display text-[10rem] sm:text-[14rem] font-black leading-none text-surface-800/30 select-none">
					404
				</span>

				{/* Content */}
				<div className="relative -mt-12">
					<h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-surface-100">
						Page Not Found
					</h1>
					<p className="mt-4 text-lg text-surface-400 max-w-md">
						The page you're looking for doesn't exist or has been moved to
						another location.
					</p>

					{/* Actions */}
					<div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
						<Button as="a" href="/" variant="primary">
							<Home className="h-4 w-4" />
							Go back home
						</Button>
						<Button onClick={() => window.history.back()} variant="secondary">
							<ArrowLeft className="h-4 w-4" />
							Go back
						</Button>
					</div>
				</div>
			</section>
		</Layout>
	);
}
