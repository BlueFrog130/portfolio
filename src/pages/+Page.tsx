import { Layout } from '@/lib/components/Layout';
import { Hero, Experience, Projects, Blog, Skills, Education, Contact } from '.';

export default function Home() {
	return (
		<Layout>
			<Hero />
			<Experience />
			<Projects />
			<Blog />
			<Skills />
			<Education />
			<Contact />
		</Layout>
	);
}
