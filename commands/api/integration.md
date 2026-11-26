---
name: integration
description: Design a robust integration with an external system — boundaries, adapters, resilience, security, idempotency and testing — before implementing it.
category: api
version: 1.0.0
mode: read-only
argument-hint: "<external system/API/vendor + purpose>"
standards:
  - global/project-discovery
  - global/safety-rules
  - architecture/hexagonal-architecture
  - coding/error-handling
  - api/idempotency-rate-limiting
  - security/secrets-management
skills:
  - clean-architecture
  - secure-coding
  - design-patterns
---

# /integration

## Purpose

Design how the application will talk to an external system (payment provider, CRM, email/SMS, partner API, legacy system, webhook source) so that outages, schema changes and retries in that system cannot corrupt or take down ours.

## Expected Input

The external system, purpose, direction (outbound calls, inbound webhooks, both), data involved, volumes, and SLAs. Link to the vendor's official docs if available; otherwise fetch/verify the API details from official documentation rather than assuming.

## Project Context Discovery

Run [project discovery](../../standards/global/project-discovery.md). Additionally:

- Find existing integrations and how they are structured (clients, adapters, retry helpers, HTTP wrappers, webhook handlers, queues).
- Check config/secret handling, observability hooks and test utilities (MSW/nock/WireMock).
- Identify where the external data meets our domain model (mapping layer).

## Applicable Standards

- [Hexagonal architecture](../../standards/architecture/hexagonal-architecture.md) — port and adapter, anti-corruption
- [Error handling](../../standards/coding/error-handling.md), [idempotency and rate limiting](../../standards/api/idempotency-rate-limiting.md)
- [Secrets management](../../standards/security/secrets-management.md), [observability](../../standards/devops/observability.md)

## Execution Steps

1. **Understand the contract**: auth method, endpoints/events needed, rate limits, error codes, pagination, webhooks and signatures, sandbox availability, versioning/deprecation policy (verify from official docs).
2. **Define the port** in our domain language (e.g., `PaymentGateway.charge()`), independent of vendor naming; decide the **anti-corruption layer** mapping vendor ↔ domain.
3. **Sync vs async**: what must be real-time vs queued; outbox pattern for reliable publishing; inbox/dedupe for inbound events.
4. **Resilience**: timeouts, bounded retries with exponential backoff + jitter (idempotent operations only), circuit breaker, bulkhead, fallbacks/degraded mode, rate-limit handling (`429`/`Retry-After`), dead-letter handling and reconciliation jobs.
5. **Idempotency**: vendor idempotency keys, our dedupe keys, safe replays of webhooks.
6. **Security**: credential storage and rotation, least-privilege scopes, **webhook signature verification** with replay protection (timestamp tolerance), IP allow-listing where supported, no sensitive data in logs, TLS pinning needs.
7. **Data handling**: PII minimisation, data residency/compliance, schema validation of vendor responses (never trust shape), tolerant reader.
8. **Observability**: per-call metrics (latency, errors by code), correlation ids, alerts on error rate/latency/quota, audit trail.
9. **Testing**: contract tests against recorded examples, sandbox smoke tests, failure injection (timeouts, 5xx, malformed payloads, duplicate/out-of-order webhooks), local fakes.
10. **Rollout**: feature flag, shadow mode, gradual traffic, kill switch, runbook for vendor outage.

## Output Format

```
## Goals & constraints         ## Vendor contract summary (with doc references)
## Architecture (diagram: port, adapter, queue, webhook handler)
## Data mapping                ## Resilience & failure-mode table (failure | behaviour)
## Security & compliance       ## Observability & alerts
## Test plan                   ## Rollout plan & runbook outline
## Risks / open questions
```

## Safety Constraints

- Design only; do not call vendor production APIs or use real credentials. Use sandbox endpoints and fake keys for any experiments.
- Never place vendor secrets in code, logs or examples.
- Do not assume vendor behaviour — cite documentation or mark as unverified.

## Examples

```
/integration Stripe payments with webhooks for async status
/integration sync customers to Salesforce nightly, ~200k records
/integration receive shipment events from a partner via signed webhooks
```
