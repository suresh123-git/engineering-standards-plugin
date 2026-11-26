---
disable-model-invocation: true
name: "stack-microservices"
description: "Use when a system has multiple independently deployed services — to review service boundaries, communication, data ownership, consistency, resilience and observability, or to judge whether splitting is warranted."
---
# Microservices

## Detect

Multiple deployables (several Dockerfiles/service folders, k8s manifests per service, `services/` or `apps/` monorepo), service-to-service HTTP/gRPC/messaging, API gateway, per-service databases.

## Review focus

- **Boundaries**: services align to business capabilities/bounded contexts ([DDD](${CLAUDE_PLUGIN_ROOT}/standards/architecture/domain-driven-design.md)); detect a **distributed monolith** (lock-step deploys, shared DB, chatty sync calls, shared domain library coupling everything).
- **Data ownership**: one service writes its data; no cross-service joins or shared tables; other services use APIs/events; read models/caches built from events.
- **Communication**: sync only where a response is needed; prefer async events for propagation; avoid long sync call chains (latency/availability multiply); timeouts, retries with jitter (idempotent only), circuit breakers, bulkheads on every outbound call.
- **Consistency**: no distributed transactions; use **sagas** (orchestration vs choreography), **transactional outbox** + idempotent consumers, compensation, reconciliation.
- **Contracts**: versioned APIs/events; consumer-driven contract tests (Pact); additive evolution; schema registry for events (see the `stack-kafka`/`stack-rabbitmq`/`stack-sqs` skills for the broker in use).
- **Resilience**: graceful degradation, fallbacks, rate limits/quotas per client, backpressure, idempotency keys ([idempotency](${CLAUDE_PLUGIN_ROOT}/standards/api/idempotency-rate-limiting.md)).
- **Security**: service-to-service authN (mTLS/workload identity/JWT with audience), authZ propagated safely (don't trust gateway-only checks), secrets per service, network policies.
- **Observability**: correlation/trace ids across hops, RED metrics per service, dependency maps, SLOs; centralised structured logs ([observability](${CLAUDE_PLUGIN_ROOT}/standards/devops/observability.md)).
- **Delivery**: independent CI/CD per service, backward-compatible deployments, feature flags, API gateway/BFF responsibilities, config management, environment parity, cost of platform complexity.
- **Team fit**: do team size and operational maturity justify microservices? Consider a **modular monolith** first.

## Design notes

Start from the problem: independent scaling, deployment cadence, fault isolation, team autonomy. Use [trade-off analysis](${CLAUDE_PLUGIN_ROOT}/standards/architecture/tradeoff-analysis.md). Extract using the strangler pattern with an anti-corruption layer; split data last and carefully ([migration safety](${CLAUDE_PLUGIN_ROOT}/standards/database/migration-safety.md)).

## Testing conventions

Unit and component tests per service; contract tests at boundaries; a few cross-service E2E smoke tests; fault-injection tests for timeouts/partial failure; test consumers with duplicate/out-of-order events.

## Pitfalls

Shared database; synchronous chains across 5+ services; no ownership of events/contracts; per-service snowflake tooling; premature splitting; missing idempotency; distributed tracing absent.
