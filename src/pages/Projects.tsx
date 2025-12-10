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
	FolderOpen,
	ArrowRight,
	ExternalLink,
	Sparkles,
	X,
	Send,
	Loader2,
	MessageCircle,
	RotateCcw,
} from 'lucide-react';
import { GitHubIcon } from '@/lib/components/icons';
import { Tooltip } from '@/lib/components/Tooltip';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import { useProjectChat } from '@/lib/chat';
import { useChatAnalytics } from '@/lib/chat/analytics';
import Markdown from 'react-markdown';

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
						onClose={() =>
							startTransition(() => {
								setOpenProject(null);
							})
						}
					/>,
					document.body,
				)}
			<section
				id="projects"
				className="bg-surface-100/50 py-20 sm:py-24"
				aria-labelledby="projects-heading"
			>
				<div className="mx-auto max-w-5xl px-4 sm:px-6">
					<h2
						id="projects-heading"
						className="text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl"
					>
						Featured Projects
					</h2>
					<p className="mt-4 text-lg text-surface-600">
						A selection of projects I've built and contributed to.
					</p>
					<div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
						{featuredProjects
							.filter((p) => p.slug !== openProject?.slug)
							.map((project, index) => (
								<ViewTransition
									name={`project-${project.slug}`}
									key={project.slug}
								>
									<article
										className={clsx(
											'group flex flex-col rounded-xl border border-surface-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md',
											clickedProject?.slug === project.slug && 'z-50',
										)}
										style={{ animationDelay: `${index * 0.1}s` }}
									>
										<div className="flex items-start gap-2">
											<div className="grow">
												<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-100">
													<FolderOpen className="h-6 w-6 text-accent-600" />
												</div>
											</div>
											{project.github && (
												<a
													href={project.github}
													target="_blank"
													rel="noopener noreferrer"
													className="text-surface-400 hover:text-accent-600 hover:scale-110"
													aria-label={`View ${project.title} on GitHub`}
												>
													<GitHubIcon className="h-5 w-5" />
												</a>
											)}
											<Tooltip content="Ask AI about this project">
												<button
													className="text-surface-400 hover:text-accent-600 hover:scale-110 cursor-pointer"
													aria-label={`Open ${project.title} details`}
													onClick={() => {
														setClickedProject(project);
														startTransition(() => {
															setOpenProject(project);
														});
													}}
												>
													<Sparkles className="h-5 w-5" />
												</button>
											</Tooltip>
										</div>
										<h3 className="mt-4 text-lg font-semibold text-surface-900 group-hover:text-accent-600">
											<Link
												to={`/projects/${project.slug}`}
												className="hover:underline focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 rounded"
											>
												{project.title}
											</Link>
										</h3>
										<p className="mt-2 flex-1 text-sm text-surface-600">
											{project.description}
										</p>
										<div className="mt-4 flex flex-wrap gap-2">
											{project.technologies.slice(0, 4).map((tech) => (
												<span
													key={tech}
													className="inline-flex items-center rounded-full bg-surface-100 px-2.5 py-0.5 text-xs font-medium text-surface-600"
												>
													{tech}
												</span>
											))}
										</div>
										<div className="mt-4 flex items-center gap-4">
											<Link
												to={`/projects/${project.slug}`}
												className="group/link inline-flex items-center text-sm font-medium text-accent-600 hover:text-accent-700"
											>
												View Details
												<ArrowRight className="ml-1 h-4 w-4 group-hover/link:translate-x-1" />
											</Link>
											{project.link && (
												<a
													href={project.link}
													target="_blank"
													rel="noopener noreferrer"
													className="group/ext inline-flex items-center text-sm font-medium text-surface-500 hover:text-surface-700"
												>
													Live Site
													<ExternalLink className="ml-1 h-4 w-4 group-hover/ext:scale-110" />
												</a>
											)}
										</div>
									</article>
								</ViewTransition>
							))}
					</div>
				</div>
			</section>
		</>
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

	useEffect(() => {
		trackChatOpened();
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = '';
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
		<div className="fixed inset-0 flex justify-center items-center z-40">
			<ViewTransition name={`project-${project.slug}`}>
				<article
					ref={outClickRef}
					className="@container relative group flex flex-col rounded-xl border border-surface-200 bg-white p-6 max-w-[90vw] w-full z-50 max-h-[90vh] overflow-y-auto @3xl:overflow-hidden shadow-lg"
				>
					<button
						className="text-surface-400 hover:text-accent-600 hover:scale-110 absolute top-6 right-6"
						aria-label={`Close ${project.title} details`}
						onClick={handleClose}
					>
						<X className="h-5 w-5" />
					</button>
					<div className="flex flex-col @3xl:grid @3xl:grid-cols-12 gap-6">
						<div className="@3xl:col-span-4">
							<div className="flex items-start gap-2">
								<div className="grow">
									<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-100">
										<FolderOpen className="h-6 w-6 text-accent-600" />
									</div>
								</div>
								{project.github && (
									<a
										href={project.github}
										target="_blank"
										rel="noopener noreferrer"
										className="text-surface-400 hover:text-accent-600 hover:scale-110"
										aria-label={`View ${project.title} on GitHub`}
									>
										<GitHubIcon className="h-5 w-5" />
									</a>
								)}
							</div>
							<h3 className="mt-4 text-lg font-semibold text-surface-900 group-hover:text-accent-600">
								<Link
									to={`/projects/${project.slug}`}
									className="hover:underline focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 rounded"
								>
									{project.title}
								</Link>
							</h3>
							<p className="mt-2 flex-1 text-sm text-surface-600">
								{project.description}
							</p>
							<div className="mt-4 flex flex-wrap gap-2">
								{project.technologies.slice(0, 4).map((tech) => (
									<span
										key={tech}
										className="inline-flex items-center rounded-full bg-surface-100 px-2.5 py-0.5 text-xs font-medium text-surface-600"
									>
										{tech}
									</span>
								))}
							</div>
							<div className="mt-4 flex items-center gap-4">
								<Link
									to={`/projects/${project.slug}`}
									className="group/link inline-flex items-center text-sm font-medium text-accent-600 hover:text-accent-700"
								>
									View Details
									<ArrowRight className="ml-1 h-4 w-4 group-hover/link:translate-x-1" />
								</Link>
								{project.link && (
									<a
										href={project.link}
										target="_blank"
										rel="noopener noreferrer"
										className="group/ext inline-flex items-center text-sm font-medium text-surface-500 hover:text-surface-700"
									>
										Live Site
										<ExternalLink className="ml-1 h-4 w-4 group-hover/ext:scale-110" />
									</a>
								)}
							</div>
						</div>
						<div className="pt-6 border-t border-surface-200 @3xl:col-span-8 @3xl:pl-6 @3xl:border-l @3xl:border-t-0 @3xl:pt-6 @3xl:overflow-y-auto @3xl:max-h-[calc(90vh-5rem)]">
							<ProjectChat
								project={project}
								onMessageCountChange={handleMessageCountChange}
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
};

function ProjectChat({ project, onMessageCountChange }: ProjectChatProps) {
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
		<div className="flex flex-col min-h-[400px]">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<MessageCircle className="h-5 w-5 text-accent-600" />
					<h4 className="font-semibold text-surface-900">
						Ask me about this project
					</h4>
				</div>
				{messages.length > 0 && (
					<button
						onClick={clearMessages}
						className="text-surface-400 hover:text-surface-600 p-1 rounded"
						aria-label="Clear chat"
						title="Clear chat"
					>
						<RotateCcw className="h-4 w-4" />
					</button>
				)}
			</div>

			<div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
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
								className="block w-full text-left text-sm px-3 py-2 rounded-lg bg-surface-50 hover:bg-surface-100 text-surface-700 transition-colors disabled:opacity-50"
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
								'text-sm px-3 py-2 rounded-lg w-fit max-w-[85%] prose-sm prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-headings:font-semibold prose-headings:my-1 prose-p:my-1 prose-ul:my-1 prose-ul:list-inside prose-ul:list-disc prose-ul:pl-2 prose-ol:my-1 prose-ol:list-inside prose-ol:list-decimal prose-ol:pl-2',
								msg.role === 'user'
									? 'bg-accent-600 text-white ml-auto'
									: 'bg-surface-100 text-surface-800',
							)}
						>
							{msg.role === 'assistant' ? (
								<Markdown>{msg.content}</Markdown>
							) : (
								msg.content || (
									<span className="inline-flex items-center gap-1">
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

			{error && <p className="text-sm text-red-600 mb-2">Error: {error}</p>}

			<form onSubmit={handleSubmit} className="flex gap-2 pr-2 mb-2">
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Ask a question..."
					disabled={isLoading}
					className="flex-1 px-3 py-2 text-sm rounded-lg border border-surface-200 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent disabled:opacity-50"
				/>
				<button
					type="submit"
					disabled={isLoading || !input.trim()}
					className="px-3 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
