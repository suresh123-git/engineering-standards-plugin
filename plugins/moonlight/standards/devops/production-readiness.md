---
title: Production Readiness
version: 1.0.0
---

# Production Readiness

Criteria used by `/production-check`. Each area lists **must-haves** (absence is High/Critical) and **should-haves** (Medium/Low).

| # | Area | Must-have | Should-have |
|---|---|---|---|
| 1 | Code quality | Builds reproducibly; no TODO/FIXME on critical paths; no dead debug code; lint/types clean | Documented module boundaries; low complexity hotspots |
| 2 | Security | No known critical vulnerabilities; input validation; secure headers; TLS | Threat model; SAST/DAST in CI; WAF |
| 3 | AuthN/AuthZ | Every route has explicit auth decision; object-level checks; secure session/token handling | MFA for admin; audit trail; periodic access review |
| 4 | Error handling | Centralised handler; no leaked internals; timeouts and retries on dependencies | Circuit breakers; graceful degradation; DLQs |
| 5 | Database & migrations | Backward-compatible migrations; tested on realistic data; backups + restore tested | Online index creation; replica/failover tested |
| 6 | Performance | Load-tested at expected peak with headroom; no N+1/unbounded queries on hot paths; pooled connections | Autoscaling; caching with invalidation plan |
| 7 | Tests | Critical flows covered by integration/E2E; regression tests for known bugs; CI green | Mutation testing on core domain; contract tests |
| 8 | Logging | Structured logs with correlation id; no secrets/PII | Log-based alerts; retention policy |
| 9 | Monitoring/observability | RED metrics, health/readiness endpoints, actionable alerts with runbooks | Tracing; SLOs and burn-rate alerts; dashboards |
| 10 | Configuration | 12-factor config via env/secret store; per-environment separation; validated at startup (fail fast) | Feature flags; typed config schema |
| 11 | Secrets | None in repo/images/logs; rotation plan; least privilege | Automated rotation; scanning in CI |
| 12 | Deployment | Reproducible artifact; automated pipeline; zero/low-downtime strategy; graceful shutdown | Canary/blue-green; deploy markers |
| 13 | Rollback | Documented, tested rollback for app and DB; previous artifact retained | Automated rollback on SLO breach |
| 14 | Dependencies | Lockfile committed; no critical CVEs/EOL runtimes; licences acceptable | Automated update PRs; SBOM |
| 15 | Backward compatibility | API/event/schema changes additive or versioned; deprecations announced | Consumer contract tests |

## Additional operational checks

Capacity and quotas (cloud limits, DB connections, rate limits of third parties) · timeouts consistent across tiers · idempotency for retried operations · data retention and privacy obligations (GDPR/PII deletion) · disaster recovery objectives (RPO/RTO) · on-call ownership and escalation · runbooks for top failure modes · cost estimates and budgets · accessibility and browser support for UIs.

## Verdict model

- **Ready** — no Critical/High; Mediums have owners and dates.
- **Ready with conditions** — High items with accepted mitigations/time-boxed follow-ups, documented and approved.
- **Not ready** — any Critical, or unmitigated High in security, data integrity, rollback or observability.

Use the shared [findings format](../global/review-findings.md) and attach the [production checklist](../../checklists/production-readiness.md).
