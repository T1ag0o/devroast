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

## OpenGraph Images

O DevRoast utiliza **Takumi** para gerar imagens OpenGraph dinâmicas quando resultados são compartilhados.

### Estrutura

```
src/
├── app/results/[id]/
│   ├── opengraph/
│   │   └── route.tsx    # GET /results/[id]/opengraph
│   └── page.tsx         # generateMetadata com OG
├── components/og/
│   └── roast-og.tsx    # Componente JSX para imagem
└── lib/
    └── fonts.ts         # Fetch de fontes Google
```

### Tecnologias

- **@takumi-rs/image-response** - Renderização de JSX para imagem
- **next/og API** - Não usado (Takumi é mais rápido)

### Configuração

```ts
// next.config.ts
export const config = {
  serverExternalPackages: ["@takumi-rs/core"],
};
```

### Design da Imagem

| Elemento | Estilo |
|----------|--------|
| Background | `#0A0A0A` (dark) |
| Score | JetBrains Mono, 80px, bold, branco |
| /10 | JetBrains Mono, 24px, `#6B7280` |
| Quote | IBM Plex Mono, 28px, `#FAFAFA`, 2 linhas máx |
| Badge | Cor baseada no score (< 4 red, 4-6 amber, ≥ 7 green) |
| Meta | JetBrains Mono, 16px, `#6B7280` |
| Logo | `> devroast` em `#10B981` |

**Dimensão:** 1200x630 (OpenGraph padrão)

### Fluxo

1. Usuário compartilha link `/results/[id]`
2. Twitter/LinkedIn faz fetch de `/results/[id]/opengraph`
3. Route handler busca dados do roast
4. Takumi renderiza componente JSX para PNG
5. Imagem é retornada e exibida no preview

### Metadata

A página de results inclui `generateMetadata` com OpenGraph:

```tsx
export async function generateMetadata({ params }: RoastResultPageProps) {
  return {
    openGraph: {
      images: [`/results/${id}/opengraph`],
    },
    twitter: {
      card: "summary_large_image",
      images: [`/results/${id}/opengraph`],
    },
  };
}
```

### Botão Share

O botão `$ share_roast` na página de results permite copiar o link para compartilhar:

```tsx
// src/components/ui/share-button.tsx
<ShareButton url={`${NEXT_PUBLIC_BASE_URL}/results/${id}`} />
```

**Funcionalidades:**
- Copia URL para clipboard
- Mostra feedback visual `$ copied!`
- Fallback: abre Twitter para compartilhamento
- Variável ambiente: `NEXT_PUBLIC_BASE_URL`

### Notas

- Fontes são buscadas em runtime (sem bundling)
- Sem cache (sempre regenera sob demanda)
- Retorna 404 se roast não existir
- Arquivo do route handler deve ser `.tsx` para suportar JSX
- Adicionar `NEXT_PUBLIC_BASE_URL` ao `.env` para produção

## Neon JSONB Handling

O driver `postgres` do Neon (e similares) faz parsing automático de colunas JSONB para objetos JavaScript.

**Problema:** Ao usar `rawQuery`, o campo JSONB já retorna como objeto, não como string.

```tsx
// ❌ ERRADO: JSON.parse em objeto já parsed
const feedback = data.feedback ? JSON.parse(data.feedback) : {};

// ✅ CORRETO: Verificar tipo antes de parsear
let feedback: Record<string, unknown> = {};
if (data.feedback) {
  if (typeof data.feedback === "object") {
    feedback = data.feedback as Record<string, unknown>;
  } else if (typeof data.feedback === "string") {
    try {
      feedback = JSON.parse(data.feedback);
    } catch {
      feedback = { quote: data.feedback };
    }
  }
}
```

Este padrão deve ser usado em todas as páginas que leem campos JSONB do banco.
