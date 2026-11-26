---
name: "stack-mongodb"
description: "Use in projects using MongoDB or Mongoose to review and design schemas, indexes, aggregation pipelines, transactions, query performance, validation and injection safety."
---
# MongoDB

## Detect

`mongodb`, `mongoose`, `@nestjs/mongoose`, `typegoose`, `docker-compose` mongo service, connection strings `mongodb://`/`mongodb+srv://`, aggregation pipelines, Atlas config.

## Review focus

- **Schema/modelling**: embed data read together and bounded; reference unbounded/shared/independently-changing data; **no unbounded arrays**; documents far below the 16MB limit; consistent field types; `schemaVersion` for evolution; Mongoose schemas with validators, `required`, enums, `timestamps`, `strict` mode on; avoid `Mixed`.
- **Indexes**: every query shape supported (equality → sort → range order for compound indexes); ESR rule; unique indexes for business keys; TTL indexes for expiry; partial/sparse where fitting; no redundant indexes; `autoIndex` off in production (build deliberately); check with `explain("executionStats")` — avoid `COLLSCAN`, high `docsExamined/nReturned`.
- **Queries**: projections to fetch needed fields; `.lean()` for read-only Mongoose queries; pagination via range queries on indexed fields (not large `skip`); batch ops (`bulkWrite`, `insertMany`); avoid N+1 `populate` chains (use `$lookup` sparingly—it's costly—or denormalise).
- **Aggregations**: `$match` and `$project` early; use indexes at the pipeline start; avoid unbounded `$group`/`$facet` memory; `allowDiskUse` consciously; test with realistic data.
- **Consistency**: single-document atomicity by design; multi-document transactions need replica sets and cost latency — model to avoid; use `findOneAndUpdate`/`$inc`/`$set` atomic operators instead of read-modify-write; write concern/read concern (`majority`) per criticality; idempotent upserts with unique indexes.
- **Security**: **NoSQL injection** — reject object-valued inputs where scalars are expected (`{ "$ne": null }` in login), sanitise/validate (schema validation, `mongo-sanitize`), disable `$where`/server-side JS; authentication enabled; least-privilege roles; TLS; no public network exposure; field-level encryption for sensitive data where required ([input validation](${CLAUDE_PLUGIN_ROOT}/standards/security/input-validation-injection.md)).
- **Operations**: connection pooling and reuse (one client per process), timeouts (`serverSelectionTimeoutMS`, `socketTimeoutMS`), retryable writes, change streams resume tokens, backups/PITR, replica set health, sharding key choice (cardinality, monotonic keys).

## Design notes

Start from access patterns ([schema design](${CLAUDE_PLUGIN_ROOT}/standards/database/schema-design.md)); denormalise intentionally with a sync strategy; use bucket pattern for time series (or native time-series collections), outlier pattern for hot documents.

## Migration notes

Lazy/background migrations with tolerant readers; background/rolling index builds; validate with `$jsonSchema` in `moderate` before `strict` ([migration safety](${CLAUDE_PLUGIN_ROOT}/standards/database/migration-safety.md)).

## Testing conventions

`mongodb-memory-server` or Testcontainers (prefer a real MongoDB, ideally replica set if transactions are used); seed with builders; assert indexes exist; test injection payloads rejected.

## Pitfalls

Unbounded arrays; missing indexes behind sort+filter; `skip` pagination; over-use of `populate`; trusting request objects as filters; assuming transactions are free; forgetting `await` on writes.
