---
name: production-check
description: Assess production readiness across 15 areas — security, reliability, data, observability, deployment and rollback — and return a severity-ranked go/no-go report.
category: quality
version: 1.0.0
mode: read-only
argument-hint: "<service | repo | release scope> [target environment]"
standards:
  - global/project-discovery
  - global/safety-rules
  - global/review-findings
  - devops/production-readiness
  - devops/observability
  - devops/ci-cd
  - security/owasp-top-10
  - database/migration-safety
skills:
  - code-review
  - secure-coding
  - performance-engineering
  - testing-strategy
---

# /production-check

## Purpose

Decide whether a service or release is safe to run in production, and exactly what must change if not. Inspects: code quality, security, authentication and authorization, error handling, database migrations, performance, test coverage and critical scenarios, logging, monitoring and observability, configuration, secrets, deployment readiness, rollback strategy, dependency risks and backward compatibility.

## Expected Input

A service/repo and optionally the release scope (diff range) and target environment. If a PR/range is given, focus on changed areas but still assess operational readiness of the service.

## Project Context Discovery

Run [project discovery](../../standards/global/project-discovery.md) (full pass). Additionally locate:

- Deployment artifacts: Dockerfile, k8s/Helm, Terraform/CloudFormation/CDK, serverless config, CI/CD pipelines, environment files and config schema.
- Migration folders and the latest migrations; backup/restore documentation.
- Health endpoints, metrics/tracing setup, alert/runbook docs, dashboards-as-code.
- Test suites (unit/integration/E2E/load) and last known CI results.
- Load matching `stack-*` skills (docker, kubernetes, aws, terraform, cicd, databases, messaging).

## Applicable Standards

- [Production readiness](../../standards/devops/production-readiness.md) — **the 15-area criteria and verdict model**
- [Observability](../../standards/devops/observability.md), [CI/CD](../../standards/devops/ci-cd.md), [containers and IaC](../../standards/devops/containers-and-iac.md)
- [OWASP Top 10](../../standards/security/owasp-top-10.md), [authn/authz](../../standards/security/authn-authz-sessions-jwt.md), [secrets](../../standards/security/secrets-management.md), [dependency security](../../standards/security/dependency-security.md)
- [Migration safety](../../standards/database/migration-safety.md), [error handling](../../standards/coding/error-handling.md), [performance](../../standards/coding/performance.md)
- Checklist: [production readiness](../../checklists/production-readiness.md)

## Execution Steps

1. Run discovery; list services/entry points, dependencies, data stores and environments in scope.
2. For **each of the 15 areas**, gather evidence from code/config/CI (not from README claims) and rate it: ✅ meets · ⚠️ partial · ❌ missing · ❓ cannot determine (state what's needed).
3. **Security & auth**: enumerate routes/handlers and verify an auth decision on each; run secret and dependency checks where tools exist; check headers/CORS/TLS config.
4. **Data**: review new/pending migrations for locking, backward compatibility, rollback; check backup/restore evidence; check connection pooling and timeouts.
5. **Reliability**: timeouts, retries, circuit breakers, idempotency, graceful shutdown, resource limits, health probes, DLQs.
6. **Observability**: structured logs, correlation ids, RED metrics, alerts with runbooks, SLOs.
7. **Deployment/rollback**: artifact immutability, environment parity, config validation at startup, deployment strategy, tested rollback path (app + DB), feature flags.
8. **Tests**: critical flows covered; regression for known bugs; flaky/skipped tests; load-test evidence.
9. **Compatibility & dependencies**: API/event/schema compatibility, deprecations, CVEs, EOL runtimes.
10. Convert gaps to findings with severity; apply the **verdict model** (Ready / Ready with conditions / Not ready).

## Output Format

```
## Verdict: READY | READY WITH CONDITIONS | NOT READY  (+ one-paragraph rationale)
## Readiness matrix (15 areas: status | evidence | key gap)
## Findings (shared format; Critical/High first, each with owner-ready action)
## Conditions to ship (if any) and time-boxed follow-ups
## Unknowns — what could not be verified and how to verify
## Rollback plan summary
```

## Safety Constraints

- Strictly read-only. Do not deploy, run migrations, modify infra, hit production endpoints, or run load tests against shared systems.
- Never print secret values; cite locations.
- Do not mark an area ✅ without evidence; use ❓ instead. Do not invent monitoring or rollback procedures that do not exist.

## Examples

```
/production-check
/production-check services/payments before the Friday release
/production-check main..release/2.4 target: production (EKS)
```
