---
title: Testing Strategy
version: 1.0.0
---

# Testing Strategy

## Layers (test pyramid / trophy — adapt to the project)

| Layer | Scope | Characteristics | Typical tools |
|---|---|---|---|
| **Unit** | One function/class/module, pure logic | Fast (ms), no I/O, deterministic, many | Jest, Vitest, JUnit, pytest, Go `testing` |
| **Integration** | Module + real collaborators (DB, queue, HTTP boundary) | Seconds; real infra via containers (Testcontainers) or in-memory equivalents | Supertest, Testcontainers, `@nestjs/testing`, TestBed |
| **Contract** | Consumer ↔ provider API/event compatibility | Prevents breaking changes between services | Pact, OpenAPI diff |
| **End-to-end** | Critical user journeys through the deployed system | Few, slow, flaky-prone; guard with retries only for infra flake | Playwright, Cypress |
| **Non-functional** | Performance, security, accessibility, resilience | Targeted, in CI or scheduled | k6, Lighthouse, axe, chaos tests |

Distribution: many unit tests for logic, enough integration tests to prove wiring and data access, very few E2E for revenue/safety-critical flows.

## Principles

1. **Test behaviour, not implementation.** Assert observable outcomes; refactoring should not break tests.
2. **Isolation**: each test sets up and tears down its own state; no order dependence; no shared mutable fixtures; unique ids/data; control time, randomness, network.
3. **Arrange–Act–Assert**; one logical behaviour per test; descriptive names (`rejects_expired_token`, `should return 409 when email already exists`).
4. **Deterministic**: no sleeps (poll with timeout/fake timers), no reliance on wall clock, locale or timezone.
5. **Fast feedback**: unit tests runnable in a watch loop; integration tests runnable locally with one command.
6. **Regression**: every bug fix starts with a failing test that reproduces it.
7. **Failures explain themselves**: precise assertions and messages; avoid giant snapshot dumps.
8. Treat test code as production code: readable, DRY via builders/factories (not by hiding intent), no logic/conditionals in tests.

## Mocking strategy

- Mock at **architectural boundaries you own** (ports/adapters), not internals. Prefer fakes (in-memory repository) over interaction-heavy mocks.
- Do not mock the thing under test or value objects; do not mock what you don't own without a contract test (wrap it in an adapter and test the adapter against the real thing).
- Verify interactions only when the interaction *is* the behaviour (e.g., an email was sent once).
- Avoid over-specified mocks (strict call order/arguments not relevant to behaviour).
- Prefer real DB in integration tests over mocked ORMs — mocks don't catch SQL, constraint and transaction bugs.

## Framework-specific hints

NestJS: `Test.createTestingModule`, override providers, e2e with Supertest. Angular: TestBed with `HttpTestingController`, component harnesses, `fakeAsync`. React: Testing Library by role/label, user-event, MSW for network. See the stack skills.

See [test design and edge cases](test-design-edge-cases.md) and [coverage quality](coverage-quality.md).
