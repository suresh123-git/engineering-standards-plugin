---
disable-model-invocation: true
description: "Design database schemas (relational or document) from domain and access patterns, with constraints, indexes, migration plan and trade-offs."
argument-hint: "<feature or domain description> [postgres | mysql | mongodb | existing]"
allowed-tools: "Read, Grep, Glob, Bash(git diff:*), Bash(git log:*), Bash(git status:*), Bash(git show:*), Bash(git blame:*)"
---
# /db-design

> **Mode: read-only.** Do not create, modify or delete files unless the user explicitly asks you to apply the changes. Running side-effect-free inspection commands (git log/diff, tests, linters) is fine.
>
> **User input:** $ARGUMENTS


## Purpose

Produce a schema design that enforces invariants, supports the real access patterns and can be deployed safely: tables/collections, keys, types, constraints, relationships, indexes, and the migration path. Design only — creating migration files is `/migration`.

## Expected Input

The feature/domain, key queries and write patterns, expected volumes, retention/compliance needs, and the target database. Default to the project's existing database and ORM.

## Project Context Discovery

Run [project discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md). Additionally:

- Read the existing schema (migrations, `schema.prisma`, entities/models, SQL dumps, Mongoose schemas) and its naming, key, timestamp, soft-delete and tenancy conventions.
- Identify related tables/collections the new design must reference or not collide with.
- Determine ORM/ODM capabilities and constraints (e.g., TypeORM/Prisma migration tooling, Mongoose validation).
- Load `stack-postgresql`, `stack-mysql`, `stack-mongodb` or `stack-redis` **Design notes** as applicable.

## Applicable Standards

- [Schema design](${CLAUDE_PLUGIN_ROOT}/standards/database/schema-design.md), [indexing and queries](${CLAUDE_PLUGIN_ROOT}/standards/database/indexing-and-queries.md)
- [Transactions and integrity](${CLAUDE_PLUGIN_ROOT}/standards/database/transactions-and-integrity.md), [migration safety](${CLAUDE_PLUGIN_ROOT}/standards/database/migration-safety.md)

## Execution Steps

1. **Capture requirements**: entities, relationships and cardinalities, invariants (uniqueness, state machines), query list (with frequency and latency needs), write patterns, volumes/growth, retention, privacy/PII, multi-tenancy.
2. **Model**: logical model first (entities, attributes, relationships), then physical (tables/collections, types, keys). Justify any denormalisation or embedding with a measured/expected access pattern.
3. **Constraints**: PK/FK with `ON DELETE` behaviour, `UNIQUE`, `NOT NULL`, `CHECK`; for documents, validation schema and bounded arrays.
4. **Indexes** from the query list (composite order, partial/covering); avoid speculative indexes; estimate write cost.
5. **Consistency & transactions**: which operations need atomicity; locking/concurrency strategy; idempotency keys; outbox if publishing events.
6. **Lifecycle**: soft delete vs hard delete, archival/partitioning, audit/history, timestamps in UTC.
7. **Security**: PII classification, encryption needs, row-level security/tenant isolation, least-privilege DB roles.
8. **Migration plan**: expand → backfill → switch → contract; locking risks; rollback; estimated duration on production-sized data.
9. **Alternatives** considered (e.g., JSONB vs normalised, embedded vs referenced) and why rejected.
10. Output DDL (or schema definitions in the project's ORM syntax) as a **proposal**, plus an ER diagram in Mermaid.

## Output Format

```
## Requirements & access patterns   ## ER diagram (Mermaid)
## Schema (DDL / ORM definition, commented)
## Constraints & invariants         ## Indexes (query → index mapping)
## Consistency, concurrency & lifecycle
## Security & compliance            ## Migration plan & rollback
## Alternatives and trade-offs      ## Open questions
```

## Safety Constraints

- Design/proposal only; do not execute DDL or write migration files into the repo (use `/migration`). Never run anything against a shared or production database.
- Don't propose destructive changes to existing tables without the expand/contract plan and an explicit approval note.
- No sensitive sample data; use synthetic examples.

## Examples

```
/db-design subscriptions with plans, invoices and usage metering — postgres
/db-design product reviews for MongoDB, read-heavy
/db-design multi-tenant audit log retained for 7 years
```

## Shared Requirements

- Run [project context discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md) first and load the matching `stack-*` skills.
- Follow the [safety rules](${CLAUDE_PLUGIN_ROOT}/standards/global/safety-rules.md); audit-style output uses the [findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md).
- Project conventions override generic advice unless they cause a concrete problem; never force a framework or architecture the project does not use.

## Loading stack skills (plugin)

Skills in this plugin are user-invoked only, so read the matching stack skills as files: `${CLAUDE_PLUGIN_ROOT}/skills/stack-<name>/SKILL.md` (e.g. `stack-nestjs`, `stack-postgresql`), and core skills at `${CLAUDE_PLUGIN_ROOT}/skills/<name>/SKILL.md`. Read only those for technologies the project actually uses.
