---
disable-model-invocation: true
description: "Improve performance and resource utilisation of code paths based on measurement, with before/after evidence and no behaviour change."
argument-hint: "<function | endpoint | page | slow scenario> [target metric]"
---
# /optimize

> **Mode: modifying.** Change only the files the task requires, explain what changed, and validate the result. Ask before any destructive or irreversible action.
>
> **User input:** $ARGUMENTS


## Purpose

Make a specific, measured bottleneck faster or cheaper (CPU, memory, I/O, queries, bundle size, rendering) while preserving behaviour and readability. **No measurement, no optimisation.**

## Expected Input

A target (function, endpoint, job, page) plus the symptom and goal ("p95 800ms → 300ms", "reduce memory", "LCP"). If no target is given, ask for the slow scenario or look for evidence (profilers, slow-query logs, CI timings).

## Project Context Discovery

Run [project discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md). Additionally:

- Find existing benchmarks, profiling scripts, APM/metrics config, Lighthouse/bundle-analyser setup, load-test scripts.
- Identify the data stores and ORM involved; locate real query plans if accessible.
- Establish the runtime profile (Node version/event loop, JVM flags, browser targets).

## Applicable Standards

- [Performance engineering](${CLAUDE_PLUGIN_ROOT}/standards/coding/performance.md)
- [Indexing and queries](${CLAUDE_PLUGIN_ROOT}/standards/database/indexing-and-queries.md) for data access
- [Frontend performance](${CLAUDE_PLUGIN_ROOT}/standards/frontend/frontend-performance.md) for UI work

## Execution Steps

1. **Baseline**: define the metric and capture current numbers with the project's tooling (benchmark, profiler, `EXPLAIN`, Lighthouse, load test). If you cannot run measurements, state the exact commands for the user and proceed with static analysis labelled as unverified.
2. **Locate the bottleneck**: profile/trace; compute where time/memory goes (80/20). Do not optimise code outside the hot path.
3. **Classify**: algorithmic complexity, I/O pattern (N+1, serial vs parallel, chatty calls), caching/redundant work, allocation/GC, blocking the event loop, payload size, rendering/bundle.
4. **Choose the least invasive fix** with the best expected gain; list alternatives with costs.
5. **Implement** with minimal diff; keep semantics identical; add comments only for non-obvious performance reasons.
6. **Prove correctness**: run existing tests; add tests for edge cases the optimisation could break (ordering, nulls, cache staleness, concurrency).
7. **Re-measure** with the same method; report before/after, variance, and any trade-offs (memory ↑, complexity ↑, staleness).
8. Stop when the goal is met; list remaining opportunities instead of continuing.

## Output Format

- **Target & goal**; **Baseline** (numbers, method)
- **Bottleneck analysis** (evidence)
- **Changes** (files, rationale) and rejected alternatives
- **Results** (after numbers, delta, caveats)
- **Risks** (correctness, cache invalidation, resource trade-offs) and monitoring suggestions

## Safety Constraints

- Do not trade correctness, security or data consistency for speed; caches need explicit invalidation and must never share per-user data.
- No schema/index changes on shared or production databases without approval and the safe-migration process ([migration safety](${CLAUDE_PLUGIN_ROOT}/standards/database/migration-safety.md)).
- Do not run load tests against production or third-party services.
- No premature micro-optimisations or unreadable "clever" code without a measured need.

## Examples

```
/optimize GET /orders endpoint — p95 is 1.2s, target 300ms
/optimize src/reports/export.ts uses 2GB memory on large accounts
/optimize product listing page LCP
```

## Shared Requirements

- Run [project context discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md) first and load the matching `stack-*` skills.
- Follow the [safety rules](${CLAUDE_PLUGIN_ROOT}/standards/global/safety-rules.md); audit-style output uses the [findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md).
- Project conventions override generic advice unless they cause a concrete problem; never force a framework or architecture the project does not use.

## Loading stack skills (plugin)

Skills in this plugin are user-invoked only, so read the matching stack skills as files: `${CLAUDE_PLUGIN_ROOT}/skills/stack-<name>/SKILL.md` (e.g. `stack-nestjs`, `stack-postgresql`), and core skills at `${CLAUDE_PLUGIN_ROOT}/skills/<name>/SKILL.md`. Read only those for technologies the project actually uses.
