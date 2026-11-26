---
title: REST API Design
version: 1.0.0
---

# REST API Design

Follow the project's existing API conventions first. These are the defaults for new or unspecified APIs.

## Resources and URLs

- Nouns, plural, lowercase kebab-case: `/orders`, `/orders/{orderId}/items`. Verbs only for true actions that do not map to CRUD: `POST /orders/{id}/cancel`.
- Nest at most two levels; otherwise expose the sub-resource at the top level with a filter.
- Identifiers are opaque; do not expose sequential internal ids where enumeration is a risk (use UUID/ULID or authorise every access).

## Methods and semantics

| Method | Semantics | Safe | Idempotent |
|---|---|---|---|
| GET | Read | yes | yes |
| POST | Create / non-idempotent action | no | no (use idempotency keys) |
| PUT | Replace entire resource | no | yes |
| PATCH | Partial update (JSON Merge Patch or JSON Patch) | no | should be |
| DELETE | Remove | no | yes |

## Status codes

`200` OK · `201` Created (+ `Location`) · `202` Accepted (async, return status URL) · `204` No Content · `400` malformed/validation · `401` unauthenticated · `403` authenticated but forbidden · `404` not found (also to hide existence) · `405` · `409` conflict/version clash · `410` · `412` precondition failed · `415` · `422` semantic validation (pick 400 *or* 422 and be consistent) · `429` rate limited (+ `Retry-After`) · `500` unexpected · `502/503/504` upstream/unavailable/timeout. Never return `200` with an error body.

## Response structure

Use one consistent envelope or none; do not mix.

```json
// success (collection)
{ "data": [ ... ], "meta": { "page": {"next": "cursor"}, "total": 124 } }
// error (RFC 9457 problem+json recommended)
{ "type": "https://api.example.com/errors/validation", "title": "Validation failed",
  "status": 422, "code": "VALIDATION_ERROR", "detail": "...",
  "errors": [ {"field": "email", "message": "must be a valid email"} ],
  "traceId": "..." }
```

- ISO-8601 UTC timestamps; consistent field casing (match the project); money as integer minor units plus currency code; explicit nulls vs omitted documented.
- Never expose internal entities, stack traces, SQL or infrastructure details.

## Versioning and compatibility

See [versioning and pagination](pagination-filtering-sorting.md#versioning). Additive changes are non-breaking; removing/renaming fields, changing types/semantics/required-ness, status codes or auth are breaking. Provide deprecation headers (`Deprecation`, `Sunset`) and a migration window.

## Security basics

AuthN/AuthZ on every route (object-level checks!), input validation, size limits, CORS allow-list, TLS only, no secrets in URLs, rate limits — see [security standards](../security/owasp-top-10.md).

## Documentation

Maintain an OpenAPI 3.x description as source of truth (see [OpenAPI](openapi-documentation.md)). Keep examples current; test the spec in CI.
