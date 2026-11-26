---
disable-model-invocation: true
description: "Recommend appropriate design patterns for a concrete problem or code smell, or flag misused patterns, with minimal idiomatic sketches."
argument-hint: "<problem description | file | module>"
allowed-tools: "Read, Grep, Glob, Bash(git diff:*), Bash(git log:*), Bash(git status:*), Bash(git show:*), Bash(git blame:*)"
---
# /patterns

> **Mode: read-only.** Do not create, modify or delete files unless the user explicitly asks you to apply the changes. Running side-effect-free inspection commands (git log/diff, tests, linters) is fine.
>
> **User input:** $ARGUMENTS


## Purpose

Match a real design force in the code to a proven pattern — or tell the user no pattern is needed. Also detects misapplied patterns and anti-patterns. Pattern recommendations are always justified by concrete evidence in the codebase.

## Expected Input

A problem statement ("many payment providers, each with different flows"), a smell ("this switch keeps growing"), or code to analyse. If given code only, derive the forces yourself.

## Project Context Discovery

Run [project discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md). Additionally:

- Find patterns **already in use** (strategy maps, factories, repositories, middleware, observers/event buses) and their conventions — extend those before introducing new ones.
- Check language features that make classic patterns unnecessary (first-class functions, union types, modules, decorators, DI container).
- Check framework-provided equivalents (NestJS interceptors/pipes/guards, Angular DI and RxJS, Express middleware, Spring AOP).

## Applicable Standards

- [Design patterns](${CLAUDE_PLUGIN_ROOT}/standards/architecture/design-patterns.md) — selection guide and anti-patterns
- [SOLID](${CLAUDE_PLUGIN_ROOT}/standards/architecture/solid.md), [clean code](${CLAUDE_PLUGIN_ROOT}/standards/coding/clean-code.md) — YAGNI and premature abstraction

## Execution Steps

1. **State the forces**: what varies, what must stay stable, what hurts (duplication, conditionals, coupling, testability, lifecycle, concurrency, reliability).
2. **Collect evidence** in code (`file:line`) and expected change frequency; find ≥ 2 concrete variants or a testing/boundary need before suggesting variation-based patterns.
3. **Shortlist** 1–3 candidate patterns from the selection guide, including the "do nothing / simple function" option.
4. **Compare** on fit with the existing codebase, added indirection, testability, and migration cost.
5. **Recommend one** and sketch it **in the project's language and style**: names, signatures, wiring/registration, how it replaces the current code, and a test sketch. Keep it < ~40 lines.
6. **Warn** of pitfalls specific to this choice (hidden coupling for observers, global state for singletons, over-inheritance).
7. If an existing pattern is misapplied, name it and explain the simpler alternative.

## Output Format

```
## Problem and forces
## Evidence (file:line)
## Options (table: pattern | fit | cost | verdict)
## Recommendation (+ minimal sketch)
## Migration steps (small, safe)
## Pitfalls / when not to do this
```

## Safety Constraints

- Read-only advice; do not rewrite code. Offer `/refactor` or `/implement` to apply.
- No "pattern for its own sake"; no speculative flexibility. Respect project conventions.

## Examples

```
/patterns shipping cost calculation has 7 carriers and keeps growing
/patterns src/notifications — are these listeners a good design?
/patterns need retries and fallback around the payment client
```

## Shared Requirements

- Run [project context discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md) first and load the matching `stack-*` skills.
- Follow the [safety rules](${CLAUDE_PLUGIN_ROOT}/standards/global/safety-rules.md); audit-style output uses the [findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md).
- Project conventions override generic advice unless they cause a concrete problem; never force a framework or architecture the project does not use.

## Loading stack skills (plugin)

Skills in this plugin are user-invoked only, so read the matching stack skills as files: `${CLAUDE_PLUGIN_ROOT}/skills/stack-<name>/SKILL.md` (e.g. `stack-nestjs`, `stack-postgresql`), and core skills at `${CLAUDE_PLUGIN_ROOT}/skills/<name>/SKILL.md`. Read only those for technologies the project actually uses.
