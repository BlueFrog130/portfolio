'use client';

export function Intersection({ gridPattern, bgSize }: { gridPattern: string; bgSize: number }) {
	const styleUpdater = (node: HTMLDivElement | null) => {
		if (!node) return;
		const onMouseMove = (e: MouseEvent) => {
			node.style.setProperty('--mouse-x', `${e.pageX}px`);
			node.style.setProperty('--mouse-y', `${e.pageY}px`);
		};

		window.addEventListener('mousemove', onMouseMove);

		return () => {
			window.removeEventListener('mousemove', onMouseMove);
		};
	};

	return (
		<div
			ref={styleUpdater}
			className="pointer-events-none absolute inset-0 bg-no-repeat"
			style={{
				backgroundImage: gridPattern,
				backgroundSize: `${bgSize}px ${bgSize}px`,
				background: `
          radial-gradient(ellipse 40vw 100vh at var(--mouse-x) 50vh, var(--color-primary) 0%, transparent 80%),
          radial-gradient(ellipse 100vw 40vh at 50vw var(--mouse-y), var(--color-primary) 0%, transparent 80%)
        `
			}}
		></div>
	);
}
