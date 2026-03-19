# tRPC Setup - Especificação

## Visão Geral

Camada de API typesafe para comunicação client/server com suporte a Next.js Server Components e TanStack Query.

## Stack

- **API**: tRPC v11
- **Query Client**: TanStack React Query v5
- **Validation**: Zod
- **Adapter**: Next.js App Router (fetch)

## Estrutura de Arquivos

```
src/
├── trpc/
│   ├── init.ts              # initTRPC + context
│   ├── query-client.ts      # QueryClient factory
│   ├── server.ts            # Server helpers (RSC)
│   ├── client.tsx           # Client provider
│   └── routers/
│       ├── _app.ts          # Root router
│       ├── submissions.ts   # Submissions router
│       ├── roasts.ts        # Roasts router
│       └── leaderboard.ts   # Leaderboard router
└── app/
    └── api/trpc/[trpc]/route.ts  # API route handler
```

## Decisões de Implementação

| Decisão | Opção Escolhida | Justificativa |
|---------|-----------------|---------------|
| RSC Helper | `@trpc/react-query/rsc` | Suporte nativo a Server Components |
| Client Singleton | Singleton pattern | Evita múltiplos QueryClients no browser |
| API Handler | Fetch adapter | Compatível com Next.js App Router |
| Validation | Zod | Integração nativa com tRPC |

## Arquitetura

### Server Components (RSC)

```tsx
// src/trpc/server.ts
import 'server-only';
import { createHydrationHelpers } from '@trpc/react-query/rsc';
import { cache } from 'react';
import { createCallerFactory, createTRPCContext } from './init';
import { makeQueryClient } from './query-client';
import { appRouter } from './routers/_app';

export const getQueryClient = cache(makeQueryClient);
const caller = createCallerFactory(appRouter)(createTRPCContext);

export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
  caller,
  getQueryClient,
);
```

### Client Provider

```tsx
// src/trpc/client.tsx
'use client';
import { QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { useState } from 'react';
import { makeQueryClient } from './query-client';
import type { AppRouter } from './routers/_app';

export const trpc = createTRPCReact<AppRouter>();

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === 'undefined') return makeQueryClient();
  return (browserQueryClient ??= makeQueryClient());
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [httpBatchLink({ url: '/api/trpc' })],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
```

### API Route Handler

```tsx
// src/app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/trpc/routers/_app';
import { createTRPCContext } from '@/trpc/init';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });

export { handler as GET, handler as POST };
```

### Router Base

```tsx
// src/trpc/init.ts
import { initTRPC } from '@trpc/server';

export const createTRPCContext = async (opts: { headers: Headers }) => {
  return { ...opts };
};

const t = initTRPC.context<typeof createTRPCContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
```

### Exemplo de Router

```tsx
// src/trpc/routers/submissions.ts
import { z } from 'zod';
import { publicProcedure, router } from '../init';

export const submissionsRouter = router({
  create: publicProcedure
    .input(z.object({ code: z.string(), language: z.string() }))
    .mutation(({ input, ctx }) => {
      // Implementar com Drizzle
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(({ input, ctx }) => {
      // Implementar com Drizzle
    }),
});
```

## To-Dos

- [ ] Instalar dependências: `npm install @trpc/server @trpc/client @trpc/react-query @tanstack/react-query zod`
- [ ] Criar `src/trpc/init.ts` - contexto e tRPC base
- [ ] Criar `src/trpc/query-client.ts` - QueryClient factory
- [ ] Criar `src/trpc/server.ts` - helpers para RSC
- [ ] Criar `src/trpc/client.tsx` - provider para client components
- [ ] Criar `src/trpc/routers/_app.ts` - root router
- [ ] Criar `src/trpc/routers/submissions.ts`
- [ ] Criar `src/trpc/routers/roasts.ts`
- [ ] Criar `src/trpc/routers/leaderboard.ts`
- [ ] Criar `src/app/api/trpc/[trpc]/route.ts`
- [ ] Atualizar `src/app/layout.tsx` com TRPCProvider
- [ ] Executar `npm run check` e corrigir erros

## Referências

- [tRPC + Server Components](https://trpc.io/docs/client/react/server-components)
- [TanStack Query Setup](https://trpc.io/docs/client/tanstack-react-query/setup)
