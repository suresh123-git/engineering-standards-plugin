---
name: modernize
description: Update outdated language, framework and library usage to current supported patterns incrementally, preserving behaviour and compatibility.
category: development
version: 1.0.0
mode: modifying
argument-hint: "<module | pattern | upgrade goal e.g. 'callbacks to async/await'>"
standards:
  - global/project-discovery
  - global/safety-rules
  - coding/clean-code
  - security/dependency-security
  - testing/testing-strategy
skills:
  - clean-code
  - code-review
---

# /modernize

## Purpose

Replace outdated or deprecated implementation patterns (callbacks → async/await, legacy framework APIs, deprecated library calls, old module systems, class components → hooks, `var`, unsafe crypto) with current, supported equivalents — incrementally, behaviour-preserving, and consistent with the project's supported runtimes.

## Expected Input

A module, a pattern, or an upgrade goal (framework/runtime version bump). With nothing specified, produce a **modernization assessment** (prioritised list) and ask which item to execute.

## Project Context Discovery

Run [project discovery](../../standards/global/project-discovery.md). Additionally:

- Determine **supported runtime/browser targets** (`engines`, `.nvmrc`, `browserslist`, `tsconfig target`, CI matrix). Do not use language/library features unavailable on them.
- Read deprecation warnings from build/test output and official migration guides for the exact versions in use (verify against current docs; do not rely on memory for API names).
- Identify codemods provided by the ecosystem (Angular `ng update`, React codemods, Next.js codemod, `jscodeshift`, `eslint --fix` rules).
- Check dependency compatibility ranges and peer dependencies.

## Applicable Standards

- [Clean code](../../standards/coding/clean-code.md)
- [Dependency security](../../standards/security/dependency-security.md) — upgrades driven by EOL/CVEs
- [Testing strategy](../../standards/testing/testing-strategy.md) — safety net before/after

## Execution Steps

1. **Assess**: inventory outdated patterns and EOL/deprecated dependencies; rank by risk reduction, effort, and blast radius. Present the assessment (table).
2. **Select a slice** (one pattern in one area). Prefer mechanical, codemod-able changes first.
3. **Safety net**: ensure tests cover the slice; add characterization tests where missing.
4. **Check compatibility**: runtime targets, peer deps, public API consumers. Plan a compat shim or phased rollout if consumers exist.
5. **Apply in small steps**; run tests after each. Use official codemods when available and review their diff — do not trust blindly.
6. **Major upgrades** (framework/runtime): read the migration guide, upgrade one major at a time, resolve deprecations first, keep the lockfile consistent, and update CI images. Request approval before bumping major versions.
7. **Validate**: tests, lint, type check, build, bundle size, smoke test critical flows.
8. Report what changed, what remains, and any behavioural nuances (e.g., async timing differences, stricter types).

## Output Format

- **Assessment table** (pattern/dependency, location, why outdated, risk, effort, priority)
- **Executed changes** (files, before→after summary)
- **Validation results**
- **Remaining backlog** and recommended order; **risks/rollback** notes

## Safety Constraints

- No big-bang rewrites; one slice per change. Preserve behaviour and public APIs unless the user requests otherwise.
- Do not change major dependency versions, Node/JDK/runtime versions, or CI images without approval.
- Do not adopt features unsupported by deployment targets; do not follow "latest" fashion over project conventions.
- Verify API usage against official documentation/changelogs rather than recalling from memory.

## Examples

```
/modernize convert callback-based fs and DB helpers to async/await
/modernize assess this repo for deprecated APIs and EOL dependencies
/modernize Angular 15 → 17 plan and first step
```
