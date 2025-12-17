import { RouterProvider, Router } from '@/lib/router';
import { AnalyticsProvider } from '@/lib/analytics';
import { routes } from './routes';

interface AppProps {
	initialPath?: string;
}

export function App({ initialPath }: AppProps) {
	return (
		<AnalyticsProvider>
			<RouterProvider initialPath={initialPath} routes={routes}>
				<Router />
			</RouterProvider>
		</AnalyticsProvider>
	);
}
