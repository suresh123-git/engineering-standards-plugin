---
name: quality
description: Evaluate overall code quality across maintainability, design, tests, tooling and risk hot-spots, with a scored, prioritised improvement plan.
category: quality
version: 1.0.0
mode: read-only
argument-hint: "<repo | directory | module>"
standards:
  - global/project-discovery
  - global/safety-rules
  - global/review-findings
  - coding/clean-code
  - architecture/solid
  - testing/coverage-quality
skills:
  - clean-code
  - code-review
  - testing-strategy
---

# /quality

## Purpose

Give a balanced, evidence-based assessment of a codebase's health and the highest-return improvements. Unlike `/review` (defects in a change), `/quality` looks at **systemic** maintainability and engineering hygiene. It scores dimensions, finds hot-spots, and proposes a sequenced plan.

## Expected Input

A repository, directory or module. Optional concern ("onboarding is slow", "bugs keep recurring").

## Project Context Discovery

Run [project discovery](../../standards/global/project-discovery.md). Additionally gather **objective signals** with available tools and git history:

- Size/complexity: largest files/functions, nesting depth, cyclomatic complexity (via configured linters/tools).
- Churn × complexity hot-spots: `git log --since=12.months --name-only | sort | uniq -c | sort -rn | head`.
- Bug-fix density per file (commits matching `fix`), TODO/FIXME/HACK counts, skipped/disabled tests, lint-suppression counts, `any`/`ts-ignore`/`noqa` usage.
- Test inventory and CI status; dependency age; documentation presence.

## Applicable Standards

- [Clean code](../../standards/coding/clean-code.md), [SOLID](../../standards/architecture/solid.md), [coverage quality](../../standards/testing/coverage-quality.md)
- [Error handling](../../standards/coding/error-handling.md), [logging](../../standards/coding/logging.md), [documentation](../../standards/documentation/documentation-standards.md)
- [Findings format](../../standards/global/review-findings.md)

## Execution Steps

1. Run discovery and collect the objective signals above; note any you could not obtain.
2. **Score dimensions 1–5 with evidence** (not vibes): readability & naming · structure & modularity · duplication & dead code · error handling & logging · type safety · test quality & coverage of risk · tooling (lint/format/CI) · dependency health · documentation · security hygiene.
3. Sample representative files in each hot-spot; verify the smell is real (read code) before reporting.
4. Identify **top 5–10 issues** by impact on change velocity and defect risk; group by root cause.
5. Identify what is **good** and should be preserved or replicated.
6. Build a **prioritised plan**: quick wins (≤ 1 day), medium (≤ 1 sprint), strategic (needs a decision), each with expected benefit and risk; suggest the command to execute each (`/refactor`, `/test`, `/cleanup`, …).
7. Define **measurable targets** and how to track them (lint rules, complexity budgets, diff-coverage gate).

## Output Format

```
## Verdict (1 paragraph) and overall score
## Scorecard (dimension | score 1–5 | evidence)
## Hot-spots (file | signal | why it matters)
## Top findings (shared format, grouped by root cause)
## Strengths to keep
## Improvement plan (quick wins / medium / strategic)
## Metrics to track
```

## Safety Constraints

- Read-only; running tools must be non-mutating (no `--fix`, no installs).
- Don't compare against an abstract ideal; judge relative to the project's goals, age and team conventions.
- Avoid vanity metrics; do not present tool output you did not run or read.

## Examples

```
/quality
/quality src/payments
/quality — new team inherited this service, where do we start?
```
