import { codeToHtml } from "shiki";

interface CodeBlockProps {
	code: string;
	language?: string;
	filename?: string;
}

export async function CodeBlock({
	code,
	language = "javascript",
	filename,
}: CodeBlockProps) {
	const html = await codeToHtml(code, {
		lang: language,
		theme: "dracula",
	});

	return (
		<div className="w-full min-w-0">
			{filename && (
				<div className="flex items-center gap-3 h-10 px-4 border border-border-primary border-b-0 rounded-t overflow-hidden bg-bg-surface">
					<span className="w-2.5 h-2.5 rounded-full bg-accent-red" />
					<span className="w-2.5 h-2.5 rounded-full bg-accent-amber" />
					<span className="w-2.5 h-2.5 rounded-full bg-accent-green" />
					<span className="flex-1" />
					<span className="font-mono text-xs text-text-tertiary">
						{filename}
					</span>
				</div>
			)}
			<div className="overflow-x-auto">
				<div
					className="[&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:!bg-[#111111] min-w-max"
					dangerouslySetInnerHTML={{ __html: html }}
				/>
			</div>
		</div>
	);
}
