"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { Toggle } from "@/components/ui/toggle";

export function HomeClient() {
	const [code, setCode] = useState("");
	const MAX_LENGTH = 2000;
	const isOverLimit = code.length > MAX_LENGTH;

	return (
		<>
			<div className="flex flex-col gap-3 text-center">
				<h1 className="font-mono text-4xl font-bold text-text-primary">
					<span className="text-accent-green">$</span> paste your code. get
					roasted.
				</h1>
				<p className="font-mono text-sm text-text-secondary">
					{/* drop your code below and we'll rate it — brutally honest or full roast mode */}
				</p>
			</div>

			<CodeEditor value={code} onChange={setCode} maxLength={MAX_LENGTH} />

			<div className="w-full max-w-[780px] flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Toggle defaultChecked={true} label="roast mode" />
					<span className="font-mono text-xs text-text-tertiary">
						{/* maximum sarcasm enabled */}
					</span>
				</div>
				<Button variant="default" disabled={isOverLimit}>
					$ roast_my_code
				</Button>
			</div>
		</>
	);
}
