---
title: OpenAPI Documentation
version: 1.0.0
---

# OpenAPI Documentation

## Source of truth

- Keep an OpenAPI 3.0/3.1 document in the repo (`openapi.yaml`) or generate it from code **and commit/publish the output** (NestJS `@nestjs/swagger`, `tsoa`, FastAPI, springdoc). Pick code-first or design-first and stay consistent; follow what the project already does.
- Lint in CI (Spectral or Redocly) and diff against the previous version to catch breaking changes (`oasdiff`).

## What every operation includes

- `operationId` (unique, verb-noun), `summary`, `description` (business meaning, side effects, idempotency).
- `tags`, parameters with schema, constraints and examples, request body schema, **all** response codes (success + each error class) with schemas, and `security` requirements.
- Reusable `components`: schemas, parameters, responses (`Error`, `Pagination`), securitySchemes.
- Realistic `example`/`examples`; `deprecated: true` with migration notes when sunsetting.

## Schema quality

- `required` accurate; `nullable`/`type: [x, 'null']` correct for the version; `format`, `minLength/maxLength`, `pattern`, `enum`, `minimum/maximum` populated to mirror runtime validation.
- Avoid `additionalProperties: true` unless intended; avoid anonymous inline schemas repeated across operations.
- Consistent naming and casing; one error schema (see [REST design](rest-design.md)).

## Process

- Update the spec in the same PR as the behaviour change.
- Generate client SDKs/mocks and contract tests from the spec where useful.
- Publish rendered docs (Redoc/Swagger UI) per environment/version.

## Review checklist

- [ ] Spec matches implementation (status codes, fields, auth)
- [ ] No undocumented endpoints; no leaked internal fields
- [ ] Breaking changes detected and versioned
- [ ] Examples valid against schemas
