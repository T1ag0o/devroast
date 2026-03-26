/**
 * Componente JSX para renderização de imagem OpenGraph com Takumi.
 *
 * Segue o design do Pencil (devroast.pen):
 * - Score em destaque (esquerda)
 * - Quote + Verdict Badge + Meta (direita)
 * - Logo devroast (canto inferior direito)
 *
 * @see https://github.com/kane50613/takumi
 */

import type { JSX } from "react";

export interface RoastOGProps {
	score: number;
	quote: string;
	verdict: string;
	language: string;
	lineCount: number;
}

function getScoreColor(score: number): string {
	if (score < 4) return "#EF4444";
	if (score < 7) return "#F59E0B";
	return "#22C55E";
}

export function RoastOG({
	score,
	quote,
	verdict,
	language,
	lineCount,
}: RoastOGProps): JSX.Element {
	const scoreColor = getScoreColor(score);

	return (
		<div
			style={{
				width: 1200,
				height: 630,
				backgroundColor: "#0A0A0A",
				display: "flex",
				flexDirection: "column",
				padding: 48,
			}}
		>
			<div
				style={{
					display: "flex",
					gap: 48,
					flex: 1,
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<span
						style={{
							fontSize: 80,
							fontWeight: 700,
							color: "#FFFFFF",
							fontFamily: "JetBrains Mono",
						}}
					>
						{score.toFixed(1)}
					</span>
					<span
						style={{
							fontSize: 24,
							color: "#6B7280",
							fontFamily: "JetBrains Mono",
						}}
					>
						/10
					</span>
				</div>

				<div
					style={{
						flex: 1,
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						gap: 16,
					}}
				>
					<span
						style={{
							fontSize: 28,
							color: "#FAFAFA",
							fontFamily: "IBM Plex Mono",
							lineHeight: 1.4,
						}}
					>
						&quot;{quote}&quot;
					</span>

					<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
						<div
							style={{
								width: 8,
								height: 8,
								borderRadius: "50%",
								backgroundColor: scoreColor,
							}}
						/>
						<span
							style={{
								fontSize: 13,
								color: scoreColor,
								fontFamily: "JetBrains Mono",
							}}
						>
							verdict: {verdict.replace(/_/g, " ")}
						</span>
					</div>

					<span
						style={{
							fontSize: 16,
							color: "#6B7280",
							fontFamily: "JetBrains Mono",
						}}
					>
						lang: {language} · {lineCount} lines
					</span>
				</div>
			</div>

			<span
				style={{
					fontSize: 20,
					color: "#10B981",
					fontFamily: "JetBrains Mono",
					alignSelf: "flex-end",
				}}
			>
				&gt; devroast
			</span>
		</div>
	);
}
