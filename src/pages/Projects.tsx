import { getFeaturedProjects, Project } from '@/content/projects';
import { Link } from '@/lib/router';
import {
	startTransition,
	useCallback,
	useEffect,
	useRef,
	useState,
	ViewTransition,
} from 'react';
import {
	ArrowRight,
	X,
	Send,
	Loader2,
	MessageCircle,
	RotateCcw,
	ArrowUpRight,
} from 'lucide-react';
import { GitHubIcon } from '@/lib/components/icons';
import { Tooltip } from '@/lib/components/Tooltip';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import { useProjectChat } from '@/lib/chat';
import { useChatAnalytics } from '@/lib/chat/analytics';
import Markdown from 'react-markdown';
import { Button, GradientCard, SectionNumber, Tag } from '@/lib/components/ui';
import {
	ExternalLinkIcon,
	FolderIcon,
	SparklesIcon,
} from '@/lib/components/ui/icon';

export function Projects() {
	const featuredProjects = getFeaturedProjects();

	const [clickedProject, setClickedProject] = useState<Project | null>(null);
	const [openProject, setOpenProject] = useState<Project | null>(null);

	return (
		<>
			{openProject &&
				createPortal(
					<ProjectDialog
						project={openProject}
						onClose={() => {
							setClickedProject(null);
							startTransition(() => {
								setOpenProject(null);
							});
						}}
					/>,
					document.body,
				)}
			<section
				id="projects"
				className="relative py-24 sm:py-32"
				aria-labelledby="projects-heading"
			>
				{/* Background accents */}
				<div className="absolute inset-0 -z-10">
					<div className="absolute -left-40 top-1/3 h-125 w-125 rounded-full bg-accent-500/5 blur-3xl" />
					<div className="absolute right-0 bottom-0 h-75 w-75 rounded-full bg-accent-600/5 blur-3xl" />
				</div>

				<div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
					{/* Section header */}
					<div className="flex items-end gap-6 mb-16">
						<SectionNumber number={2} />
						<div className="flex-1">
							<h2
								id="projects-heading"
								className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-surface-100"
							>
								Featured Projects
							</h2>
							<p className="mt-2 text-surface-400">
								A selection of projects I've built and contributed to
							</p>
						</div>
					</div>

					{/* Bento grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
						{featuredProjects.map((project, index) => {
							const isOpen = openProject?.slug === project.slug;

							// When dialog is open, render an invisible placeholder to prevent layout shift
							if (isOpen) {
								return (
									<div
										key={project.slug}
										className={clsx(
											'invisible',
											index === 0 && 'md:col-span-2 lg:col-span-2',
										)}
										aria-hidden="true"
									>
										<ProjectCard
											project={project}
											index={index}
											skipGridClasses
										/>
									</div>
								);
							}

							return (
								<ViewTransition
									name={`project-${project.slug}`}
									key={project.slug}
								>
									<ProjectCard
										project={project}
										index={index}
										isClicked={clickedProject?.slug === project.slug}
										onOpenChat={() => {
											setClickedProject(project);
											startTransition(() => {
												setOpenProject(project);
											});
										}}
									/>
								</ViewTransition>
							);
						})}
					</div>

					{/* Mobile view all link */}
					<div className="mt-8 text-center sm:hidden">
						<Link
							to="/projects"
							className="inline-flex items-center gap-2 text-sm font-medium text-accent-400 hover:text-accent-300"
						>
							View all projects
							<ArrowRight className="h-4 w-4" />
						</Link>
					</div>
				</div>
			</section>
		</>
	);
}

type ProjectCardProps = {
	project: Project;
	index: number;
	isClicked?: boolean;
	onOpenChat?: () => void;
	/** Skip grid positioning classes (for placeholder) */
	skipGridClasses?: boolean;
};

