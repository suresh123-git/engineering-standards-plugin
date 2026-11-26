---
title: Idempotency and Rate Limiting
version: 1.0.0
---

# Idempotency and Rate Limiting

## Idempotency

Clients retry (timeouts, mobile networks, queues redeliver). Any operation with side effects that can be retried must be safe to repeat.

- `GET/PUT/DELETE` are idempotent by definition — implement them so.
- For `POST` and side-effecting `PATCH` (payments, order creation, emails): accept an **`Idempotency-Key`** header (client-generated UUID).
  1. On first sight, atomically record `(key, request fingerprint, status=in_progress)`.
  2. Execute; store the response (status + body) against the key with TTL (e.g., 24h).
  3. On repeat with the same key and same fingerprint, return the stored response; with a different fingerprint return `422/409`; while in progress return `409`/`Retry-After`.
- Uniqueness enforced by the database (unique constraint on key), not by an in-memory check.
- Message consumers: dedupe by message/event id (inbox table, unique constraint) or make the handler naturally idempotent (upsert, set-state-to rather than increment).
- Use optimistic concurrency (`ETag`/`If-Match`, version column) to prevent lost updates.

## Rate limiting and quotas

- Protect every public and expensive endpoint; stricter limits on auth, password reset, search, exports.
- Algorithms: token bucket / sliding window; choose limits by client identity (API key, user, IP as fallback), per route class.
- Enforce at the edge (API gateway/WAF/CDN) **and** where the cost is (application, DB-heavy routes).
- Respond `429` with `Retry-After` and headers (`RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`).
- Distributed limiting needs shared state (Redis with atomic scripts) — be explicit about failure mode (fail-open vs fail-closed per route risk).
- Add request size/time limits, pagination caps, GraphQL depth/complexity limits, upload limits, and concurrency limits per tenant.
- Back-pressure for async work: bounded queues, per-tenant fairness.

## Review checklist

- [ ] Retried POSTs cannot double-charge/double-create
- [ ] Idempotency keys stored durably with TTL and fingerprint check
- [ ] Consumers tolerate duplicate and out-of-order delivery
- [ ] Rate limits on auth and expensive routes; 429 contract documented
