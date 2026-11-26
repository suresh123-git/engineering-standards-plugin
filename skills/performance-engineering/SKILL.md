---
name: performance-engineering
description: Use when diagnosing or preventing slow code, queries, APIs or UIs and when assessing scalability — measurement-first analysis of database, caching, concurrency, memory and rendering.
version: 1.0.0
category: core
---

# Performance Engineering

## When to apply

A latency/throughput/memory/cost problem exists or is predictable (hot path, large data, spikes), or you are reviewing code with likely N+1s, unbounded loops, blocking calls or heavy payloads. Don't micro-optimise code that isn't on a measured hot path.

## How to apply

1. **Define the metric and target** (p95 latency, throughput, memory, LCP, cost) and **measure the baseline** with the project's tools ([performance standard](../../standards/coding/performance.md)).
2. Locate the bottleneck (profile/trace/`EXPLAIN`); classify: algorithm, I/O pattern, database, caching, allocation, blocking, payload, rendering.
3. Database first for backend services: [indexing and queries](../../standards/database/indexing-and-queries.md) — fix N+1, add the right index, paginate, batch.
4. Then caching (with invalidation and stampede control), concurrency (parallelise independent I/O with limits; offload CPU/slow work), and payload size.
5. For UIs apply [frontend performance](../../standards/frontend/frontend-performance.md): bundle, lazy loading, rendering, images, Core Web Vitals.
6. For capacity/scale questions use the [scalability checklist](../../standards/architecture/scalability.md).
7. Apply the least invasive fix; re-measure; report before/after and trade-offs; add a regression guard (benchmark, budget, alert) when valuable.

## Checklist

- [ ] Baseline and target documented; improvement verified with the same method
- [ ] No unbounded queries/collections/payloads on hot paths
- [ ] Independent I/O parallelised with concurrency limits; timeouts set
- [ ] Cache has key, TTL, invalidation, stampede protection; no cross-user leakage
- [ ] Correctness unchanged (tests pass; semantics preserved)

## Common mistakes

Optimising without profiling; caching to hide a missing index; adding indexes for every column; premature memoisation everywhere; parallelising calls that overload a dependency; comparing dev-sized data to production behaviour.
