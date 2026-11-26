---
title: Scalability
version: 1.0.0
---

# Scalability

Scale to **known or credibly forecast load**, not imagined load. Quantify first: requests/s, data size and growth, read/write ratio, peak/average, latency and availability targets, cost ceiling.

## Analysis checklist

1. **Statelessness** — can instances be added/removed freely? Sessions, uploads, caches, schedulers and websockets are the usual blockers (externalise to Redis/DB/object store; leader election or distributed locks for singletons).
2. **Data tier** — usually the first limit. Look at: missing indexes, N+1, unbounded queries, hot rows/partitions, write amplification, lock contention, large transactions, read replicas and replication lag, sharding keys, connection limits.
3. **Synchronous chains** — long call chains multiply latency and failure probability. Break with queues/events where the user does not need the result immediately.
4. **Fan-out and amplification** — one request triggering N downstream calls; retry storms; thundering herd on cache expiry.
5. **Queues and streams** — partition counts/keys, consumer parallelism, ordering requirements, backlog monitoring, DLQ, idempotent consumers, back-pressure.
6. **Caching** — hit ratio, invalidation, stampede control (see [performance](../coding/performance.md)).
7. **Resource limits** — CPU/memory per instance, event-loop blocking, file descriptors, thread/connection pools, rate limits of third parties.
8. **Resilience** — timeouts, retries with jitter, circuit breakers, bulkheads, graceful degradation, load shedding.
9. **Elasticity & ops** — autoscaling signals, warm-up, deployment strategy, multi-AZ, capacity tests.
10. **Cost** — scaling vertically vs horizontally; cost per request; over-provisioning.

## Deliverable shape

For each limitation: *what breaks, at what load (estimate or measure), evidence, mitigation options with effort/risk, and recommended order*. Distinguish **bottlenecks today** from **bottlenecks at 10×**. Recommend load tests and the metrics needed to confirm (p95/p99 latency, saturation, error rate, queue depth, DB CPU/locks).

## Principles

Scale reads before writes; prefer simple (vertical, caching, indexes) before complex (sharding, microservices); make work idempotent and asynchronous; design partition keys deliberately; remove coordination where possible.
