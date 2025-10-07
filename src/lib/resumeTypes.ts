export interface Experience {
	company: string;
	title: string;
	start: string;
	end?: string;
	description: string;
}

export interface Education {
	school: string;
	degree: string;
	start: string;
	end?: string;
}

export interface Skill {
	name: string;
	level?: string;
}

export interface Publication {
	title: string;
	publisher: string;
	year: string;
}

export interface ResumeData {
	name: string;
	title: string;
	summary: string;
	location: string;
	email: string;
	website?: string;
	phone?: string;
	github?: string;
	linkedin?: string;
	experiences: Experience[];
	education: Education[];
	skills: Skill[];
	publications?: Publication[];
}
