---
name: api-and-services
description: Conventions for backend controllers, routes, resolvers and services — thin handlers, validation, status codes, pagination and error shape.
scope: glob
globs: ["**/*.controller.ts", "**/controllers/**", "**/routes/**", "**/resolvers/**", "**/api/**"]
version: 1.0.0
---

# API and Services

- Handlers are thin: parse/validate → call a service/use case → map the result. No business logic or direct data access in handlers.
- Validate params, query and body with the project's validation mechanism; reject unknown fields; never bind request bodies directly to persistence entities.
- Use correct HTTP semantics and status codes; keep the project's error response shape; never return stack traces or internal details.
- Collections are paginated with a server-enforced maximum; sorting/filtering use allow-lists.
- Retried writes are idempotent (idempotency key, unique constraint or natural idempotency).
- Every route has an explicit authentication/authorisation decision, including object-level checks.
- Keep the OpenAPI/GraphQL schema in sync with the implementation; changes are additive or versioned.

Details: [REST design](../../standards/api/rest-design.md) · [pagination](../../standards/api/pagination-filtering-sorting.md) · [idempotency](../../standards/api/idempotency-rate-limiting.md)
