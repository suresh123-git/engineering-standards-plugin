---
title: Performance Engineering
version: 1.0.0
---

# Performance Engineering

**Measure first.** Do not optimise without a baseline (profile, benchmark, query plan, trace) and a target (p95 latency, throughput, memory, cost). Report before/after numbers. Correctness and readability win unless a measured requirement is missed.

## Database

- Fetch only needed columns/rows; push filtering, sorting, aggregation and pagination to the database.
- Eliminate N+1 queries: join, batch (`IN`), dataloader, or eager load deliberately.
- Index for actual access patterns; verify with `EXPLAIN`. See [indexing and queries](../database/indexing-and-queries.md).
- Keep transactions short; avoid holding them across network calls.
- Pool connections; size the pool to the database, not to request concurrency.

## Caching

- Cache only after measuring; define key, TTL, invalidation, and stampede protection (single-flight, jittered TTL).
- Layers: HTTP/CDN (`Cache-Control`, `ETag`), application (in-memory/Redis), query/result cache. Never cache per-user data under a shared key.
- Staleness must be an explicit, acceptable business decision.

## Memory

- Stream large payloads/files instead of buffering; paginate result sets.
- Watch for unbounded collections, caches without eviction, listeners/timers never removed, closures retaining large objects.
- Prefer bounded queues and backpressure.

## Concurrency and async

- Do I/O concurrently when independent (`Promise.all` with a concurrency limit; worker pools); never block the event loop with CPU work (offload to workers/queues).
- Protect shared mutable state: avoid it, or use locks/transactions/atomic operations; make operations idempotent.
- Move slow or non-critical work off the request path (queues, background jobs) with retries and DLQ.
- Set timeouts everywhere; apply bulkheads and rate limits to protect dependencies.

## API responses

- Compression, pagination, sparse fieldsets, conditional requests, avoid over-fetching/chatty APIs, batch endpoints where justified.
- Keep payloads small; avoid returning internal entities wholesale.

## Frontend

- Ship less JavaScript: code-split, lazy-load routes, tree-shake. See [frontend performance](../frontend/frontend-performance.md).
- Avoid unnecessary re-renders; virtualise long lists; optimise images and fonts; measure Core Web Vitals.

## Algorithms

- Check complexity of loops over collections, nested lookups (use maps/sets), repeated sorting, string concatenation in loops, regex backtracking (ReDoS).

## Scalability questions to ask

Single points of failure? Stateless instances? Hot keys/partitions? Fan-out cost? Back-pressure and graceful degradation? Capacity limits of each dependency? (See [scalability](../architecture/scalability.md).)
