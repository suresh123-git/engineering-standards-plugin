---
title: Migration Safety
version: 1.0.0
---

# Migration Safety

Schema changes are deployed while old and new application versions run side by side. Design every migration to be **backward compatible, reversible or forward-fixable, and lock-aware**.

## Principles

1. **Expand → migrate → contract.** Add the new structure; dual-write/backfill; switch reads; remove the old structure in a *later* release.
2. One logical change per migration; migrations are immutable once merged/applied; never edit history — add a new migration.
3. Migrations are **idempotent where possible** and tested on a copy of production-sized data.
4. Provide a rollback (`down`) or an explicit forward-fix plan; destructive steps (drop/truncate/column type narrowing) need **explicit approval** and a verified backup.
5. Separate **schema** migrations from **data** migrations (backfills run in batches, throttled, resumable, outside long transactions).

## Risky operations and safer approaches (PostgreSQL / MySQL)

| Operation | Risk | Safer approach |
|---|---|---|
| Add column `NOT NULL` without default | Fails or rewrites table | Add nullable → backfill in batches → add `NOT NULL` (PG: `CHECK … NOT VALID` then `VALIDATE`) |
| Add column with volatile default (old PG/MySQL) | Table rewrite | Add nullable, set default, backfill |
| Create index | Blocks writes | `CREATE INDEX CONCURRENTLY` / `ALGORITHM=INPLACE, LOCK=NONE` |
| Add foreign key / unique | Long validation lock | `NOT VALID` + `VALIDATE CONSTRAINT`; build unique index concurrently first |
| Rename column/table | Breaks running code | Add new, dual-write, migrate, drop old later |
| Change column type | Rewrite/lock | New column + backfill + swap |
| Drop column/table | Irreversible; old code may still read | Stop reads/writes first; deploy; drop in later release after backup |
| Large `UPDATE/DELETE` | Locks, bloat, replica lag | Batch with `LIMIT`/key ranges, sleep between batches |
| Enum/`CHECK` change | Lock | Add new value first; remove later |

Set `lock_timeout` and `statement_timeout` for DDL; fail fast rather than queue behind long transactions.

## MongoDB

Version documents (`schemaVersion`), write tolerant readers, lazy/background migration, build indexes in background/rolling on replica sets, validate with `$jsonSchema` in `moderate` mode before `strict`.

## Review checklist

- [ ] Compatible with currently deployed app version (and next)
- [ ] No long exclusive locks; DDL has timeouts
- [ ] Backfill batched and resumable
- [ ] Rollback or forward-fix documented; backup verified for destructive steps
- [ ] Tested on realistic data volume; execution time estimated
- [ ] Deploy order stated (migrate-then-deploy vs deploy-then-migrate)
