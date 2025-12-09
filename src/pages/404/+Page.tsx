import { Layout } from '@/lib/components/Layout';
import { Link } from '@/lib/router';

export default function NotFound() {
	return (
		<Layout>
			<section className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
				<h1 className="text-6xl font-bold text-accent-600">404</h1>
				<h2 className="mt-4 text-2xl font-semibold text-surface-900">
					Page Not Found
				</h2>
				<p className="mt-2 text-surface-600">
					The page you're looking for doesn't exist or has been moved.
				</p>
				<Link
					to="/"
					className="mt-8 inline-flex items-center justify-center rounded-lg bg-accent-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-accent-700 focus-visible:outline-accent-600"
				>
					Go back home
				</Link>
			</section>
		</Layout>
	);
}
