---
name: "stack-mysql"
description: "Use in projects using MySQL or MariaDB (mysql2, ORMs with mysql provider) to review schemas, InnoDB indexing, query plans, transactions/locking, online DDL and connection handling."
---
# MySQL / MariaDB

## Detect

`mysql`, `mysql2`, `mariadb` drivers, Sequelize/TypeORM/Prisma/Knex with `mysql`, `docker-compose` mysql/mariadb service, `DATABASE_URL=mysql://`. Identify version (5.7 vs 8.x differ: CTEs, window functions, `EXPLAIN ANALYZE`, instant DDL) and storage engine (InnoDB expected).

## Review focus

- **Schema**: InnoDB; `utf8mb4` + `utf8mb4_0900_ai_ci`/project collation (not `utf8`); `DATETIME`/`TIMESTAMP` semantics understood (store UTC; `TIMESTAMP` 2038 limit/time-zone conversion); `DECIMAL` for money; compact PKs (InnoDB clusters on PK, secondary indexes embed it—avoid random UUID v4 PKs on huge tables; prefer sequential/ordered ids or binary(16) UUIDv7); `NOT NULL` + defaults; FKs with indexes; strict `sql_mode` (`STRICT_TRANS_TABLES`, `ONLY_FULL_GROUP_BY`).
- **Indexes**: composite leftmost-prefix; covering indexes; prefix indexes for long text; avoid functions on indexed columns (functional indexes exist in 8.0.13+); watch low-selectivity indexes; check with `EXPLAIN`/`EXPLAIN ANALYZE` (8.0.18+): `type=ALL`, `Using filesort`, `Using temporary`, high `rows`; `performance_schema`/slow query log for hot queries.
- **Queries**: avoid `SELECT *`, N+1, deep `OFFSET`; implicit type casts (string vs int comparisons) defeat indexes; use keyset pagination; batch inserts (`INSERT … VALUES (...),(...)`), `INSERT … ON DUPLICATE KEY UPDATE` for idempotency.
- **Transactions & locking**: default `REPEATABLE READ` with gap/next-key locks → deadlocks and lock waits; keep transactions short; consistent row access order; handle deadlock errors (1213) with retry; `SELECT … FOR UPDATE [SKIP LOCKED]` for queues; avoid autocommit surprises with ORMs.
- **Migrations**: online DDL (`ALGORITHM=INPLACE/INSTANT`, `LOCK=NONE`) where supported; for big tables use `gh-ost`/`pt-online-schema-change`; metadata-lock pileups from long transactions; replication-aware changes ([migration safety](${CLAUDE_PLUGIN_ROOT}/standards/database/migration-safety.md)).
- **Connections**: pool sizing vs `max_connections`; `wait_timeout` alignment with pool idle timeouts (avoid "server has gone away"); TLS; prepared statements; ProxySQL/RDS Proxy as needed.
- **Replication/HA**: replica lag-aware reads, failover handling, semi-sync/Group Replication specifics, backups (`mysqldump` consistency, XtraBackup/snapshots) with restore tests.
- **Security**: parameterised queries; least-privilege accounts; no `root` for the app; `local_infile` off; secrets/TLS.

## Testing conventions

Real MySQL/MariaDB via Testcontainers matching production version; verify collation/case-sensitivity and strict-mode behaviour; test deadlock retry paths.

## Pitfalls

`utf8` (3-byte) charset; non-sargable predicates from implicit casts; huge transactions causing lag; `ORDER BY RAND()`; `GROUP BY` relying on non-strict mode; timezone assumptions in `TIMESTAMP`; adding indexes on live big tables without online DDL tooling.
