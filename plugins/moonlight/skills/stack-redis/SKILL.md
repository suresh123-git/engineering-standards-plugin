---
name: "stack-redis"
description: "Use in projects using Redis (ioredis, redis, BullMQ, cache/session/rate-limit usage) to review key design, TTLs and eviction, caching correctness, data structures, atomicity, persistence, security and failure modes."
---
# Redis

## Detect

`redis`, `ioredis`, `bull`/`bullmq`, `connect-redis`, `rate-limiter-flexible`, `@nestjs/cache-manager`, docker-compose redis, `REDIS_URL`, ElastiCache/MemoryDB config.

## Review focus

- **Role clarity**: cache (loss acceptable), session store, rate limiter, queue (BullMQ), pub/sub, lock/coordination, primary data store? Persistence/HA requirements follow the role — a cache must tolerate empty Redis; a queue/session store needs durability (AOF/replicas) decisions.
- **Key design**: namespaced (`app:env:entity:id`), bounded cardinality, no unbounded growth; **TTL on every cache key** (plus jitter to avoid synchronized expiry); avoid huge values/keys (> ~1MB) and big collections (hot key/big key problems); `SCAN` not `KEYS` in production; `UNLINK` for big deletions.
- **Cache correctness**: cache-aside with explicit invalidation; **stampede protection** (single-flight/mutex, stale-while-revalidate, probabilistic early refresh); negative caching with short TTL; never cache per-user data under shared keys; serialization versioning; consistency window documented ([performance](${CLAUDE_PLUGIN_ROOT}/standards/coding/performance.md)).
- **Atomicity**: use atomic commands, `MULTI/EXEC`, Lua scripts/functions (single-threaded semantics) for read-modify-write; `SET key val NX PX ttl` for locks — and **fencing/ownership token + safe release**; Redlock caveats; avoid check-then-set races.
- **Data structures**: choose the right one (hash for objects, sorted sets for leaderboards/delay queues, streams for durable queues with consumer groups, HyperLogLog/bitmaps for counts); pipeline/batch commands to cut round trips.
- **Eviction & memory**: `maxmemory` + policy (`allkeys-lru`/`volatile-ttl`…) matching role; monitor memory fragmentation, evictions, hit ratio; never run a queue/session store under an evicting policy that deletes data.
- **Queues (BullMQ)**: idempotent jobs, retries with backoff, `removeOnComplete/Fail` limits, stalled-job handling, concurrency limits, DLQ/failed set monitoring, graceful worker shutdown.
- **Resilience**: connection timeouts/retries with backoff, reconnect handling, circuit breaker so Redis outage degrades to DB/no-cache rather than total failure; cluster/sentinel-aware clients; avoid multi-key ops across slots in cluster mode (hash tags).
- **Security**: `requirepass`/ACLs, TLS, private network only (never exposed publicly), dangerous commands disabled (`FLUSHALL`, `CONFIG`, `KEYS`), no secrets in keys, ACL least-privilege per service ([secrets](${CLAUDE_PLUGIN_ROOT}/standards/security/secrets-management.md)).

## Testing conventions

Use a real Redis in tests (Testcontainers) rather than mocks for Lua/atomicity/TTL behaviour; flush only dedicated test DB/prefix; fake timers or short TTLs for expiry; test cache-miss and Redis-down paths.

## Pitfalls

Missing TTLs causing memory leaks; `KEYS *` in production; locks without expiry or ownership; treating Redis as durable by default; big keys blocking the single thread; cache stampedes after deploy/flush; sharing one Redis DB across unrelated apps without prefixes.
