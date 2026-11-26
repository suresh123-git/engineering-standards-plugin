---
description: "Review schemas, relationships, constraints and queries for correctness, integrity and efficiency, with evidence from the code and query plans."
argument-hint: "<schema files | migrations | repository/query code | table names>"
allowed-tools: "Read, Grep, Glob, Bash(git diff:*), Bash(git log:*), Bash(git status:*), Bash(git show:*), Bash(git blame:*)"
---
# /db-review

> **Mode: read-only.** Do not create, modify or delete files unless the user explicitly asks you to apply the changes. Running side-effect-free inspection commands (git log/diff, tests, linters) is fine.
>
> **User input:** $ARGUMENTS


## Purpose

Audit data-layer design and usage: schema quality, relationships, constraints, index coverage, query patterns, transaction boundaries, and data-integrity risks. Reports concrete defects and inefficiencies with impact and fixes.

## Expected Input

Schema/migration files, entity/model definitions, repository/query code, or a list of tables/collections. Optionally slow-query logs or `EXPLAIN` output.

## Project Context Discovery

Run [project discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md). Additionally:

- Identify DB engine/version, ORM/ODM, migration tool and where schema truth lives.
- Gather the **actual queries**: search repositories, services, raw SQL, query builders, aggregation pipelines; note hot paths and frequency from logs/metrics if available.
- Read schema conventions (naming, keys, timestamps, soft delete, tenancy).

## Applicable Standards

- [Schema design](${CLAUDE_PLUGIN_ROOT}/standards/database/schema-design.md), [indexing and queries](${CLAUDE_PLUGIN_ROOT}/standards/database/indexing-and-queries.md)
- [Transactions and integrity](${CLAUDE_PLUGIN_ROOT}/standards/database/transactions-and-integrity.md), [migration safety](${CLAUDE_PLUGIN_ROOT}/standards/database/migration-safety.md)
- [Findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md)

## Execution Steps

1. Map entities and relationships (ER overview); note ownership and cardinalities.
2. **Schema review**: missing PK/FK/unique/check/not-null; wrong types (float money, naive timestamps, oversized strings); nullable abuse; EAV/JSON misuse; unbounded arrays/documents; inconsistent naming; orphan-prone relationships; delete behaviour; multi-tenant leakage.
3. **Index review**: FKs and filters without indexes, composite order mismatches, redundant/unused indexes, missing partial/covering indexes, low-selectivity indexes, index bloat risk.
4. **Query review**: N+1, `SELECT *`, unbounded results, offset pagination on large sets, functions on indexed columns, leading-wildcard `LIKE`, implicit casts, ORM over-fetching, per-row loops, missing batching, unparameterised SQL (security).
5. **Transaction review**: missing transactions around multi-step invariants, long transactions, external calls inside transactions, lost-update/write-skew risks, lock ordering, retry on deadlock/serialisation errors.
6. **Integrity & operations**: constraints vs app-only validation, soft-delete leaks, retention/PII, backup/restore evidence, migration safety of pending changes.
7. If plans/logs are provided or runnable safely (non-prod, read-only), analyse `EXPLAIN` output; otherwise label index/perf findings as **unverified** and supply the exact `EXPLAIN` command.
8. Prioritise by data-loss/correctness risk first, then performance at realistic scale.

## Output Format

Shared findings format (category: database) with **DDL/query fix** examples; plus an ER summary, an index coverage table (query → supporting index → status), and a prioritised remediation list (note which fixes require a safe migration).

## Safety Constraints

- Read-only. Never connect to or run queries against production; use local/dev read-only access only if provided and explicitly allowed. `EXPLAIN ANALYZE` executes the query — do not run it on data-modifying statements or production.
- No DDL/DML execution, no index creation, no data export containing real personal data.
- Redact credentials from connection strings.

## Examples

```
/db-review prisma/schema.prisma
/db-review src/orders/orders.repository.ts
/db-review migrations/ — are the pending migrations safe?
```

## Shared Requirements

- Run [project context discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md) first and load the matching `stack-*` skills.
- Follow the [safety rules](${CLAUDE_PLUGIN_ROOT}/standards/global/safety-rules.md); audit-style output uses the [findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md).
- Project conventions override generic advice unless they cause a concrete problem; never force a framework or architecture the project does not use.
