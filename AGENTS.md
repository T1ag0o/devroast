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
