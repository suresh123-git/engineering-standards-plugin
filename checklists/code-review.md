---
title: Code Review Checklist
version: 1.0.0
---

# Code Review Checklist

Format findings per [review findings](../standards/global/review-findings.md). Only report what you can evidence.

- [ ] **Correctness**: meets requirements; edge cases (null, empty, boundary); concurrency and ordering; idempotency
- [ ] **Security**: authz, validation, injection, secrets, sensitive logging ([OWASP](../standards/security/owasp-top-10.md))
- [ ] **Architecture**: respects existing layering; dependencies point the right way ([clean architecture](../standards/architecture/clean-architecture.md))
- [ ] **SOLID / design**: real problems only ([SOLID](../standards/architecture/solid.md))
- [ ] **Code quality**: naming, size, duplication of knowledge, dead code ([clean code](../standards/coding/clean-code.md))
- [ ] **Performance**: N+1, unbounded work, blocking I/O, missing indexes ([performance](../standards/coding/performance.md))
- [ ] **Database**: transactions, constraints, migrations ([DB standards](../standards/database/transactions-and-integrity.md))
- [ ] **Error handling**: no swallowed errors; typed errors; cleanup ([error handling](../standards/coding/error-handling.md))
- [ ] **Logging**: useful, structured, no secrets ([logging](../standards/coding/logging.md))
- [ ] **Tests**: new behaviour and error paths covered; assertions meaningful ([testing](../standards/testing/testing-strategy.md))
- [ ] **Maintainability**: readable, documented where non-obvious
- [ ] **Backward compatibility**: API/schema/config/event contracts preserved or versioned
- [ ] **Dependencies**: new packages justified
