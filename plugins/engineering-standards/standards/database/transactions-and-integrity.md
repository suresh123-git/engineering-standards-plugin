---
title: Transactions and Data Integrity
version: 1.0.0
---

# Transactions and Data Integrity

## Transactions

- Wrap **multi-statement invariants** in one transaction; keep it short; no network/API calls or user waits inside.
- Know the isolation level in use. `READ COMMITTED` (PostgreSQL default) permits non-repeatable reads and write skew; use `REPEATABLE READ`/`SERIALIZABLE` with retry-on-serialization-failure, or explicit locking, where invariants span rows.
- **Prevent lost updates**: optimistic locking (version column / `ETag`), `SELECT … FOR UPDATE`, atomic updates (`UPDATE … SET qty = qty - 1 WHERE qty > 0`), or unique constraints.
- Deadlocks: acquire locks in a consistent order; retry deterministically; keep transactions small.
- **Idempotent writes**: upserts (`ON CONFLICT`), unique business keys, dedupe tables for message consumers.
- **Cross-service consistency**: no distributed transactions by default. Use the **transactional outbox** + idempotent consumers, sagas with compensations, and reconciliation jobs.
- ORMs: ensure the unit of work boundary matches the use case; beware auto-commit and lazy loading outside a transaction.
- MongoDB: single-document operations are atomic; multi-document transactions require replica sets and have cost — model data to avoid them.

## Integrity

- Enforce invariants in the database (constraints) **and** application code; DB constraints are authoritative.
- Referential integrity via foreign keys unless there is a documented reason (sharding, cross-service) — then add reconciliation checks.
- Validate and canonicalise data at write time (trim, case, normalise) so uniqueness works.
- Use `CHECK`s for ranges/states; state machines as allowed-transition tables or guarded updates.
- Time: store UTC; avoid relying on app server clocks for ordering — use DB time or monotonic versions.
- Backups, point-in-time recovery and **tested restores**; retention and deletion policies; audit trails for sensitive entities.
- Soft-delete queries must always filter; prefer views or ORM scopes to avoid leaks.

## Review checklist

- [ ] Read-modify-write sequences protected (lock, version, atomic SQL)
- [ ] No external calls inside transactions
- [ ] Retry logic for serialization/deadlock errors
- [ ] Unique constraints back every "should be unique" rule
- [ ] Consumer idempotency and outbox for cross-service events
