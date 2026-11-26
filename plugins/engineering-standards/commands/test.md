---
description: "Generate meaningful unit and integration tests that follow the project's test framework, style and isolation rules, and run them."
argument-hint: "<file | function | class | feature> [unit | integration]"
---
# /test

> **Mode: modifying.** Change only the files the task requires, explain what changed, and validate the result. Ask before any destructive or irreversible action.
>
> **User input:** $ARGUMENTS


## Purpose

Write tests that would **fail if the behaviour broke**: clear, isolated, deterministic unit and integration tests in the project's own framework and style, covering happy paths, boundaries and failure modes. It adds tests only; production code changes are out of scope unless needed for testability and approved.

## Expected Input

A target (file, function, class, endpoint, feature) and optionally a level (`unit`, `integration`). If the target has no clear specification, infer behaviour from code, docs and usage and **list the assumptions** in the report.

## Project Context Discovery

Run [project discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md). Additionally:

- Identify the test runner, assertion style, mocking library, test file location/naming and how to run a **single** test file and the whole suite.
- Read 2–3 existing tests near the target and copy their structure (describe/it naming, setup, fixtures, builders, test DB strategy).
- Check available test infrastructure: test containers, in-memory DB, MSW/nock, test modules (`Test.createTestingModule`, `TestBed`), factories.
- Load matching `stack-*` skills for **Testing conventions**.

## Applicable Standards

- [Testing strategy](${CLAUDE_PLUGIN_ROOT}/standards/testing/testing-strategy.md) — layers, isolation, mocking policy
- [Test design and edge cases](${CLAUDE_PLUGIN_ROOT}/standards/testing/test-design-edge-cases.md) — case derivation and checklist
- [Coverage quality](${CLAUDE_PLUGIN_ROOT}/standards/testing/coverage-quality.md)

## Execution Steps

1. Read the target and its collaborators; list **behaviours** (not lines): inputs → outputs/effects, branches, errors, side effects, invariants.
2. Choose the right level per behaviour: pure logic → unit; wiring/data access/HTTP contract → integration; avoid E2E unless asked.
3. Derive cases using equivalence partitions and boundaries; add error injection, auth/tenant cases (for endpoints), idempotency/concurrency where relevant. Use the edge-case checklist.
4. Design test data with builders/factories; control time, randomness and network; prefer fakes over deep mocks; mock only at boundaries you own.
5. Write tests: Arrange–Act–Assert, one behaviour per test, descriptive names, no logic or conditionals, no order dependence, cleanup of state.
6. Run the new tests; fix test mistakes. If a test reveals a **real bug**, do not "fix" the test — report it (and ask before changing production code).
7. Sanity-check strength: temporarily reason (or mutate) — would a plausible bug fail these tests? Strengthen weak assertions.
8. Run the surrounding suite, lint and type check to confirm no interference.

## Output Format

- **Tests added** (file → test names grouped by behaviour)
- **Coverage rationale**: behaviours/edge cases covered and deliberately not covered
- **Run results** (commands + pass/fail)
- **Assumptions** and **bugs/risks discovered**
- Suggested follow-ups (`/coverage` for gaps)

## Safety Constraints

- Create/modify test files and test fixtures only; do not change production code without approval.
- Never call real external services, production databases or send real emails/payments from tests; no secrets in fixtures.
- Do not skip, `.only`, or loosen existing tests; do not snapshot-test everything; no sleeps — use fake timers/polling.

## Examples

```
/test src/orders/orders.service.ts unit
/test POST /auth/login integration
/test calculateDiscount() boundaries and rounding
```

## Shared Requirements

- Run [project context discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md) first and load the matching `stack-*` skills.
- Follow the [safety rules](${CLAUDE_PLUGIN_ROOT}/standards/global/safety-rules.md); audit-style output uses the [findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md).
- Project conventions override generic advice unless they cause a concrete problem; never force a framework or architecture the project does not use.
