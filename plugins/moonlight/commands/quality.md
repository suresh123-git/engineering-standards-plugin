---
disable-model-invocation: true
description: "Evaluate overall code quality across maintainability, design, tests, tooling and risk hot-spots, with a scored, prioritised improvement plan."
argument-hint: "<repo | directory | module>"
allowed-tools: "Read, Grep, Glob, Bash(git diff:*), Bash(git log:*), Bash(git status:*), Bash(git show:*), Bash(git blame:*)"
---
# /quality

> **Mode: read-only.** Do not create, modify or delete files unless the user explicitly asks you to apply the changes. Running side-effect-free inspection commands (git log/diff, tests, linters) is fine.
>
> **User input:** $ARGUMENTS


## Purpose

Give a balanced, evidence-based assessment of a codebase's health and the highest-return improvements. Unlike `/review` (defects in a change), `/quality` looks at **systemic** maintainability and engineering hygiene. It scores dimensions, finds hot-spots, and proposes a sequenced plan.

## Expected Input

A repository, directory or module. Optional concern ("onboarding is slow", "bugs keep recurring").

## Project Context Discovery

Run [project discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md). Additionally gather **objective signals** with available tools and git history:

- Size/complexity: largest files/functions, nesting depth, cyclomatic complexity (via configured linters/tools).
- Churn × complexity hot-spots: `git log --since=12.months --name-only | sort | uniq -c | sort -rn | head`.
- Bug-fix density per file (commits matching `fix`), TODO/FIXME/HACK counts, skipped/disabled tests, lint-suppression counts, `any`/`ts-ignore`/`noqa` usage.
- Test inventory and CI status; dependency age; documentation presence.

## Applicable Standards

- [Clean code](${CLAUDE_PLUGIN_ROOT}/standards/coding/clean-code.md), [SOLID](${CLAUDE_PLUGIN_ROOT}/standards/architecture/solid.md), [coverage quality](${CLAUDE_PLUGIN_ROOT}/standards/testing/coverage-quality.md)
- [Error handling](${CLAUDE_PLUGIN_ROOT}/standards/coding/error-handling.md), [logging](${CLAUDE_PLUGIN_ROOT}/standards/coding/logging.md), [documentation](${CLAUDE_PLUGIN_ROOT}/standards/documentation/documentation-standards.md)
- [Findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md)

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

## Shared Requirements

- Run [project context discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md) first and load the matching `stack-*` skills.
- Follow the [safety rules](${CLAUDE_PLUGIN_ROOT}/standards/global/safety-rules.md); audit-style output uses the [findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md).
- Project conventions override generic advice unless they cause a concrete problem; never force a framework or architecture the project does not use.

## Loading stack skills (plugin)

Skills in this plugin are user-invoked only, so read the matching stack skills as files: `${CLAUDE_PLUGIN_ROOT}/skills/stack-<name>/SKILL.md` (e.g. `stack-nestjs`, `stack-postgresql`), and core skills at `${CLAUDE_PLUGIN_ROOT}/skills/<name>/SKILL.md`. Read only those for technologies the project actually uses.
