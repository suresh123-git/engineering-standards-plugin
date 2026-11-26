---
description: "Identify scalability limits and single points of failure in a system or feature, with load-based evidence and ordered mitigations."
argument-hint: "<service | feature | scenario> [expected load]"
allowed-tools: "Read, Grep, Glob, Bash(git diff:*), Bash(git log:*), Bash(git status:*), Bash(git show:*), Bash(git blame:*)"
---
# /scalability

> **Mode: read-only.** Do not create, modify or delete files unless the user explicitly asks you to apply the changes. Running side-effect-free inspection commands (git log/diff, tests, linters) is fine.
>
> **User input:** $ARGUMENTS


## Purpose

Find what will break first as load, data volume or team/tenant count grows — and what to do about it, in order of value. Distinguishes today's bottlenecks from those at 10× and avoids premature, speculative scaling work.

## Expected Input

A service, feature or the whole system, plus load expectations (requests/s, data size, growth, peaks, SLOs). If unknown, state assumptions and show how conclusions change with different numbers.

## Project Context Discovery

Run [project discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md). Additionally:

- Determine statefulness: in-memory sessions/caches, local files, singleton schedulers, websockets, sticky routing.
- Inventory data stores, indexes, queries on hot paths, connection pool settings, queue/topic partitioning and consumer settings.
- Read deployment config for replicas, autoscaling, resource limits, timeouts and rate limits.
- Look for existing load tests, metrics, dashboards, and slow-query evidence.

## Applicable Standards

- [Scalability](${CLAUDE_PLUGIN_ROOT}/standards/architecture/scalability.md) — analysis checklist
- [Performance](${CLAUDE_PLUGIN_ROOT}/standards/coding/performance.md), [indexing and queries](${CLAUDE_PLUGIN_ROOT}/standards/database/indexing-and-queries.md)
- [Findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md)

## Execution Steps

1. **Quantify** workload and growth; define success criteria (latency/availability/cost).
2. **Trace the critical paths** end to end and list every shared resource (DB, cache, queue, third-party API, CPU, memory, locks, connections).
3. **Estimate capacity** of each resource versus demand (back-of-envelope with explicit formulas); identify the first saturation point.
4. **Walk the checklist**: statelessness, data tier, sync chains, fan-out/amplification, queues, caching, resource limits, resilience patterns, elasticity, cost.
5. **Find single points of failure** and unbounded operations (queries, loops, payloads, retries, memory).
6. **Rank limitations** by (impact at target load) × (probability) ÷ (fix cost); label each *today* / *at 10×*.
7. **Recommend mitigations** (cheap first: indexes, caching, batching, async offload, connection tuning; then structural: partitioning, read replicas, CQRS, queueing), with trade-offs and how to verify (load test scenario, metrics, thresholds).
8. Propose the **load-test plan** and observability needed to confirm.

## Output Format

```
## Assumptions & workload model
## Critical path and shared resources (diagram)
## Capacity estimates (table: resource | limit | demand | headroom)
## Findings (shared format; each tagged today / at 10×)
## Mitigation plan (ordered, with effort/risk and verification)
## Load-test & metrics plan
```

## Safety Constraints

- Read-only. Do not run load tests or heavy queries against production or shared environments.
- Mark estimates as estimates; don't present invented numbers as measurements.
- Don't recommend distributed-system complexity without a measured or credibly forecast need.

## Examples

```
/scalability checkout service — expecting 20x traffic on Black Friday
/scalability notification fan-out to 2M users
/scalability src/reports — monthly data volume grows 15% per month
```

## Shared Requirements

- Run [project context discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md) first and load the matching `stack-*` skills.
- Follow the [safety rules](${CLAUDE_PLUGIN_ROOT}/standards/global/safety-rules.md); audit-style output uses the [findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md).
- Project conventions override generic advice unless they cause a concrete problem; never force a framework or architecture the project does not use.
