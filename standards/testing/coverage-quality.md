---
title: Coverage Quality
version: 1.0.0
---

# Coverage Quality

Coverage percentage measures what code ran, not whether behaviour is verified. Use it as a **map of untested areas**, not a target to game.

## Analysing gaps (`/coverage`)

1. Locate existing coverage output (`coverage/lcov.info`, `coverage-summary.json`, `jacoco.xml`, `coverage.xml`) or run the project's coverage command if permitted. Otherwise map source files to test files by naming/imports.
2. Rank gaps by **risk × change frequency**: money/auth/data-integrity/security logic, complex branching (high cyclomatic complexity), recently changed or bug-prone files (`git log --since`, bug-fix commits), public API boundaries.
3. For each risky unit, enumerate **missing scenarios**: untested branches, error paths, boundaries, concurrency, authorization cases, integration points (see [test design](test-design-edge-cases.md)).
4. Evaluate **assertion quality** of existing tests: Are outcomes asserted? Would a plausible bug fail a test? (Mutation testing — Stryker, PIT, mutmut — is the strongest signal; recommend for critical modules.)
5. Distinguish **line vs branch vs path** coverage; prefer branch coverage for logic.

## Recommended policy

- Don't chase 100%. Typical guidance: meaningful branch coverage on domain/business logic (≈80%+), pragmatic on glue/config/DTOs.
- Enforce **no decrease** and a **diff-coverage** threshold on new/changed lines in CI rather than a global number.
- Exclude generated code and trivial boilerplate explicitly, with a reason.
- Critical flows require E2E/integration coverage regardless of unit percentage.

## Anti-patterns

Tests without assertions written to raise coverage; asserting on mocks only; snapshot-everything; testing private methods; coverage exclusions for inconvenient code; ignoring flaky tests instead of fixing them.

## Output for `/coverage`

Prioritised list: *Area → why risky → missing scenarios (concrete test names) → suggested test layer → effort*. Offer to generate the tests (switch to `/test`).
