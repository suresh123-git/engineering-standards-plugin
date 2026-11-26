---
description: "Review an existing API for consistency, standards compliance, security, compatibility and documentation accuracy, with ranked findings."
argument-hint: "<controllers dir | openapi file | endpoint | PR range>"
allowed-tools: "Read, Grep, Glob, Bash(git diff:*), Bash(git log:*), Bash(git status:*), Bash(git show:*), Bash(git blame:*)"
---
# /api-review

> **Mode: read-only.** Do not create, modify or delete files unless the user explicitly asks you to apply the changes. Running side-effect-free inspection commands (git log/diff, tests, linters) is fine.
>
> **User input:** $ARGUMENTS


## Purpose

Audit an API (implementation and contract) for inconsistencies, misuse of HTTP semantics, security gaps, breaking changes and documentation drift. Judges against the **project's own conventions first**, then the shared API standards.

## Expected Input

A controller/resolver directory, an OpenAPI/SDL file, a specific endpoint, or a PR/range (then focus on contract changes and compatibility).

## Project Context Discovery

Run [project discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md). Additionally:

- Enumerate all endpoints/operations from code (routes, decorators, resolvers) and from the spec; **diff the two**.
- Extract the de-facto conventions: naming, casing, envelope, error format, pagination, auth, versioning.
- Find DTO/validation classes, serializers/mappers, middleware/guards, rate limiters and API tests.
- For a PR range: run an OpenAPI diff if tooling exists (`oasdiff`) or compare manually.

## Applicable Standards

- [REST design](${CLAUDE_PLUGIN_ROOT}/standards/api/rest-design.md), [pagination etc.](${CLAUDE_PLUGIN_ROOT}/standards/api/pagination-filtering-sorting.md), [idempotency/rate limiting](${CLAUDE_PLUGIN_ROOT}/standards/api/idempotency-rate-limiting.md), [OpenAPI](${CLAUDE_PLUGIN_ROOT}/standards/api/openapi-documentation.md)
- [OWASP Top 10](${CLAUDE_PLUGIN_ROOT}/standards/security/owasp-top-10.md) (API-relevant: BOLA/IDOR, mass assignment, excessive data exposure)
- [Findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md)

## Execution Steps

1. Build the endpoint inventory (method, path, auth, request/response types, status codes).
2. **Consistency**: naming, plurality, casing, envelope, error shape, date/money formats, pagination/filter/sort — flag deviations from the dominant convention (not from your preferences).
3. **HTTP semantics**: correct methods and idempotency, status codes (no 200-with-error), `Location`/`Retry-After`, caching headers, content negotiation.
4. **Security**: authN/authZ on every operation, object-level checks, tenant isolation, mass assignment, response over-exposure (internal fields, PII), rate limits, input limits, CORS, verbose errors.
5. **Validation & errors**: schema validation at boundary, uniform error model, no stack traces, correct 4xx vs 5xx.
6. **Scalability**: unbounded collections, missing pagination, N+1 in resolvers/serializers, expensive filters without indexes, GraphQL depth/complexity limits.
7. **Compatibility**: breaking vs additive changes (removed/renamed fields, tightened validation, changed semantics); deprecation handling; versioning consistency.
8. **Documentation**: spec ↔ implementation drift, missing responses/examples, undocumented endpoints.
9. **Tests**: contract/integration coverage of key operations and error cases.
10. Produce findings; avoid reporting taste-level differences.

## Output Format

Shared findings format + an **endpoint inventory table** and a **consistency matrix** (convention | dominant usage | deviations). Conclude with a compatibility verdict for PR reviews: *non-breaking / breaking (list)*.

## Safety Constraints

- Read-only; do not call live endpoints or send requests to production/third-party systems.
- Don't rewrite the API style to personal taste; recommend changes only with concrete impact.
- Redact tokens/keys found in specs/examples.

## Examples

```
/api-review src/modules/**/controllers
/api-review openapi.yaml
/api-review main..HEAD — did we break any consumers?
```

## Shared Requirements

- Run [project context discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md) first and load the matching `stack-*` skills.
- Follow the [safety rules](${CLAUDE_PLUGIN_ROOT}/standards/global/safety-rules.md); audit-style output uses the [findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md).
- Project conventions override generic advice unless they cause a concrete problem; never force a framework or architecture the project does not use.
