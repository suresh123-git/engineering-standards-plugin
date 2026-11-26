---
title: Database Schema Design
version: 1.0.0
---

# Database Schema Design

Start from access patterns and invariants. Work with the project's database and ORM; relational guidance first, document-store guidance after.

## Relational

- **Model the domain**: tables for entities, join tables for many-to-many (with their own attributes), reference tables for stable enumerations when values need metadata.
- **Keys**: stable surrogate primary key (`bigint` identity or UUIDv7/ULID for distributed/insert-friendly ids); natural keys as `UNIQUE` constraints. Avoid composite PKs on mutable data.
- **Types**: exact types (`numeric(p,s)` for money — never float; `timestamptz`/UTC for instants; `boolean`; `uuid`; `jsonb` only for genuinely schemaless attributes). Right-size strings; use `CHECK`/enum for closed sets.
- **Constraints are the last line of defence**: `NOT NULL` by default, `UNIQUE`, `CHECK`, foreign keys with deliberate `ON DELETE` (restrict by default; cascade only for owned children; soft-delete where history matters).
- **Normalisation**: design to 3NF to remove update anomalies; **denormalise deliberately** for measured read performance (summary columns, materialised views, read models) with a documented sync strategy.
- **Naming**: consistent case (`snake_case`), plural or singular tables per project norm, `<table>_id` FKs, `created_at/updated_at` audit columns; no reserved words.
- **Multi-tenancy**: choose (row-level `tenant_id` + RLS / schema-per-tenant / DB-per-tenant) and enforce in every unique index and query.
- **Soft deletes / history**: partial unique indexes (`WHERE deleted_at IS NULL`); consider temporal/audit tables for regulated data.
- **PII**: classify; minimise; encrypt at rest/column-level where required; plan erasure.

## Document stores (MongoDB etc.)

- Embed what is read together and bounded; reference what is unbounded, shared or independently updated.
- Avoid unbounded arrays and documents approaching size limits; use bucket/outlier patterns.
- Define schema validation (`$jsonSchema`) and indexes for every query shape.
- Keep write atomicity in one document where possible; use transactions sparingly.

## Key-value / cache stores

Namespaced keys with TTLs, bounded value sizes, explicit data-structure choice, no sole source of truth unless designed for it.

## Review checklist

- [ ] Every table has a PK; FKs indexed; constraints express invariants
- [ ] Money/time types correct; timestamps UTC
- [ ] Nullable columns justified; defaults sensible
- [ ] Delete/retention behaviour defined
- [ ] Access patterns have supporting indexes; no redundant indexes
- [ ] Changes are deployable via safe migration ([migration safety](migration-safety.md))
