import { Layout } from '@/components/Layout';
import {
	Hero,
	Experience,
	Projects,
	Skills,
	Education,
	Contact,
} from '@/components/sections';

export default function Home() {
	return (
		<Layout>
			<Hero />
			<Experience />
			<Projects />
			<Skills />
			<Education />
			<Contact />
		</Layout>
	);
}
