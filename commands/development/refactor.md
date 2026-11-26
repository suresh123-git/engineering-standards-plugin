---
name: refactor
description: Refactor code to improve structure and readability while strictly preserving observable behaviour, protected by tests.
category: development
version: 1.0.0
mode: modifying
argument-hint: "<file | symbol | directory> [goal]"
standards:
  - global/project-discovery
  - global/safety-rules
  - coding/clean-code
  - architecture/solid
  - architecture/design-patterns
  - testing/testing-strategy
skills:
  - clean-code
  - solid-principles
  - design-patterns
---

# /refactor

## Purpose

Improve internal structure (naming, cohesion, duplication, coupling, complexity) **without changing behaviour**. Works in small, verifiable steps under test protection. It is not a feature or bug-fix command; if behaviour must change, stop and say so.

## Expected Input

A target (file, function, class, module) and optionally a goal ("split this service", "remove duplication", "make this testable"). With no goal, pick the highest-value smell in the target and state it.

## Project Context Discovery

Run [project discovery](../../standards/global/project-discovery.md). Additionally:

- Find **all usages** of the target (callers, imports, DI registrations, reflection/string-based references, public API surface, serialised formats).
- Locate existing tests for the target; measure/estimate how well they pin behaviour.
- Check for a public contract (exported API, REST/GraphQL schema, events) — it must remain stable.

## Applicable Standards

- [Clean code](../../standards/coding/clean-code.md) — smells and target shapes
- [SOLID](../../standards/architecture/solid.md) and [design patterns](../../standards/architecture/design-patterns.md) — apply only where a force exists
- [Testing strategy](../../standards/testing/testing-strategy.md) — characterization tests

## Execution Steps

1. **Define scope and the behaviour contract**: inputs, outputs, side effects, errors, ordering, performance-sensitive aspects.
2. **Establish a safety net**: run existing tests. If coverage of the target is inadequate, write **characterization tests** that pin current behaviour (including odd behaviour) *before* touching code; report if you cannot.
3. **Identify smells with evidence**: long functions, mixed abstraction levels, duplication of *knowledge*, feature envy, primitive obsession, deep nesting, flag parameters, god classes, hidden dependencies.
4. **Plan a sequence of small, named refactorings** (Extract Function, Rename, Move, Introduce Parameter Object, Replace Conditional with Polymorphism, Inject Dependency, Replace Magic Value…). Each step must keep the build green.
5. **Apply one step at a time**; run tests after each (or each small batch). Use IDE-grade renames; update all references.
6. **Keep public signatures** stable; if a public API must move, keep a deprecated forwarding shim and report it.
7. **Do not mix** formatting, dependency upgrades or behaviour changes into the refactor.
8. Final validation: tests, lint, types, build. Compare before/after complexity qualitatively; note any performance-relevant changes.
9. Report.

## Output Format

- **Goal and scope**
- **Smells addressed** (with `file:line` evidence) and refactorings applied, in order
- **Files changed**
- **Behaviour preservation evidence**: tests run (before/after results), characterization tests added
- **Deferred opportunities** (not done, and why)
- **Risks** and anything reviewers should double-check

## Safety Constraints

- Behaviour must not change: no new features, no bug fixes (report discovered bugs separately, ask before fixing).
- Stop if tests fail and the cause is not understood; revert the last step rather than patching tests to match.
- Do not delete files or public symbols without approval; no changes outside the stated scope.
- Do not introduce abstractions with a single implementation unless a boundary/testing need exists.

## Examples

```
/refactor src/billing/invoice.service.ts split responsibilities
/refactor processOrder() reduce nesting and extract validation
/refactor src/utils remove duplication in date helpers
```
