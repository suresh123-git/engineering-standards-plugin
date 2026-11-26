---
description: "Review observability — metrics, tracing, health checks, SLOs, alerts and runbooks — and recommend gaps to close for reliable operation."
argument-hint: "<service | repo | alert/dashboard config>"
allowed-tools: "Read, Grep, Glob, Bash(git diff:*), Bash(git log:*), Bash(git status:*), Bash(git show:*), Bash(git blame:*)"
---
# /monitoring

> **Mode: read-only.** Do not create, modify or delete files unless the user explicitly asks you to apply the changes. Running side-effect-free inspection commands (git log/diff, tests, linters) is fine.
>
> **User input:** $ARGUMENTS


## Purpose

Determine whether the team would **know** (quickly, with context) when this system is failing or degrading, and whether on-call could act on it. Reviews instrumentation in code, dashboards/alerts-as-code, health probes, SLOs and runbooks.

## Expected Input

A service or repo; optionally dashboards/alert definitions, SLOs, or an incident to evaluate ("would we have detected X?").

## Project Context Discovery

Run [project discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md). Additionally:

- Find metrics/tracing libraries and exporters (Prometheus client, OpenTelemetry, StatsD, Datadog/New Relic/Sentry agents, CloudWatch EMF).
- Find health endpoints, probe config (k8s/ALB/ECS), alert rules (Prometheus rules, CloudWatch alarms in IaC, Datadog monitors), dashboards, SLO docs and runbooks.
- Identify critical user journeys and dependencies from routes, queues and integrations.

## Applicable Standards

- [Observability](${CLAUDE_PLUGIN_ROOT}/standards/devops/observability.md) — signals, health, alerting
- [Structured logging](${CLAUDE_PLUGIN_ROOT}/standards/coding/logging.md)
- [Findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md); runbook [template](${CLAUDE_PLUGIN_ROOT}/templates/runbook.md)

## Execution Steps

1. List **critical journeys** and dependencies; define what "healthy" means for each.
2. **Metrics coverage**: RED per endpoint/consumer, saturation (CPU, memory, event-loop lag, pools, queue depth/age, consumer lag), dependency latency/errors, business KPIs; cardinality hazards; histogram buckets suited to SLOs.
3. **Tracing**: context propagation across HTTP/queues, spans on DB/external calls, sampling, trace/log correlation.
4. **Health**: liveness vs readiness correctness (no dependency checks in liveness; readiness reflects ability to serve), startup probe, graceful shutdown.
5. **Alerts**: symptom-based and SLO-aligned; thresholds, durations, severities, routing/ownership, runbook links, noise risk; **missing alerts** for each critical failure mode (table: failure mode → detected by → time-to-detect).
6. **SLOs**: existence of SLIs/SLOs, error budgets, burn-rate alerts; propose initial SLOs when absent.
7. **Dashboards**: golden-signals overview, dependency view, deploy markers; usefulness during incidents.
8. **Incident readiness**: runbooks, on-call ownership, escalation, audit/security event visibility.
9. Provide a prioritised instrumentation/alert backlog with code or config snippets for the top items (framework-specific: e.g., `prom-client` histogram in Express, Nest interceptor, OTel SDK bootstrap).

## Output Format

Shared findings format (category: logging/observability) + **Coverage matrix** (journey | metrics | traces | logs | alerts | runbook) + **failure-mode detection table** + proposed SLOs + backlog by priority.

## Safety Constraints

- Read-only; do not modify alerting/paging configs or silence alerts. Do not query production telemetry beyond what the user provides or explicitly allows.
- Avoid recommendations that explode metric cardinality or cost; note cost/retention implications.
- Don't invent SLO numbers as facts — present as proposals to validate with stakeholders.

## Examples

```
/monitoring
/monitoring services/checkout — would we notice payment failures within 5 minutes?
/monitoring alerts/ — are these alerts actionable?
```

## Shared Requirements

- Run [project context discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md) first and load the matching `stack-*` skills.
- Follow the [safety rules](${CLAUDE_PLUGIN_ROOT}/standards/global/safety-rules.md); audit-style output uses the [findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md).
- Project conventions override generic advice unless they cause a concrete problem; never force a framework or architecture the project does not use.
