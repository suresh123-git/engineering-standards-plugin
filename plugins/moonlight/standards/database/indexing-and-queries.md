---
title: Indexing and Query Optimization
version: 1.0.0
---

# Indexing and Query Optimization

## Method

1. Collect the **real query** (ORM-generated SQL included), its frequency and latency (slow-query log, `pg_stat_statements`, Performance Insights, profiler).
2. Read the plan: `EXPLAIN (ANALYZE, BUFFERS)` (PostgreSQL), `EXPLAIN ANALYZE` (MySQL 8), `.explain("executionStats")` (MongoDB). Look for sequential scans on large tables, row-estimate errors, sorts spilling to disk, nested loops over large sets, high `rows examined / returned`.
3. Change one thing; re-measure. Never index blindly — each index slows writes and costs storage.

## Index design

- **B-tree composite indexes**: order columns by equality predicates first, then range, then sort; leftmost-prefix rule applies.
- Index **foreign keys** and join/filter/sort columns used by frequent queries.
- **Covering indexes** (`INCLUDE`/stored columns) to enable index-only scans for hot paths.
- **Partial indexes** for subsets (`WHERE status = 'pending'`, `WHERE deleted_at IS NULL`).
- Specialised: GIN/GiST (jsonb, full-text, arrays, trigram), BRIN (huge append-only time series), hash (equality only), MongoDB compound/TTL/text/2dsphere, multikey caveats.
- Drop **unused and duplicate** indexes (verify with usage statistics over a representative period).
- Beware: functions on indexed columns (`WHERE lower(email)=…` needs an expression index), leading wildcards `LIKE '%x'`, implicit type casts, `OR` across columns, low-selectivity indexes, `OFFSET` deep pagination.
- Create indexes **concurrently/online** on live tables (`CREATE INDEX CONCURRENTLY`, `ALGORITHM=INPLACE`).

## Query patterns

- Select only needed columns; avoid `SELECT *` in application queries.
- Replace N+1 with joins/batch loading; limit eager-loading to what is used.
- Use keyset pagination for large lists; always `ORDER BY` with a unique tiebreaker.
- Prefer set-based operations over row-by-row loops; batch inserts/updates; use `EXISTS` over `COUNT(*) > 0`.
- Keep transactions short; consistent lock ordering; `SELECT … FOR UPDATE SKIP LOCKED` for work queues.
- Parameterise all queries (also enables plan caching) — see [injection prevention](../security/input-validation-injection.md).
- Use read replicas knowingly (replication lag); cache results where staleness is acceptable.
- ORMs: inspect generated SQL; use raw/query-builder for complex reporting; avoid loading entities to update one column.

## Output for `/db-optimize`

For each query: current plan summary → bottleneck → proposed index/rewrite (DDL + SQL) → expected effect → write-cost/side-effects → how to verify and roll back.
