---
name: "stack-graphql"
description: "Use in GraphQL projects (graphql, Apollo, GraphQL Yoga, NestJS GraphQL, .graphql files) for schema design, resolver performance (N+1), authorization, query-cost protection and error handling."
---
# GraphQL

## Detect

`graphql`, `@apollo/server`, `graphql-yoga`, `@nestjs/graphql`, `type-graphql`, `pothos`, `*.graphql`/`schema.gql`, `dataloader`, codegen config.

## Review focus

- **Schema design**: domain-oriented types (not DB tables); nullability deliberate (non-null only when guaranteed); input types per mutation; payload types with `userErrors`/union results for expected failures; enums; custom scalars (DateTime, ID); consistent naming; deprecate with `@deprecated(reason)` instead of versioning.
- **N+1 & performance**: per-field resolvers hitting DB → **DataLoader** (per-request instance, batching and caching keyed correctly) or join/lookahead; avoid loading entire collections; watch `@ResolveField` in NestJS.
- **Pagination**: Relay connections (`first/after`, `edges/pageInfo`) with max page size; no unbounded lists.
- **AuthN/AuthZ**: authentication in context; **field- and object-level authorisation** (directives/guards/middleware) — authorise in resolvers/services, not just at the query root; no data leaks through nested relations.
- **Query abuse protection**: depth limit, complexity/cost analysis, persisted queries/allow-listing for public APIs, request size limits, rate limiting, timeouts; disable introspection/playground in production when appropriate.
- **Errors**: use `GraphQLError` with `extensions.code`; mask internal errors (`formatError`); don't leak stack traces; expected domain failures as typed results.
- **Mutations**: idempotency for retried mutations ([idempotency](${CLAUDE_PLUGIN_ROOT}/standards/api/idempotency-rate-limiting.md)); input validation (class-validator/zod); transactional integrity.
- **Subscriptions**: auth on connection and per event; backpressure and resource cleanup.
- **Federation/gateway** (if used): ownership of entities, `@key` resolvers efficiency, schema composition checks in CI.

## API conventions

Evolve schema additively; schema registry/diff checks (`graphql-inspector`) in CI; generate types with codegen; keep SDL as source of truth or generated artefact committed consistently with project practice.

## Implementation conventions

Thin resolvers → services; one DataLoader factory per request in context; map domain errors to GraphQL errors centrally; avoid exposing DB ids if enumeration matters (global ids).

## Testing conventions

Execute operations against the schema in-process (`server.executeOperation`/`yoga.fetch`) with test context; test authorisation per field, error shapes, pagination bounds, and DataLoader batching (query counts).

## Pitfalls

Authorising only top-level fields; DataLoader shared across requests (stale/leaky cache); unlimited depth/aliases enabling DoS; returning `null` for errors silently; schema-first/code-first drift.
