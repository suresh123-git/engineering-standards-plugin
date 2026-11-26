---
disable-model-invocation: true
description: "Design REST or GraphQL APIs — resources, contracts, errors, pagination, versioning, security and an OpenAPI/SDL draft — consistent with existing conventions."
argument-hint: "<capability to expose | resource | feature> [REST | GraphQL]"
allowed-tools: "Read, Grep, Glob, Bash(git diff:*), Bash(git log:*), Bash(git status:*), Bash(git show:*), Bash(git blame:*)"
---
# /api-design

> **Mode: read-only.** Do not create, modify or delete files unless the user explicitly asks you to apply the changes. Running side-effect-free inspection commands (git log/diff, tests, linters) is fine.
>
> **User input:** $ARGUMENTS


## Purpose

Design an API surface that is consistent, secure, evolvable and easy to consume: resource model, endpoints (or schema), request/response shapes, error model, pagination/filtering/sorting, idempotency, rate limits, versioning and documentation. Produces a contract draft; implementation is separate.

## Expected Input

The capability to expose, the consumers (web, mobile, partners, internal services), and style (REST/GraphQL). If the project already has an API, follow its style unless you can show a concrete problem.

## Project Context Discovery

Run [project discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md). Additionally:

- Read existing API conventions: URL patterns, casing, envelope vs bare responses, error format, auth scheme, pagination style, versioning, OpenAPI/SDL files and DTOs.
- Identify the domain entities/tables involved and which fields are internal-only.
- Check consumer constraints (mobile bandwidth, partner SLAs, backward compatibility promises).
- Load `stack-graphql`, `stack-nestjs`, `stack-express` **API conventions** as applicable.

## Applicable Standards

- [REST design](${CLAUDE_PLUGIN_ROOT}/standards/api/rest-design.md), [pagination/filtering/sorting/versioning](${CLAUDE_PLUGIN_ROOT}/standards/api/pagination-filtering-sorting.md)
- [Idempotency and rate limiting](${CLAUDE_PLUGIN_ROOT}/standards/api/idempotency-rate-limiting.md), [OpenAPI](${CLAUDE_PLUGIN_ROOT}/standards/api/openapi-documentation.md)
- [Authn/authz](${CLAUDE_PLUGIN_ROOT}/standards/security/authn-authz-sessions-jwt.md), [input validation](${CLAUDE_PLUGIN_ROOT}/standards/security/input-validation-injection.md)

## Execution Steps

1. **Clarify use cases** and consumers; list operations as user-level tasks.
2. **Model resources** (REST) or types/queries/mutations (GraphQL) from the domain; decide ownership, relationships, and what must **not** be exposed.
3. **Define operations**: method + path (or field), purpose, idempotency, auth/permission required, rate-limit class.
4. **Specify contracts**: request schema with validation rules, response schema, status codes, error responses (one consistent model), headers (pagination, `Location`, caching/`ETag`).
5. **Collections**: pagination (cursor vs offset), filter and sort allow-lists, max page size, default ordering.
6. **Evolvability**: additive-change policy, versioning approach consistent with the project, deprecation process, tolerant-reader guidance.
7. **Security & abuse**: object-level authorisation rules, mass-assignment protection, size limits, rate limiting, idempotency keys for unsafe retries, audit events.
8. **Async/long-running**: `202` + status resource or webhooks/events; webhook signing and retry semantics.
9. **Document**: produce an OpenAPI 3.1 (or SDL) snippet for the new surface and 2–3 example exchanges; list contract tests to add.
10. Call out decisions and alternatives (consider an [ADR](${CLAUDE_PLUGIN_ROOT}/templates/adr.md)).

## Output Format

```
## Use cases & consumers   ## Resource/type model
## Endpoint table (method | path | purpose | auth | idempotent | notes)
## Schemas and examples    ## Error model and status codes
## Pagination/filter/sort  ## Versioning & compatibility plan
## Security & rate limits  ## OpenAPI/SDL draft (fenced block)
## Open questions & decisions
```

## Safety Constraints

- Design only; do not modify code or specs unless asked. If writing the spec to a file is requested, place it where the project keeps API docs.
- Never design endpoints that expose internal ids/fields, secrets or unrestricted queries; no unauthenticated mutating endpoints without justification.
- Don't break existing contracts: new behaviour must be additive or versioned.

## Examples

```
/api-design invoices: list, retrieve, create, void — REST
/api-design GraphQL schema for the product catalog with filtering
/api-design webhook delivery for order events with retries
```

## Shared Requirements

- Run [project context discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md) first and load the matching `stack-*` skills.
- Follow the [safety rules](${CLAUDE_PLUGIN_ROOT}/standards/global/safety-rules.md); audit-style output uses the [findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md).
- Project conventions override generic advice unless they cause a concrete problem; never force a framework or architecture the project does not use.

## Loading stack skills (plugin)

Skills in this plugin are user-invoked only, so read the matching stack skills as files: `${CLAUDE_PLUGIN_ROOT}/skills/stack-<name>/SKILL.md` (e.g. `stack-nestjs`, `stack-postgresql`), and core skills at `${CLAUDE_PLUGIN_ROOT}/skills/<name>/SKILL.md`. Read only those for technologies the project actually uses.
