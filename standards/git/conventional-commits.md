---
title: Conventional Commits
version: 1.0.0
---

# Conventional Commits

Follow the project's existing commit style first (check `git log`, `commitlint.config.*`, `CONTRIBUTING.md`). When none exists, use [Conventional Commits 1.0.0](https://www.conventionalcommits.org/).

## Format

```
<type>(<optional scope>)<!>: <subject>

<optional body>

<optional footers>
```

## Types

| Type | Use | SemVer |
|---|---|---|
| `feat` | New user-facing capability | MINOR |
| `fix` | Bug fix | PATCH |
| `perf` | Performance improvement | PATCH |
| `refactor` | Code change without behaviour change | – |
| `docs` | Documentation only | – |
| `test` | Add/adjust tests | – |
| `build` | Build system, dependencies | – |
| `ci` | CI configuration | – |
| `chore` | Maintenance not touching src/tests | – |
| `style` | Formatting only | – |
| `revert` | Revert a commit | – |

`!` after type/scope or a `BREAKING CHANGE:` footer marks a breaking change (MAJOR).

## Rules

- Subject: imperative mood, lower-case start, no trailing period, ≤ 72 chars (aim ≤ 50), describes *what* changed.
- Body (wrap ~72): explain **why** and any trade-offs, not the diff. Reference issues in footers: `Closes #123`, `Refs ABC-42`.
- Scope = module/package/area in the project's vocabulary (derive from folders or past commits).
- One logical change per commit; do not mix refactors with behaviour changes.
- Never include secrets or generated noise; do not claim tests were run unless they were.

## Generating a message (`/commit`)

1. Inspect `git status` and `git diff --staged` (if nothing staged, `git diff`); read recent `git log --oneline -20` for style and scopes.
2. Classify the change; if it mixes concerns, recommend splitting and propose the split.
3. Output the message in a code block. Do **not** commit unless the user asks.

## Examples

```
feat(auth): add refresh-token rotation

Rotate refresh tokens on every use and revoke the family on reuse
detection to limit the impact of token theft.

Closes #482
```

```
fix(orders)!: reject negative quantities

BREAKING CHANGE: POST /orders now returns 422 instead of 201 for quantity <= 0.
```
