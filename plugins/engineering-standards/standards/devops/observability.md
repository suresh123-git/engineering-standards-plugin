---
title: Observability and Monitoring
version: 1.0.0
---

# Observability and Monitoring

Three signals plus alerting: **logs** ([structured logging](../coding/logging.md)), **metrics**, **traces**; tied together by correlation ids.

## Metrics

- Service level: use **RED** (Rate, Errors, Duration) per endpoint/consumer; resources: **USE** (Utilisation, Saturation, Errors) per CPU/memory/disk/pool/queue.
- Four golden signals: latency (p50/p95/p99, separate success vs error), traffic, errors, saturation.
- Business metrics: orders placed, payments failed, signups — alert on drops, not just errors.
- Use bounded label cardinality (no user ids/URLs with ids as labels); histograms for latency; counters for events.
- Dependency metrics: DB pool usage, query latency, cache hit ratio, queue depth/age/consumer lag, retry and DLQ counts, circuit-breaker state.

## Tracing

OpenTelemetry instrumentation, context propagation across HTTP/queues, spans around external calls and DB queries, sampling policy (tail-based for errors/slow), trace id in logs and error responses.

## Health

- **Liveness** (process healthy; no dependency checks), **readiness** (can serve traffic: dependencies reachable, migrations done), **startup** probes; graceful shutdown (drain connections, finish in-flight jobs, `SIGTERM` handling).

## Alerting

- Alert on **symptoms tied to SLOs** (error budget burn rate, latency SLO breach, backlog age), not on every cause. Every alert is actionable, has an owner, severity, and a **runbook link** ([template](../../templates/runbook.md)).
- Define SLIs/SLOs per critical journey; keep alert noise low (multi-window, multi-burn-rate).
- Dashboards: one overview per service (golden signals + dependencies + deploy markers).

## Audit and security events

Authentication, authorisation failures, privilege changes, data exports, admin actions, config changes — immutable, time-synced, access-controlled.

## Review checklist

- [ ] RED metrics and dependency metrics exposed
- [ ] Traces/correlation ids propagate across async boundaries
- [ ] Readiness/liveness correct; graceful shutdown
- [ ] SLOs and actionable alerts with runbooks
- [ ] No sensitive data in telemetry; retention/cost considered
- [ ] Incident tooling: deploy markers, feature-flag changes visible on dashboards
