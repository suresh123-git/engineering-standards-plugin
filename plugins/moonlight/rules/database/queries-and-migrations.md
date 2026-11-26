---
name: queries-and-migrations
description: Conventions for SQL, ORM entities, repositories and migrations — safe, backward-compatible schema changes and efficient parameterised queries.
scope: glob
globs: ["**/migrations/**", "**/*.sql", "**/*.entity.ts", "**/*.repository.ts", "**/schema.prisma", "**/models/**"]
version: 1.0.0
---

# Queries and Migrations

- Parameterised queries only; allow-list dynamic identifiers (sort columns).
- Avoid N+1, `SELECT *`, unbounded results and deep `OFFSET`; index what you filter, join and sort on.
- Multi-step invariants run in one short transaction; no network calls inside; handle deadlock/serialisation retries.
- Migrations are backward compatible (expand → backfill → contract), lock-aware, and never edited after merge.
- **Never** run migrations against shared/production databases or drop/truncate data without explicit approval and a verified backup.
- Money as exact decimal; timestamps in UTC with time zone; constraints (`NOT NULL`, `UNIQUE`, FK, `CHECK`) express invariants.

Details: [schema design](../../standards/database/schema-design.md) · [indexing](../../standards/database/indexing-and-queries.md) · [migration safety](../../standards/database/migration-safety.md)
