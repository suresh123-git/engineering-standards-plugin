---
description: "Analyse a production incident from logs, metrics and code to establish timeline, root cause, contributing factors and preventive actions."
argument-hint: "<incident description | logs | alert | time window>"
allowed-tools: "Read, Grep, Glob, Bash(git diff:*), Bash(git log:*), Bash(git status:*), Bash(git show:*), Bash(git blame:*)"
---
# /incident

> **Mode: read-only.** Do not create, modify or delete files unless the user explicitly asks you to apply the changes. Running side-effect-free inspection commands (git log/diff, tests, linters) is fine.
>
> **User input:** $ARGUMENTS


## Purpose

Run a blameless, evidence-driven post-incident analysis: what happened and when, why it happened, why it wasn't caught/mitigated sooner, and what will prevent recurrence. During a live incident, prioritises **mitigation options** before deep analysis.

## Expected Input

Incident description, alert text, logs/metrics excerpts, deploy history or time window, error samples. If the incident is **live**, say so: the first output is mitigation options.

## Project Context Discovery

Run [project discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md). Additionally:

- Correlate with **change**: recent commits/releases/config/feature-flag/migration changes near the start time (`git log --since`, deploy history, IaC changes).
- Identify the failing path in code and its dependencies, timeouts, retries, pools and limits.
- Find relevant runbooks, dashboards and prior incidents in docs.

## Applicable Standards

- [Observability](${CLAUDE_PLUGIN_ROOT}/standards/devops/observability.md), [error handling](${CLAUDE_PLUGIN_ROOT}/standards/coding/error-handling.md), [transactions and integrity](${CLAUDE_PLUGIN_ROOT}/standards/database/transactions-and-integrity.md)
- Template: [incident report](${CLAUDE_PLUGIN_ROOT}/templates/incident-report.md); runbook: [template](${CLAUDE_PLUGIN_ROOT}/templates/runbook.md)

## Execution Steps

1. **Triage** (if live): impact, blast radius, safest mitigations ranked by speed and risk — rollback, feature-flag off, scale out, shed load, failover, disable a consumer. Recommend; **do not execute**. Note data-integrity risks of each.
2. **Establish facts and timeline** (UTC): first symptom, trigger, detection, mitigation, recovery. Distinguish evidence (log lines, metrics, commits) from hypotheses.
3. **Quantify impact**: users/tenants, requests failed, duration, data loss/corruption, SLA/SLO effect.
4. **Find the trigger and root cause** with the "5 whys", checking: recent changes, resource exhaustion (connections, memory, threads, disk), dependency failures, cascading retries/thundering herd, lock contention/slow queries, bad data, expired credentials/certs, quota/rate limits, time/DST/clock issues, race conditions.
5. **Contributing factors**: missing tests, alerts or runbooks, risky deploy practices, absent timeouts/backpressure, config drift, unclear ownership. Keep it blameless and systemic.
6. **Detection & response review**: time-to-detect/acknowledge/mitigate/resolve and what slowed each.
7. **Corrective & preventive actions**: prioritised, each with type (prevent/detect/mitigate), owner placeholder, and verification; include "data repair" steps if needed (proposal only).
8. Produce the report using the incident template.

## Output Format

Incident report per [template](${CLAUDE_PLUGIN_ROOT}/templates/incident-report.md): summary, impact, timeline table, root cause & contributing factors (with evidence references), detection/response analysis, action items table, lessons learned. Plus, if live: **immediate mitigation options** section at the top.

## Safety Constraints

- Read-only analysis. **Do not run remediation, restart services, change production config, or touch production data.** Provide commands for authorised operators instead.
- Redact secrets and personal data from logs you quote; quote minimal excerpts.
- Do not assign personal blame; do not state a root cause as certain if evidence is partial — state confidence and what would confirm it.

## Examples

```
/incident checkout latency spiked to 12s at 14:05 UTC after deploy 2.4.1; logs attached
/incident LIVE: 500s on /payments, DB connections at max
/incident write the post-incident report for yesterday's queue backlog
```

## Shared Requirements

- Run [project context discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md) first and load the matching `stack-*` skills.
- Follow the [safety rules](${CLAUDE_PLUGIN_ROOT}/standards/global/safety-rules.md); audit-style output uses the [findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md).
- Project conventions override generic advice unless they cause a concrete problem; never force a framework or architecture the project does not use.
