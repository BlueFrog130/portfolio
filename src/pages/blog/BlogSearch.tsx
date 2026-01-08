import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

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
	const [inputValue, setInputValue] = useState(query);

	// Debounce the search query
	useEffect(() => {
		const timer = setTimeout(() => {
			onQueryChange(inputValue);
		}, 300);

		return () => clearTimeout(timer);
	}, [inputValue, onQueryChange]);

	// Sync with external query changes (e.g., clear button)
	useEffect(() => {
		setInputValue(query);
	}, [query]);

	return (
		<div className="space-y-4">
			{/* Search Input */}
			<div className="relative">
				<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-surface-500" />
				<input
					type="text"
					placeholder="Search posts..."
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					className="w-full rounded-xl border border-surface-700 bg-surface-800/50 py-3.5 pl-12 pr-12 text-surface-100 placeholder:text-surface-500 focus:border-accent-500/50 focus:outline-none focus:ring-2 focus:ring-accent-500/20 transition-all"
				/>
				{inputValue && (
					<button
						onClick={() => setInputValue('')}
						className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg text-surface-500 hover:text-surface-300 hover:bg-surface-700/50 transition-colors"
						aria-label="Clear search"
					>
						<X className="h-4 w-4" />
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
								className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
									isSelected
										? 'bg-accent-500 text-surface-950 shadow-sm shadow-accent-500/25'
										: 'bg-surface-800 text-surface-300 border border-surface-700 hover:border-surface-600 hover:bg-surface-700'
								}`}
							>
								{tag}
								{isSelected && <X className="h-3 w-3" />}
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
}
