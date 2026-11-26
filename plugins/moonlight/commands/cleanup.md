---
disable-model-invocation: true
description: "Find and remove dead code, unused dependencies and unnecessary complexity safely, with proof of non-use and approval for deletions."
argument-hint: "<directory | module | blank for repo-wide report>"
---
# /cleanup

> **Mode: modifying.** Change only the files the task requires, explain what changed, and validate the result. Ask before any destructive or irreversible action.
>
> **User input:** $ARGUMENTS


## Purpose

Reduce maintenance burden by removing code that provably does nothing: unused exports, unreachable branches, obsolete flags, commented-out code, unused dependencies, stale config, duplicate helpers, and needless indirection. Deletion is proposed with evidence and applied only after approval.

## Expected Input

A directory/module or nothing (whole repo, report-first). Optional focus: `deps`, `dead-code`, `comments`, `flags`, `duplication`.

## Project Context Discovery

Run [project discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md). Additionally:

- Identify **dynamic usage** that static search misses: DI tokens, decorators/metadata, reflection, string-based route/handler lookup, dynamic `import()`, serialised class names, config-driven plugins, public library exports, templates referencing components, CLI entry points, scripts in CI/Docker.
- Find available tools already configured (`knip`, `ts-prune`, `depcheck`, `eslint no-unused-*`, `vulture`, `go vet`, IDE inspections) and use them first.
- Check whether the code is a **public API** for other repos/packages.

## Applicable Standards

- [Clean code](${CLAUDE_PLUGIN_ROOT}/standards/coding/clean-code.md) — YAGNI, readability
- [Safety rules](${CLAUDE_PLUGIN_ROOT}/standards/global/safety-rules.md) — deletion approval

## Execution Steps

1. **Scan** with project tooling and targeted searches; build a candidate list.
2. **Prove non-use** for each candidate: no references (including tests, scripts, configs, docs, generated code, dynamic lookups); check git history for recent activity/intent; check feature flags' actual state if discoverable.
3. **Classify** by confidence: *Certain* (provably unused, internal) · *Likely* (no references but dynamic usage possible) · *Unknown/Public API* (do not touch).
4. **Present the plan** as a table (item, location, evidence, confidence, risk). **Wait for approval** before deleting anything (files, exports, dependencies, flags).
5. After approval, remove in **small, separate commits/groups** (dead code, deps, comments). Update imports, barrel files, docs, lockfile via the package manager.
6. **Simplify** over-engineered bits only where behaviour-preserving and covered by tests (inline single-use wrappers, remove pass-through layers); otherwise suggest `/refactor`.
7. Run tests, lint, type check and build; confirm bundle/image does not break.
8. Report removals and any items intentionally kept.

## Output Format

- **Candidate table** (before approval) and **Summary of removals** (after)
- Lines/files/dependencies removed, size impact if measurable
- Validation results
- Kept-with-reason list; follow-ups

## Safety Constraints

- **Never delete without explicit approval**, and never touch public APIs, migrations history, generated files, vendored code or licences.
- Do not remove code merely because tests don't cover it; do not remove "TODO"/comments carrying context without checking.
- Dependency removal must go through the package manager so lockfiles stay consistent.
- Keep each change reversible (small commits); never combine cleanup with behaviour changes.

## Examples

```
/cleanup                       # repo-wide dead code and dependency report
/cleanup src/legacy deps       # unused dependencies and exports in one area
/cleanup remove expired feature flags
```

## Shared Requirements

- Run [project context discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md) first and load the matching `stack-*` skills.
- Follow the [safety rules](${CLAUDE_PLUGIN_ROOT}/standards/global/safety-rules.md); audit-style output uses the [findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md).
- Project conventions override generic advice unless they cause a concrete problem; never force a framework or architecture the project does not use.

## Loading stack skills (plugin)

Skills in this plugin are user-invoked only, so read the matching stack skills as files: `${CLAUDE_PLUGIN_ROOT}/skills/stack-<name>/SKILL.md` (e.g. `stack-nestjs`, `stack-postgresql`), and core skills at `${CLAUDE_PLUGIN_ROOT}/skills/<name>/SKILL.md`. Read only those for technologies the project actually uses.