function ProjectCard({
	project,
	index,
	isClicked,
	onOpenChat,
	skipGridClasses,
}: ProjectCardProps) {
	return (
		<GradientCard
			as="article"
			className={clsx(
				// First project spans 2 columns on larger screens
				!skipGridClasses && index === 0 && 'md:col-span-2 lg:col-span-2',
				isClicked && 'z-50',
			)}
			contentClassName="p-6 flex flex-col"
			style={{ animationDelay: `${index * 0.1}s` }}
		>
			{/* Header row */}
			<div className="flex items-start justify-between gap-4">
				<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-500/10 border border-accent-500/20 group-hover:bg-accent-500/20 transition-colors">
					<FolderIcon className="h-5 w-5 group-hover:[--active:1] transition-transform duration-200 ease-out group-hover:-translate-y-0.5" />
				</div>

				<div className="flex items-center gap-2">
					{project.github && (
						<Button
							as="a"
							href={project.github}
							target="_blank"
							rel="noopener noreferrer"
							variant="ghost"
							className="p-2 rounded-lg"
							aria-label={`View ${project.title} on GitHub`}
						>
							<GitHubIcon className="h-5 w-5" />
						</Button>
					)}
					<Tooltip content="Ask AI about this project">
						<Button
							variant="ghost"
							className="group/ai p-2 rounded-lg text-accent-400"
							aria-label={`Open ${project.title} details`}
							onClick={onOpenChat}
						>
							<SparklesIcon className="h-5 w-5 group-hover/ai:[--active:1]" />
						</Button>
					</Tooltip>
				</div>
			</div>

			{/* Content */}
			<div className="mt-5 flex-1">
				<h3 className="font-display text-xl font-semibold text-surface-100 group-hover:text-accent-400 transition-colors">
					<Link
						to={`/project/${project.slug}`}
						className="focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded"
					>
						{project.title}
					</Link>
				</h3>
				<p className="mt-2 text-sm text-surface-400 leading-relaxed line-clamp-3">
					{project.description}
				</p>
			</div>

			{/* Technologies */}
			<div className="mt-5 flex flex-wrap gap-2">
				{project.technologies.slice(0, 4).map((tech) => (
					<Tag key={tech}>{tech}</Tag>
				))}
				{project.technologies.length > 4 && (
					<Tag>+{project.technologies.length - 4}</Tag>
				)}
			</div>

			{/* Footer */}
			<div className="mt-5 pt-5 border-t border-surface-800 flex items-center justify-between">
				<Link
					to={`/project/${project.slug}`}
					className="inline-flex items-center gap-2 text-sm font-medium text-accent-400 hover:text-accent-300 group/link"
				>
					View project
					<ArrowUpRight className="h-4 w-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
				</Link>

				{project.readTime && (
					<span className="text-xs text-surface-500">
						{project.readTime} min read
					</span>
				)}
			</div>
		</GradientCard>
	);
}

type ProjectDialogProps = {
	project: Project;
	onClose?: () => void;
};

