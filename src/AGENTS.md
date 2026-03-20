# Padrões do Projeto

## Estrutura

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Home (Server Component)
│   ├── layout.tsx          # Root layout
│   └── [route]/           # Rotas dinâmicas
├── components/
│   ├── ui/                # Componentes reutilizáveis
│   └── *.tsx              # Componentes de página
├── db/                    # Database (Drizzle ORM)
├── trpc/                  # tRPC API layer
└── lib/                   # Utilitários
```

## Padrões de Componentes

### Server Components vs Client Components

**Server Components** (`async function`):
- Busca de dados
- Componentes puramente presentacionais
- Não usam estado (`useState`) ou efeitos (`useEffect`)

**Client Components** (`"use client"`):
- Interatividade (eventos, estado)
- Hooks do React
- Animações

### Split Server/Client Pattern

Quando uma página precisa de dados E interatividade:

```tsx
// app/page.tsx (Server Component)
import { Suspense } from "react";
import { MetricsClient } from "./metrics-client";
import { MetricsSkeleton } from "./metrics-skeleton";

export default function Page() {
  return (
    <>
      <InteractiveComponent />
      <Suspense fallback={<Skeleton />}>
        <ServerDataComponent />
      </Suspense>
    </>
  );
}
```

### Animações de Números

Para números que vem de APIs, use animação com `requestAnimationFrame`:

```tsx
// components/animated-number.tsx
"use client";

import { useEffect, useRef, useState } from "react";

export function AnimatedNumber({ value, precision = 0 }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const start = prevValueRef.current;
    const end = value;
    const duration = 800;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - (1 - progress) ** 3;
      const current = start + (end - start) * easeOut;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        prevValueRef.current = end;
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <span>{displayValue.toFixed(precision)}</span>;
}
```

### Skeleton Loading

Para estados de loading, use skeleton com `animate-pulse`:

```tsx
export function MetricsSkeleton() {
  return (
    <div className="flex items-center gap-6 text-text-tertiary font-mono text-xs animate-pulse">
      <div className="h-4 w-32 bg-bg-surface rounded" />
      <span>·</span>
      <div className="h-4 w-24 bg-bg-surface rounded" />
    </div>
  );
}
```

## tRPC Integration

Ver `src/trpc/AGENTS.md` para padrões detalhados.

## Database Integration

Ver `src/db/AGENTS.md` para padrões detalhados.

## Navbar Global

O componente `Navbar` é global e está no `layout.tsx`. Não repetir em páginas individuais.
