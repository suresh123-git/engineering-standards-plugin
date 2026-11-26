---
title: Clean Code
version: 1.0.0
---

# Clean Code

Applies to every language. Project conventions win over anything here (see [project discovery](../global/project-discovery.md)).

## Naming

- Names reveal intent: `retryDelayMs`, not `d`. Avoid encodings, abbreviations nobody else uses, and generic names (`data`, `manager`, `helper`, `util`) for new code.
- Booleans read as predicates (`isExpired`, `hasAccess`). Functions are verbs; types are nouns. Same concept → same word everywhere.
- Name length proportional to scope: short in a 3-line loop, descriptive at module level.

## Functions

- Do one thing at one level of abstraction. If you need "and" to describe it, split it.
- Prefer ≤ 3 parameters; group related ones into an object/type. Avoid boolean flag parameters that switch behaviour — use two functions.
- No hidden side effects; separate queries from commands.
- Early returns and guard clauses over deep nesting (aim ≤ 3 levels).
- Length is a smell, not a rule: split when a function mixes abstraction levels or needs section comments.

## Separation of concerns

- Keep I/O (HTTP, DB, filesystem, clock, randomness) at the edges; keep decision logic pure and testable.
- A module changes for one reason. Do not mix validation, business rules, persistence and presentation in one unit.

## DRY, KISS, YAGNI

- **DRY** applies to knowledge, not to similar-looking text. Duplicate twice; abstract on the third occurrence when the shared reason to change is clear.
- **KISS**: the simplest design that satisfies today's requirements and tests.
- **YAGNI**: no speculative parameters, hooks, config, interfaces or layers. Delete the unused.
- **Premature abstraction** is worse than duplication: a wrong abstraction couples unrelated code. Prefer duplication until the pattern is proven.

## Readability and maintainability

- Code is read far more than written. Optimise for the next reader.
- Comments explain *why* (constraints, trade-offs, links to issues), never restate *what*. Delete commented-out code.
- Replace magic numbers/strings with named constants or enums.
- Make illegal states unrepresentable with types where the language allows.
- Handle errors explicitly; never swallow exceptions silently (see [error handling](error-handling.md)).
- Keep the diff reviewable: small, focused changes; refactors separate from behaviour changes.

## Smells worth reporting (with evidence)

Long parameter lists, feature envy, shotgun surgery, god classes, primitive obsession, dead code, duplicated branches, boolean blindness, temporal coupling, leaky abstractions, inconsistent naming for one concept.

## What is *not* a defect

Formatting the formatter allows, naming taste within project conventions, using a different-but-valid idiom than you would choose.
