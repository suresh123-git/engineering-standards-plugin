---
name: testing-strategy
description: Use when planning, writing, reviewing or debugging tests — choosing test layers, isolation and mocking, deriving edge cases, and judging coverage by risk instead of percentage.
version: 1.0.0
category: core
---

# Testing Strategy

## When to apply

Adding features or fixes, reviewing PR tests, creating test plans, diagnosing flaky tests, or deciding where tests give the most protection per effort.

## How to apply

1. Discover the test stack, conventions and run commands; mirror nearby tests ([project discovery](../../standards/global/project-discovery.md)).
2. Choose layers deliberately ([testing strategy](../../standards/testing/testing-strategy.md)): many fast unit tests for logic; integration tests with real infrastructure for wiring, queries and contracts; few E2E for critical journeys.
3. Derive cases from **behaviours**, partitions and boundaries; use the [edge-case checklist](../../standards/testing/test-design-edge-cases.md) including failure injection, auth/tenant, concurrency and idempotency.
4. Isolate: independent state, controlled time/randomness/network; mock only boundaries you own; prefer fakes and real databases (containers) over mocking ORMs.
5. Every bug fix begins with a failing regression test.
6. Assess existing tests by whether a plausible bug would fail them; use [coverage quality](../../standards/testing/coverage-quality.md) to find risk-weighted gaps.
7. Treat flaky tests as defects: find the nondeterminism; quarantine only with an owner and deadline.

## Checklist

- [ ] Tests assert behaviour/outcomes, not implementation details
- [ ] One behaviour per test; clear names; Arrange–Act–Assert
- [ ] No sleeps, order dependence, shared mutable state, or real external calls
- [ ] Error paths, boundaries and authorisation covered
- [ ] Suite runs locally with one command; failures are diagnosable

## Common mistakes

Chasing coverage numbers with assertion-free tests; snapshotting everything; mocking the unit under test; testing private methods; huge E2E suites replacing unit tests; "fixing" tests to match buggy behaviour.
