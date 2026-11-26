---
name: debug
description: Investigate a bug or failure methodically, find the root cause with evidence, and fix it with a regression test.
category: development
version: 1.0.0
mode: modifying
argument-hint: "<error message | stack trace | failing test | symptom description>"
standards:
  - global/project-discovery
  - global/safety-rules
  - coding/error-handling
  - coding/logging
  - testing/test-design-edge-cases
skills:
  - testing-strategy
  - clean-code
---

# /debug

## Purpose

Find and fix the **root cause** of a defect using the scientific method: reproduce, hypothesise, test, fix, prove. Avoid shotgun changes and symptom patches.

## Expected Input

An error message/stack trace, failing test name, log excerpt, or a symptom ("orders occasionally duplicate"). Ask for reproduction steps or environment only if you cannot derive them.

## Project Context Discovery

Run [project discovery](../../standards/global/project-discovery.md). Additionally:

- Determine how to run the failing scenario locally (test command, script, dev server) and the relevant runtime/environment versions.
- Check recent changes in the suspect area: `git log -p -n 10 -- <path>`, `git blame` on suspect lines, recent dependency bumps.
- Look at logging/observability available to gather evidence.

## Applicable Standards

- [Error handling](../../standards/coding/error-handling.md), [logging](../../standards/coding/logging.md)
- [Test design and edge cases](../../standards/testing/test-design-edge-cases.md) — regression test design
- [Transactions and integrity](../../standards/database/transactions-and-integrity.md) for data/race bugs

## Execution Steps

1. **Define the failure precisely**: expected vs actual, frequency (always/intermittent), first occurrence, environment, blast radius.
2. **Reproduce**: smallest deterministic reproduction (test, script, curl). If intermittent, suspect concurrency, time, ordering, caching, shared state, resource limits, or external dependency variance. If it cannot be reproduced, say so and move to evidence gathering.
3. **Read the evidence**: trace top-to-bottom; identify the first point where reality diverges from expectation; follow data, not assumptions.
4. **List ≥ 2–3 ranked hypotheses** with a cheap discriminating test for each (log, assertion, breakpoint, bisect). `git bisect` for regressions.
5. **Test hypotheses one at a time**; record what each result rules in/out. Add temporary diagnostics sparingly and **remove them** afterwards.
6. **Identify the root cause** — a mechanism that explains *all* symptoms. Ask "why" until you reach the cause that, if fixed, prevents recurrence (not merely the line that threw).
7. **Write a failing regression test** that captures the bug at the lowest practical layer.
8. **Fix minimally** at the cause; consider the same defect pattern elsewhere (search for siblings) and report them.
9. **Validate**: regression test passes, full relevant suite, lint/types; confirm the original reproduction is fixed.
10. **Report** root cause, fix and prevention.

## Output Format

- **Symptom** and **reproduction** (commands)
- **Root cause** (mechanism, `file:line`, evidence)
- **Fix** (what changed and why this is the right layer)
- **Regression test** added
- **Verification** (commands and results)
- **Related risks / siblings** and suggested hardening (monitoring, validation, timeouts)

## Safety Constraints

- Never run destructive commands, mutate production data, or call production services while debugging; use local/test environments.
- Do not disable tests, swallow the error, or add blanket `try/catch` to hide symptoms.
- Remove temporary logging/debug code; never log secrets or personal data.
- If the fix needs a data repair/migration, propose it and request approval first.

## Examples

```
/debug TypeError: Cannot read properties of undefined (reading 'id') at OrdersService.create
/debug test "applies coupon once" fails intermittently in CI
/debug users sometimes receive two confirmation emails
```
