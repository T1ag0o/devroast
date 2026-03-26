"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { Toggle } from "@/components/ui/toggle";
import { trpc } from "@/trpc/client";

export function HomeClient() {
	const [code, setCode] = useState("");
	const [language, setLanguage] = useState("javascript");
	const [roastMode, setRoastMode] = useState(true);
	const [nickname, setNickname] = useState("");
	const MAX_LENGTH = 2000;
	const isOverLimit = code.length > MAX_LENGTH;
	const isEmpty = code.trim().length === 0;
	const router = useRouter();

	const submitMutation = trpc.roast.submit.useMutation({
		onSuccess: (data) => {
			router.push(`/results/${data.submissionId}`);
		},
		onError: (error) => {
			console.error("Roast error:", error.message);
			alert(error.message || "Failed to roast code. Please try again.");
		},
	});

	const handleSubmit = () => {
		if (isEmpty || isOverLimit || submitMutation.isPending) return;

		submitMutation.mutate({
			code,
			language,
			roastType: roastMode ? "brutal" : "friendly",
			nickname: nickname.trim() || undefined,
		});
	};

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

			<div className="w-full max-w-[780px]">
				<div className="flex items-center mb-3">
					<span className="text-text-tertiary font-mono text-sm mr-1">@</span>
					<input
						type="text"
						value={nickname}
						onChange={(e) => setNickname(e.target.value.slice(0, 30))}
						placeholder="anonymous"
						className="bg-bg-input border border-border-primary rounded px-2 py-1 font-mono text-sm text-text-secondary w-full max-w-[200px] outline-none focus:border-accent-green"
					/>
				</div>

				<CodeEditor
					value={code}
					onChange={setCode}
					onLanguageChange={setLanguage}
					maxLength={MAX_LENGTH}
				/>
			</div>

			<div className="w-full max-w-[780px] flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Toggle
						checked={roastMode}
						onCheckedChange={setRoastMode}
						label="roast mode"
					/>
					<span className="font-mono text-xs text-text-tertiary">
						{roastMode ? "// maximum sarcasm enabled" : "// friendly mode"}
					</span>
				</div>
				<Button
					variant="default"
					disabled={isEmpty || isOverLimit || submitMutation.isPending}
					onClick={handleSubmit}
				>
					{submitMutation.isPending ? "$ roasting..." : "$ roast_my_code"}
				</Button>
			</div>
		</>
	);
}
