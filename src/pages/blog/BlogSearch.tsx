interface BlogSearchProps {
	query: string;
	onQueryChange: (query: string) => void;
	tags: string[];
	selectedTags: string[];
	onTagToggle: (tag: string) => void;
}

export function BlogSearch({
	query,
	onQueryChange,
	tags,
	selectedTags,
	onTagToggle,
}: BlogSearchProps) {
	return (
		<div className="space-y-4">
			{/* Search Input */}
			<div className="relative">
				<svg
					className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-surface-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
				<input
					type="text"
					placeholder="Search posts..."
					value={query}
					onChange={(e) => onQueryChange(e.target.value)}
					className="w-full rounded-lg border border-surface-200 bg-white py-3 pl-10 pr-10 text-surface-900 placeholder:text-surface-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent-500"
				/>
				{query && (
					<button
						onClick={() => onQueryChange('')}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
						aria-label="Clear search"
					>
						<svg
							className="h-5 w-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				)}
			</div>

			{/* Tag Filters */}
			{tags.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{tags.map((tag) => {
						const isSelected = selectedTags.includes(tag);
						return (
							<button
								key={tag}
								onClick={() => onTagToggle(tag)}
								className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors ${
									isSelected
										? 'bg-accent-600 text-white'
										: 'bg-surface-100 text-surface-600 hover:bg-surface-200'
								}`}
							>
								{tag}
								{isSelected && (
									<svg
										className="ml-1 h-3 w-3"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								)}
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
}
