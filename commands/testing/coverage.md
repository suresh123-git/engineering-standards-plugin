---
name: coverage
description: Identify missing test scenarios by risk and assertion quality, not by percentage, and propose concrete tests to close the gaps.
category: testing
version: 1.0.0
mode: read-only
argument-hint: "<directory | module | feature | blank for repo>"
standards:
  - global/project-discovery
  - global/safety-rules
  - global/review-findings
  - testing/coverage-quality
  - testing/test-design-edge-cases
skills:
  - testing-strategy
---

# /coverage

## Purpose

Find where bugs could slip through: untested behaviours, missing edge/error/security scenarios, weak assertions, and over-mocked tests — prioritised by business risk and change frequency. Outputs a gap analysis and named test cases ready for `/test`.

## Expected Input

A module, directory, feature, or the repo. Optional: path to an existing coverage report.

## Project Context Discovery

Run [project discovery](../../standards/global/project-discovery.md). Additionally:

- Find coverage artifacts (`coverage/lcov.info`, `coverage-summary.json`, `jacoco.xml`, `coverage.xml`) and configured thresholds; if allowed, run the project's coverage command.
- Map source ↔ test files by naming and imports; list untested files and modules.
- Compute risk signals: churn, bug-fix commits, complexity, money/auth/data-integrity logic, public API boundaries.

## Applicable Standards

- [Coverage quality](../../standards/testing/coverage-quality.md) — risk-based gap analysis
- [Test design and edge cases](../../standards/testing/test-design-edge-cases.md)
- [Testing strategy](../../standards/testing/testing-strategy.md)

## Execution Steps

1. Gather coverage data (report or static mapping) and note its limits (line vs branch, excluded paths).
2. Rank units by **risk × change frequency × current coverage**.
3. For each high-risk unit, read the code and existing tests; enumerate **behaviours** and mark: covered · partially · not covered.
4. List **missing scenarios** concretely: untested branches, error paths, boundaries, concurrency/idempotency, authorisation, input validation, integration points (DB constraints, transactions, queues), regression cases from past `fix:` commits.
5. Assess **assertion quality** of existing tests: no-assert tests, mock-only assertions, snapshot abuse, brittle implementation coupling, flaky patterns, `skip/only/xit`.
6. For each gap propose the **test name, layer, setup, and assertion** (one line each) and effort (S/M/L).
7. Recommend policy: diff-coverage gate, branch thresholds on core domain, mutation testing for critical modules, and flaky-test handling.

## Output Format

```
## Snapshot (overall numbers if available + caveats)
## Risk-ranked gaps (table: area | risk | what's missing | suggested layer | effort)
## Missing scenarios (grouped per unit: test name → assertion)
## Weak/over-mocked existing tests
## Recommended policy and next steps  (→ run /test on items 1..n)
```
Use the shared findings format for severe gaps (e.g., untested auth or payment logic = High).

## Safety Constraints

- Read-only: do not add tests (that is `/test`) or alter config/thresholds.
- Running coverage is allowed only if it has no side effects; never against production data.
- Do not equate percentage with quality or demand 100%.

## Examples

```
/coverage
/coverage src/payments
/coverage coverage/lcov.info — focus on auth and billing
```
