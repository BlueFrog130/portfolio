import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const nunito = localFont({
	src: [
		{
			path: './fonts/nunito/Nunito-Italic-VariableFont_wght.ttf',
			weight: '100 900',
			style: 'italic'
		},
		{
			path: './fonts/nunito/Nunito-VariableFont_wght.ttf',
			weight: '100 900',
			style: 'normal'
		}
	],
	variable: '--font-nunito',
	display: 'swap',
	fallback: ['ui-sans-serif', 'system-ui', 'sans-serif']
});

export const metadata: Metadata = {
	title: 'Adam Grady',
	description:
		'Adam Grady is a Senior Software Engineer who builds elegant and performant solutions.'
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="scroll-smooth">
			<body className={`dark antialiased ${nunito.variable}`}>{children}</body>
		</html>
	);
}
