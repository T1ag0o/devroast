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
		theme: "vesper",
	});

	return (
		<div className="bg-bg-input border border-border-primary rounded overflow-hidden w-full max-w-[560px]">
			{filename && (
				<div className="flex items-center gap-3 h-10 px-4 border-b border-border-primary">
					<span className="w-2.5 h-2.5 rounded-full bg-accent-red" />
					<span className="w-2.5 h-2.5 rounded-full bg-accent-amber" />
					<span className="w-2.5 h-2.5 rounded-full bg-accent-green" />
					<span className="flex-1" />
					<span className="font-mono text-xs text-text-tertiary">
						{filename}
					</span>
				</div>
			)}
			<div
				className="[&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:overflow-x-auto"
				dangerouslySetInnerHTML={{ __html: html }}
			/>
		</div>
	);
}
