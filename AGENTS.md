# DevRoast - AGENTS.md

## Project

DevRoast - A brutal code review tool. Paste code, get roasted.

## Tech Stack

- Next.js 16, React 19, TypeScript
- Tailwind CSS v4
- @base-ui/react (headless components)
- tailwind-variants (component variants)
- shiki (syntax highlighting)

## Commands

```bash
npm run dev    # development
npm run build  # production build
npm run check  # lint + type check
npm run format # format code
```

## UI Components

Location: `src/components/ui/`

- Named exports only
- Use `forwardRef` for client components
- Use `tv` (tailwind-variants) for variants
- Server components: async functions, no client state

## Design Tokens

Located in Pencil file: `~/Downloads/devroast.pen`

- Font: JetBrains Mono (primary), IBM Plex Mono, Geist
- Primary: #FF8400 (orange)
- Background: #0A0A0A (dark)
- Border radius: 0, 16, 999

## OpenRouter API

O projeto usa OpenRouter (Claude) para gerar as avaliações dos códigos.

### Configuração

- Chave API: `GEMINI_API_KEY` no `.env`
- Modelo: `anthropic/claude-3.5-sonnet`
- Timeout: 60 segundos
- Max tokens: 600 (para evitar erros por falta de créditos)

### Erro Comum

Se as avaliações voltarem com o texto genérico "Okay fine, this code isn't terrible..." em vez de uma análise real, significa que a API falhou. Causas possíveis:

1. **Chave sem créditos** - Verificar em https://openrouter.ai/settings/credits
2. **max_tokens muito alto** - Reduzir de 800 para 600 no `src/lib/gemini.ts`
3. **Timeout** - A API pode estar demorando demais

### Debug

Para ver logs da API, adicione `console.log` no `src/lib/gemini.ts` na função `generateRoast`. Os erros são capturados e caem no fallback genérico silenciosamente.
