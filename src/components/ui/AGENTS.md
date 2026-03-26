# Padrões de Componentes UI

## Estrutura de Arquivos

```
src/components/ui/
├── button.tsx
├── toggle.tsx
├── badge.tsx
├── diff-line.tsx
├── code-block.tsx
├── code-editor.tsx
├── table-row.tsx
├── score-ring.tsx
├── analysis-card.tsx
├── navbar.tsx
└── AGENTS.md
```

## Regras para Criação de Componentes

### 1. Named Exports

Sempre use **named exports**, nunca default exports.

```tsx
// ✅ Correto
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(...)

// ❌ Errado
export default function Button() {}
```

### 2. Extensão de Props Nativas

Estenda as propriedades nativas do elemento HTML usando `ComponentHTMLAttributes`.

```tsx
import { type ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}
```

### 3. Tailwind Variants

Use `tailwind-variants` (tv) para criar variantes do componente. **Não use** `cn()` ou `tailwind-merge` junto com `tv`, pois o tv faz o merge automaticamente.

```tsx
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
  base: "classes-base",
  variants: {
    variant: {
      default: "variant-classes",
      secondary: "variant-classes",
    },
    size: {
      sm: "size-classes",
      lg: "size-classes",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});
```

### 4. Forward Ref

Use `forwardRef` para permitir acesso ao elemento DOM subjacente.

```tsx
export const Component = forwardRef<HTMLButtonElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <element
        className={componentVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  }
);

Component.displayName = "Component";
```

### 5. Display Name

Sempre defina o `displayName` para componentes forwardRef.

### 6. Server Components

Para componentes que renderizam no servidor (ex: shiki), não use forwardRef nem extensões de props HTML. Use função async pura.

```tsx
// Server Component (não é cliente)
export async function CodeBlock({ code, language = "javascript" }: CodeBlockProps) {
  const html = await codeToHtml(code, { lang: language, theme: "vesper" });
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

### 7. Biblioteca base-ui

Para componentes com comportamento (toggle, checkbox, etc), use **@base-ui/react**.

```tsx
import { Switch } from "@base-ui/react/switch";

<Switch.Root>
  <Switch.Thumb />
</Switch.Root>
```

## Checklist de Criação

- [ ] Criar arquivo em `src/components/ui/[component-name].tsx`
- [ ] Usar named export
- [ ] Estender propriedades nativas do HTML (quando aplicável)
- [ ] Usar `tailwind-variants` para variantes
- [ ] Não usar `cn()` ou `tailwind-merge` com `tv`
- [ ] Usar `forwardRef` para componentes cliente
- [ ] Definir `displayName`
- [ ] Testar build com `npm run build`
- [ ] Executar lint com `npm run check`

## Componentes Existentes

| Componente | Arquivo | Tipo | Base |
|------------|---------|------|------|
| Button | `button.tsx` | Cliente | tv |
| Toggle | `toggle.tsx` | Cliente | base-ui |
| Badge | `badge.tsx` | Cliente | tv |
| DiffLine | `diff-line.tsx` | Cliente | tv |
| CodeBlock | `code-block.tsx` | Servidor | shiki |
| CodeEditor | `code-editor.tsx` | Cliente | tv |
| TableRow | `table-row.tsx` | Cliente | tv |
| ScoreRing | `score-ring.tsx` | Cliente | tv |
| AnalysisCard | `analysis-card.tsx` | Cliente | tv |
| Navbar | `navbar.tsx` | Cliente | tv |
| ShareButton | `share-button.tsx` | Cliente | tv |

## Dependências Instaladas

- `@base-ui/react` - Componentes headless (toggle)
- `tailwind-variants` - Variantes de componentes
- `shiki` - Syntax highlighting server-side
- `clsx` - Utilitário para classes (se necessário)
- `tailwind-merge` - Merge de classes (evitar com tv)
- `@takumi-rs/image-response` - Geração de imagens OpenGraph