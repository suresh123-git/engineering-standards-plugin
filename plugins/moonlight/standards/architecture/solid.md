---
title: SOLID Principles
version: 1.0.0
---

# SOLID Principles

Apply as design heuristics, not laws. Report a violation only when it causes demonstrable pain (hard to test, change amplification, bugs). Do not introduce interfaces or layers solely to "satisfy SOLID".

| Principle | Test question | Typical violation | Typical remedy |
|---|---|---|---|
| **S**ingle Responsibility | Does this unit have exactly one reason to change (one actor/stakeholder)? | Service that validates, applies pricing rules, persists and sends email | Extract collaborators along change axes; keep the orchestrator thin |
| **O**pen/Closed | Can new behaviour be added without editing stable, tested code? | Growing `switch`/`if` on type in many places | Strategy/polymorphism/registry; only once variation is real (≥2–3 cases) |
| **L**iskov Substitution | Can any subtype be used where the base is expected without surprises? | Override throws `NotSupported`, strengthens preconditions, returns narrower/looser results | Re-model with composition; split the interface; honour the base contract |
| **I**nterface Segregation | Do clients depend only on methods they use? | "Fat" interface forcing no-op implementations | Role-based interfaces defined by the consumer |
| **D**ependency Inversion | Do high-level policies depend on abstractions owned by them, not on low-level details? | Domain logic importing the ORM, HTTP client or SDK directly | Define a port in the domain/application layer; implement in infrastructure; inject |

## Practical guidance

- Dependency injection is the mechanism, not the goal. Use the project's DI approach (framework container, constructor injection, factories); do not add a container to a project that has none.
- In small scripts and CRUD handlers, a function is fine; SRP at module level matters more than at class level.
- Prefer **composition over inheritance**. Inheritance only for true "is-a" with a stable base and substitutable subtypes.
- Abstractions earn their place by having ≥2 implementations *or* a testing/boundary need (e.g., a port around an external system).
- Smells that signal SOLID problems: constructor with many dependencies (SRP/DIP), shotgun surgery (OCP), `instanceof` chains (LSP/OCP), mocks needing to stub unused methods (ISP), tests requiring a database to test logic (DIP).

## Review output

For each violation: principle, evidence (file:line), the concrete cost, the smallest refactor that fixes it, and whether it is worth doing now. Rate severity Low/Medium unless it blocks correctness or testing of critical logic.
