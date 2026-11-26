---
name: db-optimize
description: Optimise slow queries and indexes using execution plans, with verified before/after evidence and safe, online index changes.
category: database
version: 1.0.0
mode: modifying
argument-hint: "<query | repository method | endpoint | slow-query log excerpt>"
standards:
  - global/project-discovery
  - global/safety-rules
  - database/indexing-and-queries
  - database/migration-safety
  - coding/performance
skills:
  - performance-engineering
---

# /db-optimize

## Purpose

Make specific database operations faster and cheaper without changing results: rewrite queries, fix ORM access patterns, and propose (or add via migration) the right indexes — each backed by an execution plan and a measured improvement.

## Expected Input

A query/ORM call, a repository method, an endpoint, or slow-query-log entries; plus the engine and approximate table sizes if known. Without plans or timings, you'll derive hypotheses and give the commands to confirm them.

## Project Context Discovery

Run [project discovery](../../standards/global/project-discovery.md). Additionally:

- Identify DB engine/version, ORM and how queries are generated (log the SQL: Prisma `log: ['query']`, TypeORM `logging`, Sequelize `logging`, Mongoose `debug`).
- Read the schema/indexes involved and the migration workflow.
- Find realistic data access in dev/staging; never assume dev data volumes reflect production.

## Applicable Standards

- [Indexing and query optimisation](../../standards/database/indexing-and-queries.md) — method and index design
- [Migration safety](../../standards/database/migration-safety.md) — online index creation, locking
- [Performance](../../standards/coding/performance.md)

## Execution Steps

1. **Capture the exact SQL/aggregation** with real parameters, call frequency and current latency.
2. **Read the plan** (`EXPLAIN (ANALYZE, BUFFERS)` / MySQL `EXPLAIN ANALYZE` / Mongo `explain("executionStats")`) — only on **non-production** data and **never** `ANALYZE` on write statements. Identify scans, sorts, row-estimate errors, rows examined vs returned.
3. **Diagnose**: missing/unsuitable index, non-sargable predicate, N+1, over-fetching, bad join order, deep OFFSET, lock contention, stale statistics, parameter sniffing, ORM inefficiency.
4. **Choose the least invasive fix** in order: query/ORM rewrite → batching/pagination change → index → denormalisation/caching. Estimate write overhead and storage for any index.
5. **Implement**: change the code; for indexes, **create a migration** using online/concurrent syntax and `IF NOT EXISTS` patterns per the project's tooling (obtain approval before adding it).
6. **Verify**: results identical (compare row sets/counts on sample data), plan improved, latency measured before/after on comparable data; run tests.
7. **Check side effects**: write amplification, other queries that could regress or use the new index, replication lag, index build time and locking.
8. Provide rollback (drop index concurrently) and monitoring (slow query log, index usage stats).

## Output Format

```
## Query & baseline (SQL, plan summary, timing)
## Diagnosis (evidence)
## Change (code diff summary / index DDL / migration file)
## Verification (result equivalence, new plan, before/after metrics)
## Trade-offs & risks     ## Rollback & monitoring
```

## Safety Constraints

- **Approval required** before adding/dropping indexes or running migrations; never execute DDL against production or shared databases.
- Do not run `EXPLAIN ANALYZE`, load tests or heavy queries on production; do not mutate data to "test".
- Preserve result semantics (ordering, null handling, pagination stability). No speculative indexes.

## Examples

```
/db-optimize SELECT ... FROM orders WHERE customer_id = ? AND status = 'open' ORDER BY created_at DESC
/db-optimize OrdersRepository.findPage() — slow on page 500
/db-optimize db.events.aggregate([...]) takes 8s
```
