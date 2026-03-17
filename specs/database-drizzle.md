# Especificação - Banco de Dados com Drizzle ORM

## Visão Geral

Sistema anónimo de Code Review com persistência de dados.

## Stack

- **Banco**: PostgreSQL
- **ORM**: Drizzle ORM
- **Infra**: Docker Compose

## Estrutura do Banco

### Tabelas

> **Nota**: Não são utilizadas Foreign Keys nativas. Os joins são feitos via SQL nas queries.

#### 1. `submissions` - Códigos Submetidos

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | uuid | ID único |
| `code` | text | Código submetido |
| `language` | varchar(50) | Linguagem detectada/selecionada |
| `ip_hash` | varchar(64) | Hash do IP (para rate limit) |
| `created_at` | timestamp | Data de criação |

#### 2. `roasts` - Resultados do Roast

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | uuid | ID único |
| `submission_id` | uuid | Referência ao código (sem FK) |
| `score` | integer | Score 0-10 |
| `feedback` | text | Feedback/roast |
| `roast_type` | enum | 'brutal' ou 'friendly' |
| `badge_status` | enum | Status do badge (ver abaixo) |
| `created_at` | timestamp | Data de criação |

#### 3. `leaderboard` - Ranking

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | uuid | ID único |
| `submission_id` | uuid | Referência ao código (sem FK) |
| `author_name` | varchar(100) | Nome do autor (opcional) |
| `shame_score` | integer | Score de vergonha (inverso) |
| `rank_position` | integer | Posição no ranking |
| `created_at` | timestamp | Data de criação |

### Queries

> **Nota**: As queries utilizam SQL puro com joins manuais, sem usar o query builder do Drizzle. Veja `src/db/queries.ts`.

### Enums

```sql
CREATE TYPE roast_type AS ENUM ('brutal', 'friendly');

CREATE TYPE badge_status AS ENUM (
  'excellent',
  'good',
  'needs-improvement',
  'bad',
  'terrible'
);
```

## Docker Compose

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: devroast
      POSTGRES_PASSWORD: devroast
      POSTGRES_DB: devroast
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Rate Limiting

- **1 submissão a cada 30 segundos por IP**
- Implementado via coluna `ip_hash` e verificação em memória

## Integração com IA Externa

- Roast gerado por API externa
- Salvo na tabela `roasts` após geração

## To-Dos

- [ ] Criar arquivo `docker-compose.yml` com PostgreSQL
- [ ] Instalar dependências: `npm install drizzle-orm postgres dotenv`
- [ ] Instalar devDependencies: `npm install -D drizzle-kit`
- [ ] Criar arquivo `.env` com `DATABASE_URL`
- [ ] Criar configuração `drizzle.config.ts`
- [ ] Criar schema em `src/db/schema.ts`
- [ ] Criar cliente em `src/db/index.ts`
- [ ] Criar migrations com `drizzle-kit push`
- [ ] Criar repository/queries para submissions
- [ ] Criar repository/queries para roasts
- [ ] Criar repository/queries para leaderboard
- [ ] Implementar rate limiting (30s por IP)
- [ ] Integrar com a página de resultados
- [ ] Integrar com a página de leaderboard
- [ ] Executar `npm run check` e corrigir erros
