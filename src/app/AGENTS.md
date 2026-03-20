# Padrões de Páginas

## Estrutura

```
src/app/
├── page.tsx              # Home (Server Component)
├── layout.tsx            # Root Layout (inclui Navbar, TRPCProvider)
├── home-client.tsx       # Client parts da home
└── [route]/
    └── page.tsx         # Páginas de rota
```

## Root Layout

O `layout.tsx` inclui componentes globais:

```tsx
// src/app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <TRPCProvider>
          <Navbar logoText="devroast" links={[{ label: "leaderboard", href: "/leaderboard" }]} />
          {children}
        </TRPCProvider>
      </body>
    </html>
  );
}
```

**Inclui:**
- `TRPCProvider` - Para tRPC client
- `Navbar` - Navegação global

## Split Server/Client

Pages são **Server Components** por padrão. Para interatividade:

```tsx
// ✅ CORRETO: page.tsx é server, extrai client parts
// src/app/page.tsx
import { HomeClient } from "./home-client";

export default function Page() {
  return <HomeClient />;
}

// src/app/home-client.tsx
"use client";
export function HomeClient() {
  // useState, event handlers, etc
}
```

```tsx
// ❌ ERRADO: "use client" direto na página
"use client"; // Não fazer isso em page.tsx
```

## Métricas na Homepage

As métricas são buscadas via tRPC e animadas:

```tsx
// src/app/page.tsx
import { MetricsDisplay } from "@/components/metrics-display";

export default function HomePage() {
  return (
    <>
      <HomeClient />
      <MetricsDisplay /> {/* client component com animação */}
    </>
  );
}
```

## Ícones de Títulos

Conforme design no Pencil:

| Título | Ícone | Exemplo |
|--------|-------|---------|
| Logo Navbar | `>` | `> devroast` |
| Títulos de seção | `//` | `// your_submission` |

```tsx
<span className="text-accent-green font-mono text-sm font-bold">//</span>
<span className="text-text-primary font-mono text-sm font-bold">your_submission</span>
```

## Título do Diff Box

O título do diff usa a linguagem do código submetido:

```tsx
<span>
  your_code.{language} → improved_code.{language}
</span>
```
