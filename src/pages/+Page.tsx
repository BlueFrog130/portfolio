import { Layout } from '@/components/Layout';
import { Hero, Experience, Projects, Skills, Education, Contact } from '.';

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
