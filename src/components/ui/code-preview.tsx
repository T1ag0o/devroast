import { codeToHtml } from "shiki";

interface CodePreviewProps {
	code: string;
	language?: string;
}

export async function CodePreview({
	code,
	language = "javascript",
}: CodePreviewProps) {
	const html = await codeToHtml(code, {
		lang: language,
		theme: "dracula",
	});

	const cleanHtml = html.replace(
		/style="background-color:[^"]*"/gi,
		'style=""',
	);

	return (
		<code
			className="[&_pre]:inline [&_pre]:p-0 [&_pre]:font-mono [&_pre]:text-xs [&_pre]:!bg-transparent"
			dangerouslySetInnerHTML={{ __html: cleanHtml }}
		/>
	);
}
