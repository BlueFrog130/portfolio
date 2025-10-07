import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import React from 'react';

interface ResumeSectionProps {
	title: string;
	children: React.ReactNode;
}

export function ResumeSection({ title, children }: ResumeSectionProps) {
	return (
		<section className="mb-8">
			<Card className="shadow-lg">
				<CardHeader>
					<CardTitle className="mb-2 text-2xl font-bold text-primary">{title}</CardTitle>
					<Separator className="mb-4" />
				</CardHeader>
				<CardContent className="space-y-2">{children}</CardContent>
			</Card>
		</section>
	);
}
