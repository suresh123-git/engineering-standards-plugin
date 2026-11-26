---
disable-model-invocation: true
description: "Assess production readiness across 15 areas — security, reliability, data, observability, deployment and rollback — and return a severity-ranked go/no-go report."
argument-hint: "<service | repo | release scope> [target environment]"
allowed-tools: "Read, Grep, Glob, Bash(git diff:*), Bash(git log:*), Bash(git status:*), Bash(git show:*), Bash(git blame:*)"
---
# /production-check

> **Mode: read-only.** Do not create, modify or delete files unless the user explicitly asks you to apply the changes. Running side-effect-free inspection commands (git log/diff, tests, linters) is fine.
>
> **User input:** $ARGUMENTS


## Purpose

Decide whether a service or release is safe to run in production, and exactly what must change if not. Inspects: code quality, security, authentication and authorization, error handling, database migrations, performance, test coverage and critical scenarios, logging, monitoring and observability, configuration, secrets, deployment readiness, rollback strategy, dependency risks and backward compatibility.

## Expected Input

A service/repo and optionally the release scope (diff range) and target environment. If a PR/range is given, focus on changed areas but still assess operational readiness of the service.

## Project Context Discovery

Run [project discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md) (full pass). Additionally locate:

- Deployment artifacts: Dockerfile, k8s/Helm, Terraform/CloudFormation/CDK, serverless config, CI/CD pipelines, environment files and config schema.
- Migration folders and the latest migrations; backup/restore documentation.
- Health endpoints, metrics/tracing setup, alert/runbook docs, dashboards-as-code.
- Test suites (unit/integration/E2E/load) and last known CI results.
- Load matching `stack-*` skills (docker, kubernetes, aws, terraform, cicd, databases, messaging).

## Applicable Standards

- [Production readiness](${CLAUDE_PLUGIN_ROOT}/standards/devops/production-readiness.md) — **the 15-area criteria and verdict model**
- [Observability](${CLAUDE_PLUGIN_ROOT}/standards/devops/observability.md), [CI/CD](${CLAUDE_PLUGIN_ROOT}/standards/devops/ci-cd.md), [containers and IaC](${CLAUDE_PLUGIN_ROOT}/standards/devops/containers-and-iac.md)
- [OWASP Top 10](${CLAUDE_PLUGIN_ROOT}/standards/security/owasp-top-10.md), [authn/authz](${CLAUDE_PLUGIN_ROOT}/standards/security/authn-authz-sessions-jwt.md), [secrets](${CLAUDE_PLUGIN_ROOT}/standards/security/secrets-management.md), [dependency security](${CLAUDE_PLUGIN_ROOT}/standards/security/dependency-security.md)
- [Migration safety](${CLAUDE_PLUGIN_ROOT}/standards/database/migration-safety.md), [error handling](${CLAUDE_PLUGIN_ROOT}/standards/coding/error-handling.md), [performance](${CLAUDE_PLUGIN_ROOT}/standards/coding/performance.md)
- Checklist: [production readiness](${CLAUDE_PLUGIN_ROOT}/checklists/production-readiness.md)

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

## Shared Requirements

- Run [project context discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md) first and load the matching `stack-*` skills.
- Follow the [safety rules](${CLAUDE_PLUGIN_ROOT}/standards/global/safety-rules.md); audit-style output uses the [findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md).
- Project conventions override generic advice unless they cause a concrete problem; never force a framework or architecture the project does not use.

## Loading stack skills (plugin)

Skills in this plugin are user-invoked only, so read the matching stack skills as files: `${CLAUDE_PLUGIN_ROOT}/skills/stack-<name>/SKILL.md` (e.g. `stack-nestjs`, `stack-postgresql`), and core skills at `${CLAUDE_PLUGIN_ROOT}/skills/<name>/SKILL.md`. Read only those for technologies the project actually uses.
