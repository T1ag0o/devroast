export type Language = {
	id: string;
	name: string;
	aliases?: string[];
};

export const LANGUAGES: Language[] = [
	{ id: "javascript", name: "JavaScript", aliases: ["js"] },
	{ id: "typescript", name: "TypeScript", aliases: ["ts"] },
	{ id: "python", name: "Python", aliases: ["py"] },
	{ id: "rust", name: "Rust", aliases: ["rs"] },
	{ id: "go", name: "Go", aliases: ["golang"] },
	{ id: "java", name: "Java" },
	{ id: "csharp", name: "C#", aliases: ["cs"] },
	{ id: "cpp", name: "C++", aliases: ["c++"] },
	{ id: "c", name: "C" },
	{ id: "ruby", name: "Ruby", aliases: ["rb"] },
	{ id: "php", name: "PHP" },
	{ id: "swift", name: "Swift" },
	{ id: "kotlin", name: "Kotlin", aliases: ["kt"] },
	{ id: "scala", name: "Scala" },
	{ id: "html", name: "HTML" },
	{ id: "css", name: "CSS" },
	{ id: "scss", name: "SCSS", aliases: ["sass"] },
	{ id: "less", name: "Less" },
	{ id: "json", name: "JSON" },
	{ id: "yaml", name: "YAML", aliases: ["yml"] },
	{ id: "xml", name: "XML" },
	{ id: "sql", name: "SQL" },
	{ id: "bash", name: "Bash", aliases: ["sh", "shell", "zsh"] },
	{ id: "powershell", name: "PowerShell", aliases: ["ps1"] },
	{ id: "dockerfile", name: "Dockerfile" },
	{ id: "markdown", name: "Markdown", aliases: ["md"] },
	{ id: "r", name: "R" },
	{ id: "perl", name: "Perl" },
	{ id: "lua", name: "Lua" },
	{ id: "haskell", name: "Haskell", aliases: ["hs"] },
	{ id: "elixir", name: "Elixir", aliases: ["ex"] },
	{ id: "erlang", name: "Erlang", aliases: ["erl"] },
	{ id: "clojure", name: "Clojure", aliases: ["clj"] },
	{ id: "objective-c", name: "Objective-C", aliases: ["objc"] },
	{ id: "ocaml", name: "OCaml", aliases: ["ml"] },
	{ id: "fsharp", name: "F#", aliases: ["fs"] },
	{ id: "dart", name: "Dart" },
	{ id: "vue", name: "Vue" },
	{ id: "svelte", name: "Svelte" },
	{ id: "jsx", name: "JSX" },
	{ id: "tsx", name: "TSX" },
	{ id: "toml", name: "TOML" },
	{ id: "graphql", name: "GraphQL", aliases: ["gql"] },
	{ id: "solidity", name: "Solidity" },
	{ id: "zig", name: "Zig" },
	{ id: "julia", name: "Julia" },
	{ id: "fortran", name: "Fortran" },
	{ id: "cobol", name: "COBOL" },
	{ id: "lisp", name: "Lisp" },
	{ id: "scheme", name: "Scheme" },
	{ id: "matlab", name: "MATLAB" },
	{ id: "pascal", name: "Pascal" },
	{ id: "delphi", name: "Delphi" },
	{ id: "vhdl", name: "VHDL" },
	{ id: "verilog", name: "Verilog" },
	{ id: "latex", name: "LaTeX" },
	{ id: "bibtex", name: "BibTeX" },
	{ id: "nginx", name: "Nginx" },
	{ id: "apache", name: "Apache" },
	{ id: "ini", name: "INI" },
	{ id: "makefile", name: "Makefile", aliases: ["make"] },
	{ id: "cmake", name: "CMake" },
	{ id: "diff", name: "Diff", aliases: ["patch"] },
	{ id: "properties", name: "Properties" },
	{ id: "gradle", name: "Gradle" },
	{ id: "groovy", name: "Groovy" },
	{ id: "coffeescript", name: "CoffeeScript", aliases: ["coffee"] },
	{ id: "livescript", name: "LiveScript", aliases: ["ls"] },
	{ id: "pug", name: "Pug", aliases: ["jade"] },
	{ id: "handlebars", name: "Handlebars", aliases: ["hbs"] },
	{ id: "ejs", name: "EJS" },
	{ id: "erb", name: "ERB" },
	{ id: "twig", name: "Twig" },
	{ id: "liquid", name: "Liquid" },
	{ id: "smarty", name: "Smarty" },
	{ id: "plaintext", name: "Plain Text", aliases: ["text", "txt"] },
];

export function getLanguageById(id: string): Language | undefined {
	const normalizedId = id.toLowerCase();
	return LANGUAGES.find(
		(lang) => lang.id === normalizedId || lang.aliases?.includes(normalizedId),
	);
}

export function getLanguageDisplayName(id: string): string {
	const lang = getLanguageById(id);
	return lang?.name || id;
}
