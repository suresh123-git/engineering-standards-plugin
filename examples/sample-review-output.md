# Example: `/review` output (NestJS project)

> Illustrative output showing the structure required by `standards/global/review-findings.md`.

## Summary
Verdict: **Request changes** — 1 High, 1 Medium, 1 Informational.

## Project context
TypeScript · NestJS 10 · PostgreSQL (TypeORM) · Jest · layered modules

## Findings

### [High] Missing authorization on order lookup — `src/orders/orders.controller.ts:42`
- **Problem:** `GET /orders/:id` is guarded by authentication only; any signed-in user can read any order.
- **Why it matters:** Broken object-level authorization (OWASP A01) exposes other customers' data.
- **Recommendation:** Check ownership in the service (`order.customerId === user.id`) or add an ownership guard.

### [Medium] Unvalidated pagination input — `src/orders/dto/list-orders.dto.ts:8`
- **Problem:** `limit` has no upper bound.
- **Recommendation:** `@IsInt() @Min(1) @Max(100)` with a default.

### [Informational] Consider extracting mapper — `orders.service.ts:90`

## Coverage
Reviewed: `src/orders/**`. Not reviewed: migrations, e2e tests.

## Next steps
Fix the High finding, then re-run `/review`. Offer: apply fixes with `/refactor`.
