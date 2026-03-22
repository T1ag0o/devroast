# Padrões tRPC

## Estrutura

```
src/trpc/
├── init.ts           # initTRPC + context + procedures
├── query-client.ts   # QueryClient factory
├── server.ts        # Helpers para Server Components
├── client.tsx       # TRPCProvider (client)
├── server.ts        # getMetrics helper
└── routers/
    ├── _app.ts      # Root router
    └── [feature].ts # Routers específicos
```

## Arquitetura

### Server Components (RSC)

Para buscar dados no servidor:

```typescript
// src/trpc/server.ts
import "server-only";
import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { cache } from "react";
import { createCallerFactory, createTRPCContext } from "./init";
import { makeQueryClient } from "./query-client";
import { appRouter } from "./routers/_app";

export const getQueryClient = cache(makeQueryClient);
const caller = createCallerFactory(appRouter)(createTRPCContext);

export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
  caller,
  getQueryClient,
);
```

### Client Components

Para interatividade com dados:

```typescript
// src/trpc/client.tsx
"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";
import { makeQueryClient } from "./query-client";
import type { AppRouter } from "./routers/_app";

export const trpc = createTRPCReact<AppRouter>();

function getQueryClient() {
  if (typeof window === "undefined") return makeQueryClient();
  return (browserQueryClient ??= makeQueryClient());
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [httpBatchLink({ url: `${getUrl()}/api/trpc` })],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
```

## API Route Handler

```typescript
// src/app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/trpc/routers/_app";
import { createTRPCContext } from "@/trpc/init";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });

export { handler as GET, handler as POST };
```

## Criando um Router

```typescript
// src/trpc/routers/metrics.ts
import { publicProcedure, router } from "../init";

export const metricsRouter = router({
  getStats: publicProcedure.query(async () => {
    try {
      const { getMetrics } = await import("@/db/queries");
      const metrics = await getMetrics();
      if (!metrics || metrics.length === 0) {
        return { totalCodes: 0, avgScore: 0 };
      }
      return {
        totalCodes: Number(metrics[0].total_codes),
        avgScore: Number(metrics[0].avg_score),
      };
    } catch {
      return { totalCodes: 0, avgScore: 0 };
    }
  }),
});
```

## Root Router

```typescript
// src/trpc/routers/_app.ts
import { router } from "../init";
import { metricsRouter } from "./metrics";

export const appRouter = router({
  metrics: metricsRouter,
});

export type AppRouter = typeof appRouter;
```

## Usando no Frontend

### Client Component
```tsx
"use client";
import { trpc } from "@/trpc/client";

export function MetricsDisplay() {
  const [mounted, setMounted] = useState(false);
  const { data } = trpc.metrics.getStats.useQuery(undefined, {
    enabled: mounted,
  });

  useEffect(() => setMounted(true), []);

  return <div>{data?.totalCodes}</div>;
}
```

### Server Component
```tsx
import { getMetrics } from "@/trpc/server";

export async function MetricsServer() {
  const stats = await getMetrics();
  return <MetricsDisplay totalCodes={stats.totalCodes} avgScore={stats.avgScore} />;
}
```

## Regras

1. **Lazy import de queries** → para evitar erros quando banco não está rodando
2. **try/catch em procedures** → retornar valores default em caso de erro
3. **TRPCProvider no layout** → para permitir uso em toda a app
4. **tipos através de AppRouter** → nunca definir tipos manualmente
5. **Promise.all para queries paralelas** → quando múltiplas queries podem rodar simultaneamente

## Queries Paralelas

Quando uma procedure precisa de múltiplos dados que não dependem uns dos outros, usar `Promise.all` para execução em paralelo:

```typescript
// src/trpc/routers/dashboard.ts
export const dashboardRouter = router({
  getAll: publicProcedure.query(async () => {
    const [metrics, topEntries, recentActivity] = await Promise.all([
      getMetrics(),
      getLeaderboardWithSubmissions(3),
      getRecentSubmissions(10),
    ]);
    
    return {
      totalCodes: metrics[0]?.total_codes ?? 0,
      topEntries,
      recentActivity,
    };
  }),
});
```
