# Padrões de Database

## Estrutura

```
src/db/
├── schema.ts      # Definição das tabelas
├── index.ts       # Cliente Drizzle + rawQuery
├── queries.ts     # Funções de query
└── AGENTS.md     # Este arquivo
```

## Enum Valores

### badge_status (severidade)
```typescript
// valores: "critical" | "warning" | "good"
// corresponde ao frontend: severity em AnalysisCard
```

### roast_type
```typescript
// valores: "brutal" | "friendly"
```

## Conexão Lazy

Para evitar erros durante build (sem banco rodando):

```typescript
// src/db/index.ts
let client: ReturnType<typeof postgres> | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;

function getClient() {
  if (!client) {
    client = postgres(connectionString, { max: 1 });
  }
  return client;
}

export const db = {
  get insert() { return getDb().insert; },
  get select() { return getDb().select; },
  // ...
};
```

## rawQuery para SQL Puro

Para queries complexas ou agregações:

```typescript
export async function rawQuery<T>(
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  try {
    const c = getClient();
    const result = await (c as any).unsafe(sql, ...params);
    return result as T[];
  } catch (err) {
    console.error("rawQuery error:", err);
    return [];
  }
}
```

## Queries Comuns

### getMetrics (métricas da homepage)
```typescript
export async function getMetrics() {
  const sql = `
    SELECT 
      (SELECT COUNT(*) FROM submissions) as total_codes,
      (SELECT COALESCE(AVG(score), 0) FROM roasts) as avg_score
  `;
  const result = await rawQuery<{ total_codes: bigint; avg_score: number }>(sql, []);
  return result;
}
```

### getLeaderboardWithSubmissions (ranking com código)
```typescript
export async function getLeaderboardWithSubmissions(limit = 50) {
  const sql = `
    SELECT 
      l.id, l.submission_id, l.author_name, l.shame_score,
      l.rank_position, l.created_at,
      s.code, s.language
    FROM leaderboard l
    JOIN submissions s ON l.submission_id = s.id
    ORDER BY l.shame_score DESC
    LIMIT $1
  `;
  return rawQuery<{ /* ... */ }>(sql, [limit]);
}
```

## Schema - Regras

1. **UUIDs** → usar `uuid().primaryKey().defaultRandom()`
2. **Timestamps** → `timestamp("created_at").defaultNow().notNull()`
3. **Enum** → usar `pgEnum` para valores pré-definidos
4. **Sem FKs** → joins manuais via SQL (conforme spec)

## Seed

O arquivo `seed.ts` na raiz cria dados fictícios para desenvolvimento.

### Comandos
```bash
# Recriar tabelas
docker exec devroast-db psql -U devroast -d devroast -c "DROP TABLE IF EXISTS submissions CASCADE; ..."

# Executar seed
npx tsx seed.ts
```

## Score Range

- **score em roasts**: 0-10 (não 0-100)
- Isso corresponde ao display do ScoreRing (0/10)
