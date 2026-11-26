---
disable-model-invocation: true
name: "clean-code"
description: "Use when writing, reviewing or refactoring code for readability and maintainability — naming, function size, duplication, abstraction and smells — while respecting existing project conventions."
---
# Clean Code

## When to apply

Any time you write or change code, review a diff, or assess maintainability. Do **not** apply it to rewrite working code purely for taste, to override the project's formatter/linter, or to fight established local idioms.

## How to apply

1. Learn the local conventions first (naming, file layout, error style, test style) via [project discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md). Match them.
2. Use the [clean code standard](${CLAUDE_PLUGIN_ROOT}/standards/coding/clean-code.md) for naming, functions, separation of concerns, DRY/KISS/YAGNI and abstraction timing.
3. When writing: smallest readable solution; guard clauses; explicit error handling ([error handling](${CLAUDE_PLUGIN_ROOT}/standards/coding/error-handling.md)); no speculative parameters or layers.
4. When reviewing: report a smell only with `file:line` evidence and a concrete cost (bug risk, change friction, onboarding). Use the [findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md).
5. Refactors preserve behaviour and are separate from feature changes.

## Checklist

- [ ] Names reveal intent; consistent vocabulary
- [ ] Functions do one thing at one abstraction level; ≤ ~3 params; shallow nesting
- [ ] I/O at edges, logic testable in isolation
- [ ] No duplicated *knowledge*; no premature abstraction; no dead code
- [ ] Comments explain why; no commented-out code
- [ ] Errors handled, not swallowed

## Common mistakes

Splitting functions until the flow is unreadable; abstracting after one occurrence; renaming across the codebase without need; calling any long function "bad" without looking at its cohesion; reporting formatter-enforced style as defects.
