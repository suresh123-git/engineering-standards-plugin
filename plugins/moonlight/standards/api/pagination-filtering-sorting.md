---
title: Pagination, Filtering, Sorting and Versioning
version: 1.0.0
---

# Pagination, Filtering, Sorting and Versioning

## Pagination

- **Every collection endpoint is paginated**, with a server-enforced default and maximum page size (e.g., default 20, max 100).
- **Cursor (keyset) pagination** for large/changing datasets and infinite scroll: stable ordering on indexed, unique-tiebreaker columns; opaque cursor token; `next`/`prev` in response. No deep-offset scans.
- **Offset/limit** acceptable for small, mostly static data or admin tables; document the cost and ordering requirement.
- Return pagination info consistently (`meta.page.next`, optional `total` — counting can be expensive; make it opt-in).
- Always define a deterministic default sort; pagination without ordering is a bug.

## Filtering

- Use query parameters with explicit allow-listed fields: `?status=active&createdAfter=2026-01-01`. Operators via suffix or bracket syntax consistently (`price[gte]=10`).
- Validate types and ranges; reject unknown filters (400) rather than ignoring silently.
- Never build queries by string concatenation; map filters through allow-lists to parameterised queries.
- Ensure filtered/sorted columns are indexed for common queries (see [indexing](../database/indexing-and-queries.md)).

## Sorting

- `?sort=-createdAt,name` (prefix `-` for descending) with an allow-list of sortable fields; reject others.

## Sparse fields and expansion

- Optional `fields=` and `expand=` to avoid over-fetching; cap expansion depth to prevent N+1/DoS.

## Versioning {#versioning}

- Choose one scheme and keep it: URL (`/v1/...`, simplest, cache-friendly), header (`Accept: application/vnd.x.v2+json`), or date-based. Follow existing project practice.
- Prefer **evolving without new versions**: add optional fields, new endpoints, tolerate unknown fields in clients (tolerant reader).
- New major version only for breaking changes; run versions in parallel with a published sunset policy; monitor usage per version before removal.
- Contract tests (consumer-driven or schema diff such as `oasdiff`) in CI to detect accidental breaks.

## GraphQL equivalents

Relay-style connections (`first/after`), field-level deprecation (`@deprecated`) instead of versions, complexity/depth limits.
