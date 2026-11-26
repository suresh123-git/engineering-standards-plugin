---
title: Production Readiness Checklist
version: 1.0.0
---

# Production Readiness Checklist

Criteria and severities: [production readiness standard](../standards/devops/production-readiness.md).

## Code and build
- [ ] Reproducible build from a clean checkout; lockfile committed
- [ ] Lint, type check, unit and integration tests pass in CI
- [ ] No debug code, `console.log`, hard-coded URLs or test credentials

## Security and access
- [ ] Every route has an explicit authentication/authorization decision
- [ ] Object-level/tenant checks verified
- [ ] Input validated at boundaries; injection paths reviewed
- [ ] No known critical/high CVEs in runtime dependencies
- [ ] Security headers, TLS, CORS allow-list configured

## Data
- [ ] Migrations backward compatible, tested on realistic data, timed
- [ ] Backups configured; **restore tested**
- [ ] Indexes support hot queries; no unbounded queries

## Reliability
- [ ] Timeouts, retries with backoff, circuit breakers on dependencies
- [ ] Idempotency for retried writes; consumers deduplicate
- [ ] Graceful shutdown; readiness/liveness probes
- [ ] Load tested for expected peak with headroom; capacity limits known

## Operability
- [ ] Structured logs with correlation ids; no sensitive data
- [ ] Metrics (RED), dashboards, tracing
- [ ] Actionable alerts with runbooks and owners; on-call defined
- [ ] Configuration externalised and validated at startup; secrets in a manager

## Release
- [ ] Immutable artifact promoted across environments
- [ ] Deployment strategy defined (rolling/canary/blue-green) and rehearsed
- [ ] **Rollback plan tested** (app and database)
- [ ] Feature flags / kill switches for risky changes
- [ ] Changelog/release notes; stakeholders informed