function ProjectDialog({ project, onClose }: ProjectDialogProps) {
	const { trackChatOpened, trackChatClosed } = useChatAnalytics({
		projectSlug: project.slug,
	});
	const messageCountRef = useRef(0);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		// Set mounted after animation plays
		setTimeout(() => {
			setMounted(true);
		}, 250);
	}, []);

	useEffect(() => {
		trackChatOpened();
		document.documentElement.style.overflow = 'hidden';
		return () => {
			document.documentElement.style.overflow = '';
		};
	}, [trackChatOpened]);

	const handleClose = useCallback(() => {
		trackChatClosed(messageCountRef.current);
		onClose?.();
	}, [onClose, trackChatClosed]);

	const handleMessageCountChange = useCallback((count: number) => {
		messageCountRef.current = count;
	}, []);

	const outClickRef = useCallback(
		(node: HTMLDivElement | null) => {
			if (!node) return;

			function handleClick(event: MouseEvent) {
				if (
					node &&
					(event.target as HTMLElement)?.isConnected &&
					!node.contains(event.target as Node)
				) {
					handleClose();
				}
			}

			document.addEventListener('click', handleClick);

			return () => {
				document.removeEventListener('click', handleClick);
			};
		},
		[handleClose],
	);

	return (
		<div className="fixed inset-0 flex justify-center items-center z-40 p-4">
			{/* Backdrop - fades in via @starting-style */}
			<div
				data-opened={mounted ? '1' : '0'}
				className="absolute inset-0 transition-opacity duration-300 opacity-0 data-[opened='1']:opacity-100 backdrop-blur-sm"
			/>

			<ViewTransition name={`project-${project.slug}`}>
				<article
					ref={outClickRef}
					className="@container relative group flex flex-col rounded-2xl border border-surface-800 bg-surface-900 p-6 lg:p-8 max-w-[95vw] lg:max-w-4xl w-full z-50 max-h-[90vh] overflow-y-auto @3xl:overflow-hidden shadow-2xl"
				>
					<div className="flex flex-col @3xl:grid @3xl:grid-cols-12 gap-6 @3xl:gap-8">
						{/* Project info column */}
						<div className="@3xl:col-span-5">
							<div className="flex items-start gap-4">
								<div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent-500/10 border border-accent-500/20">
									<FolderIcon className="h-5 w-5 [--active:1]" />
								</div>
								<div className="flex-1 min-w-0 pt-1">
									<h3 className="font-display text-xl font-semibold text-surface-100">
										{project.title}
									</h3>
									<div className="mt-2 flex items-center gap-3">
										{project.github && (
											<a
												href={project.github}
												target="_blank"
												rel="noopener noreferrer"
												className="text-surface-300 hover:text-accent-400 hover:bg-surface-800/50 p-1.5 rounded-lg transition-all duration-300"
												aria-label={`View ${project.title} on GitHub`}
											>
												<GitHubIcon className="h-4 w-4" />
											</a>
										)}
										{project.link && (
											<a
												href={project.link}
												target="_blank"
												rel="noopener noreferrer"
												className="group/link text-surface-300 hover:text-accent-400 hover:bg-surface-800/50 p-1.5 rounded-lg transition-all duration-300"
												aria-label={`Visit ${project.title}`}
											>
												<ExternalLinkIcon className="h-4 w-4 group-hover/link:[--active:1]" />
											</a>
										)}
									</div>
								</div>
							</div>

							<p className="mt-5 text-sm text-surface-400 leading-relaxed">
								{project.description}
							</p>

							<div className="mt-5 flex flex-wrap gap-2">
								{project.technologies.map((tech) => (
									<span key={tech} className="tag tag-accent">
										{tech}
									</span>
								))}
							</div>

							<div className="mt-6">
								<Link
									to={`/project/${project.slug}`}
									className="inline-flex items-center gap-2 text-sm font-medium text-accent-400 hover:text-accent-300 group/link"
									onClick={handleClose}
								>
									View project
									<ArrowUpRight className="h-4 w-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
								</Link>
							</div>
						</div>

						{/* Chat column */}
						<div className="@3xl:col-span-7 @3xl:pl-8 @3xl:border-l @3xl:border-surface-800">
							<ProjectChat
								project={project}
								onMessageCountChange={handleMessageCountChange}
								onClose={handleClose}
							/>
						</div>
					</div>
				</article>
			</ViewTransition>
		</div>
	);
}

function getStarterQuestions(project: Project): string[] {
	const questions = [
		`What technologies did you use to build ${project.title}?`,
		`What was the most challenging part of ${project.title}?`,
		`How does ${project.title} work?`,
	];

	if (project.github) {
		questions.push(`Can you walk me through the architecture?`);
	}

	return questions.slice(0, 3);
}

type ProjectChatProps = {
	project: Project;
	onMessageCountChange?: (count: number) => void;
	onClose?: () => void;
};

