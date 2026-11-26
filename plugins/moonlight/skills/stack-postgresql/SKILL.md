---
name: "stack-postgresql"
description: "Use in projects using PostgreSQL (pg, Prisma/TypeORM/Sequelize/Knex with postgres) to review schemas, indexes, query plans, transactions, locking, migrations and connection management."
---
# PostgreSQL

## Detect

`pg`, `postgres`, `pg-promise`, Prisma/TypeORM/Sequelize/Knex/Drizzle with a `postgresql` provider, `docker-compose` postgres service, `*.sql`/migrations, `DATABASE_URL=postgres://`.

## Review focus

- **Types & constraints**: `timestamptz` (not `timestamp`) in UTC; `numeric` for money; `uuid`/`bigint identity` PKs; `text` with `CHECK` over arbitrary `varchar(n)`; `jsonb` for flexible attributes (indexed with GIN where queried); enums vs lookup tables; FKs with deliberate `ON DELETE`; `NOT NULL`/`UNIQUE`/`CHECK` as invariants.
- **Indexes**: B-tree composite order (equality → range/sort); partial indexes (`WHERE deleted_at IS NULL`); covering (`INCLUDE`); expression indexes (`lower(email)`); GIN for jsonb/array/full-text (`tsvector`), `pg_trgm` for fuzzy `LIKE`; BRIN for huge append-only; **index every FK** used in joins/deletes; drop unused (`pg_stat_user_indexes`).
- **Plans**: `EXPLAIN (ANALYZE, BUFFERS)` on non-production data — look for Seq Scan on big tables, bad row estimates (run `ANALYZE`), Sort/Hash spills, nested loops over large sets; `pg_stat_statements` for top queries.
- **Transactions & isolation**: default `READ COMMITTED`; use `SERIALIZABLE`/`REPEATABLE READ` with retries or explicit locks (`SELECT … FOR UPDATE [SKIP LOCKED]`) for invariants; avoid idle-in-transaction; set `statement_timeout`, `lock_timeout`, `idle_in_transaction_session_timeout`; advisory locks for singletons; `INSERT … ON CONFLICT` for idempotent upserts.
- **Migrations**: `CREATE INDEX CONCURRENTLY` (outside transaction); add constraints `NOT VALID` then `VALIDATE`; add columns nullable first; avoid table rewrites (type changes) on large tables; batch backfills; `lock_timeout` on DDL ([migration safety](${CLAUDE_PLUGIN_ROOT}/standards/database/migration-safety.md)).
- **Connections**: pool sizing (pool ≤ DB `max_connections` across all instances); PgBouncer/RDS Proxy for serverless/many clients (transaction pooling caveats with prepared statements/session state); close/release clients; SSL required.
- **Maintenance**: autovacuum health and bloat, long-running transactions blocking vacuum, partitioning for very large time-series tables, `VACUUM`/`ANALYZE` after bulk loads.
- **Security**: parameterised queries only; least-privilege roles (app role without DDL); Row-Level Security for multi-tenancy where used; `SECURITY DEFINER` function risks; secrets and TLS ([secrets](${CLAUDE_PLUGIN_ROOT}/standards/security/secrets-management.md)).

## Design notes

Prefer relational modelling with constraints; use `jsonb` sparingly; plan partitioning/archival early for event tables; read replicas with lag awareness; logical replication/CDC for integration (outbox pattern).

## Testing conventions

Real PostgreSQL via Testcontainers/docker-compose (not SQLite substitutes) for repository/integration tests; transaction-per-test rollback or truncate between tests; test constraints and concurrency (two sessions) for critical invariants.

## Pitfalls

`timestamp` without zone; floats for money; `OFFSET` deep paging; missing FK indexes; `SELECT *` with jsonb blobs; long transactions around API calls; unbounded pools; `CREATE INDEX` without `CONCURRENTLY` on live tables.
