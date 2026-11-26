---
name: engineering-principles
description: Always-on engineering principles for every coding task — correctness, simplicity, security, tests and honesty.
scope: always
globs: []
version: 1.0.0
---

# Engineering Principles

- Understand the task and inspect the relevant code **before** changing anything.
- Prefer the smallest solution that is correct, readable and consistent with the project; no speculative abstractions or features.
- Handle errors explicitly; never swallow them. Validate input at boundaries.
- Treat security as a baseline: authorisation on every entry point, parameterised queries, no secrets in code or logs.
- Add or update tests for behaviour you change; run the relevant tests, linter and type check when possible.
- Be honest: say what you verified, what you assumed, and what you could not check. Never invent APIs, paths or results.

Details: [clean code](../../standards/coding/clean-code.md) · [error handling](../../standards/coding/error-handling.md) · [OWASP](../../standards/security/owasp-top-10.md) · [testing](../../standards/testing/testing-strategy.md)
