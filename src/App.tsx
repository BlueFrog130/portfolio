import { RouterProvider, Router } from '@/lib/router';
import { routes } from './routes';

interface AppProps {
	initialPath?: string;
}

export function App({ initialPath }: AppProps) {
	return (
		<RouterProvider initialPath={initialPath} routes={routes}>
			<Router />
		</RouterProvider>
	);
}
