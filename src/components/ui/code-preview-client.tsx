"use client";

import { Suspense } from "react";
import { CodePreview } from "@/components/ui/code-preview";

interface CodePreviewClientProps {
	code: string;
	language?: string;
}

export function CodePreviewClient({ code, language }: CodePreviewClientProps) {
	return (
		<Suspense
			fallback={
				<code className="font-mono text-xs text-text-tertiary">Loading...</code>
			}
		>
			<CodePreview code={code} language={language} />
		</Suspense>
	);
}
