---
description: "Explain code, dependencies and execution flows accurately at the reader's level, with traceable references to the source."
argument-hint: "<file | function | module | flow question> [audience]"
allowed-tools: "Read, Grep, Glob, Bash(git diff:*), Bash(git log:*), Bash(git status:*), Bash(git show:*), Bash(git blame:*)"
---
# /explain

> **Mode: read-only.** Do not create, modify or delete files unless the user explicitly asks you to apply the changes. Running side-effect-free inspection commands (git log/diff, tests, linters) is fine.
>
> **User input:** $ARGUMENTS


## Purpose

Help someone understand how code works and why: what it does, how data and control flow through it, what it depends on, and where the risks and surprises are. Explanations must be grounded in the actual code — never in guesses.

## Expected Input

A file, symbol, module, endpoint, or a question ("what happens when a user checks out?"). Optional audience hint (new hire, reviewer, non-technical). Default: a mid-level engineer new to this codebase.

## Project Context Discovery

Run [project discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md) (light pass). Additionally:

- Trace **real** references: imports, DI registrations/providers, route tables, event subscriptions, config that wires behaviour at runtime.
- Read tests and docs for intent; check git history/blame for *why* when the code is surprising.
- Identify framework magic (decorators, interceptors, middleware, lifecycle hooks, ORM hooks) that changes flow invisibly.

## Applicable Standards

- [Clean architecture](${CLAUDE_PLUGIN_ROOT}/standards/architecture/clean-architecture.md) vocabulary — only if the project uses those layers
- [Clean code](${CLAUDE_PLUGIN_ROOT}/standards/coding/clean-code.md) — to flag confusing or risky constructs honestly

## Execution Steps

1. Clarify the target and depth (overview vs line-by-line). Don't ask if inferable.
2. Locate entry points and follow the flow to its side effects (DB, network, files, queues, caches).
3. Build the explanation in layers: **one-paragraph summary → key concepts → step-by-step flow → dependencies → edge cases/gotchas**.
4. Use a diagram when it clarifies (Mermaid sequence/flow/component diagram in a fenced block).
5. Reference code as `path:line` so the reader can navigate. Quote only short snippets that matter.
6. Separate **fact** (read in code) from **inference** (likely intent, marked as such) and **unknown** (couldn't determine).
7. Call out risks, surprising behaviour, hidden coupling, and dead or suspicious code — as observations, not a full review (suggest `/review` for that).

## Output Format

```
## Summary
## How it works (numbered flow with path:line)
## Key dependencies and configuration
## Data and side effects
## Gotchas / things to know
## Open questions (what could not be determined)
```
Optional Mermaid diagram after "How it works".

## Safety Constraints

- Read-only. Do not modify files. Do not execute code with side effects to "see what happens".
- Never reveal secret values encountered in config; describe them as "a secret loaded from X".
- Do not present guesses as facts; say when behaviour depends on runtime data you cannot see.

## Examples

```
/explain src/auth/jwt.strategy.ts
/explain what happens between POST /checkout and the confirmation email
/explain this repo's module structure for a new hire
```

## Shared Requirements

- Run [project context discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md) first and load the matching `stack-*` skills.
- Follow the [safety rules](${CLAUDE_PLUGIN_ROOT}/standards/global/safety-rules.md); audit-style output uses the [findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md).
- Project conventions override generic advice unless they cause a concrete problem; never force a framework or architecture the project does not use.
