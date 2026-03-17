import hljs from "highlight.js";

export function detectLanguage(code: string): string {
	if (!code || code.trim().length < 10) {
		return "plaintext";
	}

	const result = hljs.highlightAuto(code);

	if (result.language && LANGUAGES_MAP[result.language.toLowerCase()]) {
		return result.language.toLowerCase();
	}

	return "plaintext";
}

export const LANGUAGES_MAP: Record<string, string> = {
	javascript: "javascript",
	js: "javascript",
	typescript: "typescript",
	ts: "typescript",
	python: "python",
	py: "python",
	rust: "rust",
	rs: "rust",
	go: "go",
	golang: "go",
	java: "java",
	csharp: "csharp",
	cs: "csharp",
	cpp: "cpp",
	"c++": "cpp",
	c: "c",
	ruby: "ruby",
	rb: "ruby",
	php: "php",
	swift: "swift",
	kotlin: "kotlin",
	scala: "scala",
	html: "html",
	css: "css",
	scss: "scss",
	sass: "scss",
	less: "less",
	json: "json",
	yaml: "yaml",
	yml: "yaml",
	xml: "xml",
	sql: "sql",
	bash: "bash",
	sh: "bash",
	shell: "bash",
	powershell: "powershell",
	ps1: "powershell",
	dockerfile: "dockerfile",
	markdown: "markdown",
	md: "markdown",
	r: "r",
	perl: "perl",
	lua: "lua",
	haskell: "haskell",
	hs: "haskell",
	elixir: "elixir",
	ex: "elixir",
	erlang: "erlang",
	clojure: "clojure",
	clj: "clojure",
	objectivec: "objectivec",
	ocaml: "ocaml",
	fsharp: "fsharp",
	fs: "fsharp",
	dart: "dart",
	vue: "vue",
	svelte: "svelte",
	jsx: "jsx",
	tsx: "tsx",
	toml: "toml",
	graphql: "graphql",
	gql: "graphql",
	solidity: "solidity",
	plaintext: "plaintext",
	text: "plaintext",
};
