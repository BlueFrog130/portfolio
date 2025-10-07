import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function svg(strings: TemplateStringsArray, ...values: string[]) {
	let str = strings[0];
	values.forEach((value, i) => {
		str += value + strings[i + 1];
	});
	return str.replace(/\n+/g, '').trim();
}