function ProjectChat({
	project,
	onMessageCountChange,
	onClose,
}: ProjectChatProps) {
	const {
		trackMessageSent,
		trackStarterQuestionClicked,
		trackChatCleared,
		trackStreamCompleted,
		trackStreamErrored,
	} = useChatAnalytics({ projectSlug: project.slug });

	const { messages, sendMessage, isLoading, error, clearMessages } =
		useProjectChat({
			slug: project.slug,
			onStreamCompleted: trackStreamCompleted,
			onStreamErrored: trackStreamErrored,
			onClear: trackChatCleared,
		});
	const [input, setInput] = useState('');
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, [messages, scrollToBottom]);

	useEffect(() => {
		onMessageCountChange?.(messages.length);
	}, [messages.length, onMessageCountChange]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim() || isLoading) return;

		const userMessageCount = messages.filter((m) => m.role === 'user').length;
		trackMessageSent(input.trim().length, false, userMessageCount);

		sendMessage(input);
		setInput('');
	};

	const handleStarterQuestion = (question: string, index: number) => {
		if (isLoading) return;

		trackStarterQuestionClicked(index, question);
		trackMessageSent(question.length, true, 0);

		sendMessage(question);
	};

	const starterQuestions = getStarterQuestions(project);

	return (
		<div className="flex flex-col h-full min-h-87.5 @3xl:min-h-100">
			{/* Header */}
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-3">
					<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500/10 border border-accent-500/20">
						<MessageCircle className="h-4 w-4 text-accent-400" />
					</div>
					<div>
						<h4 className="font-display font-semibold text-surface-100">
							Ask about this project
						</h4>
						<p className="text-xs text-surface-500">Powered by AI</p>
					</div>
				</div>
				<div className="flex items-center gap-1">
					{messages.length > 0 && (
						<button
							onClick={clearMessages}
							className="text-surface-300 hover:text-accent-400 hover:bg-surface-800/50 p-2 rounded-lg transition-all duration-300"
							aria-label="Clear chat"
							title="Clear chat"
						>
							<RotateCcw className="h-4 w-4" />
						</button>
					)}
					{onClose && (
						<button
							onClick={onClose}
							className="text-surface-300 hover:text-accent-400 hover:bg-surface-800/50 p-2 rounded-lg transition-all duration-300"
							aria-label="Close dialog"
							title="Close"
						>
							<X className="h-4 w-4" />
						</button>
					)}
				</div>
			</div>

			{/* Messages */}
			<div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2 @3xl:max-h-70">
				{messages.length === 0 ? (
					<div className="space-y-2">
						<p className="text-sm text-surface-500 mb-3">
							Try one of these questions:
						</p>
						{starterQuestions.map((question, idx) => (
							<button
								key={idx}
								onClick={() => handleStarterQuestion(question, idx)}
								disabled={isLoading}
								className="block w-full text-left text-sm px-4 py-3 rounded-xl bg-surface-800/50 hover:bg-surface-800 border border-surface-700/50 hover:border-surface-700 text-surface-300 transition-all disabled:opacity-50"
							>
								{question}
							</button>
						))}
					</div>
				) : (
					messages.map((msg, idx) => (
						<div
							key={idx}
							className={clsx(
								'text-sm px-4 py-3 rounded-xl w-fit max-w-[85%]',
								'prose-sm prose-headings:font-display prose-headings:text-surface-100',
								'prose-h1:text-lg prose-h2:text-base prose-h3:text-sm',
								'prose-p:my-1 prose-ul:my-1 prose-ul:list-inside prose-ul:list-disc prose-ul:pl-2',
								'prose-ol:my-1 prose-ol:list-inside prose-ol:list-decimal prose-ol:pl-2',
								msg.role === 'user'
									? 'bg-accent-500 text-surface-950 ml-auto font-medium'
									: 'bg-surface-800 text-surface-300 border border-surface-700',
							)}
						>
							{msg.role === 'assistant' ? (
								<Markdown>{msg.content}</Markdown>
							) : (
								msg.content || (
									<span className="inline-flex items-center gap-2">
										<Loader2 className="h-3 w-3 animate-spin" />
										Thinking...
									</span>
								)
							)}
						</div>
					))
				)}
				<div ref={messagesEndRef} />
			</div>

			{error && (
				<p className="text-sm text-red-400 mb-3 px-1">Error: {error}</p>
			)}

			{/* Input */}
			<form onSubmit={handleSubmit} className="flex gap-3">
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Ask a question..."
					disabled={isLoading}
					className="flex-1 px-4 py-3 text-sm rounded-xl bg-surface-800 border border-surface-700 text-surface-100 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50 disabled:opacity-50"
				/>
				<button
					type="submit"
					disabled={isLoading || !input.trim()}
					className="btn btn-primary px-4"
					aria-label="Send message"
				>
					{isLoading ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<Send className="h-4 w-4" />
					)}
				</button>
			</form>
		</div>
	);
}
