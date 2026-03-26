/**
 * Utilitário para carregar fontes do Google Fonts para uso com Takumi.
 *
 * As fontes são buscadas em runtime para evitar bundling pesado.
 * URLs são verificadas periodicamente - caso falhem, usar fallback.
 *
 * @see https://github.com/kane50613/takumi
 */

export interface FontConfig {
	name: string;
	data: ArrayBuffer;
	style: "normal" | "italic";
	weight: number;
}

const FONT_URLS = {
	"jetbrains-mono-regular":
		"https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPxDcwg.woff2",
	"jetbrains-mono-bold":
		"https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8L6tTOlOV.woff2",
	"ibm-plex-mono-regular":
		"https://fonts.gstatic.com/s/ibmplexmono/v20/-F63fjptAgt5VM-kVkqdyU8n1i8q1w.woff2",
};

async function fetchFont(url: string): Promise<ArrayBuffer> {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to fetch font from ${url}`);
	}
	return response.arrayBuffer();
}

export async function getFonts(): Promise<FontConfig[]> {
	try {
		const [jbMono, jbMonoBold, ibmPlex] = await Promise.all([
			fetchFont(FONT_URLS["jetbrains-mono-regular"]),
			fetchFont(FONT_URLS["jetbrains-mono-bold"]),
			fetchFont(FONT_URLS["ibm-plex-mono-regular"]),
		]);

		return [
			{
				name: "JetBrains Mono",
				data: jbMono,
				style: "normal",
				weight: 400,
			},
			{
				name: "JetBrains Mono",
				data: jbMonoBold,
				style: "normal",
				weight: 700,
			},
			{
				name: "IBM Plex Mono",
				data: ibmPlex,
				style: "normal",
				weight: 400,
			},
		];
	} catch (error) {
		console.error("Failed to load fonts:", error);
		return [];
	}
}
