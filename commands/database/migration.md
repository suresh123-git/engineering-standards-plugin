---
name: migration
description: Review and create safe, backward-compatible database migrations with lock analysis, backfill strategy, rollback and deploy ordering.
category: database
version: 1.0.0
mode: modifying
argument-hint: "<schema change description | existing migration to review>"
standards:
  - global/project-discovery
  - global/safety-rules
  - database/migration-safety
  - database/schema-design
  - database/transactions-and-integrity
skills:
  - performance-engineering
  - code-review
---

# /migration

## Purpose

Write new migrations — or review existing/pending ones — so that deploys are safe: no long locks, no incompatibility with the running application version, reversible or forward-fixable, and verified on realistic data. **It never applies migrations to shared environments.**

## Expected Input

A change request ("add `deleted_at` to projects", "split `name` into first/last"), or a migration file/PR to review. State the engine and migration tool if not discoverable.

## Project Context Discovery

Run [project discovery](../../standards/global/project-discovery.md). Additionally:

- Identify migration tooling and conventions: Prisma Migrate, TypeORM, Sequelize, Knex, Flyway, Liquibase, Alembic, Rails, `golang-migrate`; naming/timestamp format, up/down policy, how CI/CD runs migrations.
- Read the latest migrations and current schema; check pending/unapplied ones.
- Determine deploy topology: do old and new app versions overlap (rolling/blue-green)? Are migrations run before or after the deploy?
- Estimate table sizes/row counts if available.

## Applicable Standards

- [Migration safety](../../standards/database/migration-safety.md) — risky-operation table, expand/contract
- [Schema design](../../standards/database/schema-design.md), [transactions and integrity](../../standards/database/transactions-and-integrity.md)

## Execution Steps

**When creating:**
1. Restate the change and its compatibility requirement: *old app + new schema* and *new app + old schema* must both work during rollout.
2. Decompose into **expand → backfill → switch → contract** releases; contract (drops/renames) is a *later* migration/release and needs approval.
3. Write the migration in the project's tool/format and naming; make it idempotent where possible; add `lock_timeout`/`statement_timeout` for DDL; use concurrent/online index creation; batch backfills in a separate, resumable job/script.
4. Write the **down/rollback** (or document forward-fix) and the data-backfill verification query.
5. Add/adjust application code only if requested (dual-write/read switch); otherwise describe it.
6. Validate locally on a disposable database: apply, run tests, roll back, re-apply; report timing on seeded volume.

**When reviewing:** run the migration-safety table over each statement; report locks, rewrites, compatibility breaks, missing rollback, ordering problems, data-loss risks; use the shared findings format.

## Output Format

- **Plan**: release-by-release steps (expand/backfill/switch/contract) with deploy order
- **Migration files** created (paths) and their contents summary
- **Risk analysis** per statement (lock level, duration estimate, rewrite?)
- **Rollback / forward-fix plan** and verification queries
- **Validation results** from the local run; open items needing approval

## Safety Constraints

- **Never run migrations against staging/production or any shared database.** Local disposable DBs only.
- **Explicit approval** before any destructive step (DROP, TRUNCATE, type narrowing, deleting data) and before writing the contract phase.
- Never edit or reorder already-applied/merged migrations; add new ones.
- Backups verified before destructive changes; no real personal data in fixtures.

## Examples

```
/migration add nullable archived_at to invoices and backfill from status
/migration review migrations/20261125_add_unique_email.ts
/migration rename users.fullname to users.display_name without downtime
```
