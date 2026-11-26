---
title: Clean Architecture
version: 1.0.0
---

# Clean Architecture

Use when a codebase has non-trivial business rules, long lifespan, or multiple delivery/infra mechanisms. For simple CRUD or short-lived tools, a flat layered structure is enough — **do not impose this on projects that do not use it**.

## The dependency rule

Source-code dependencies point **inward only**.

```
Frameworks & drivers (web, DB, queues, SDKs)
   → Interface adapters (controllers, presenters, repositories impl, mappers)
      → Application / use cases (orchestration, transactions, ports)
         → Domain (entities, value objects, domain services, domain events)
```

Inner layers know nothing about outer ones. Data crossing a boundary is a simple DTO/value, never a framework object (ORM entity, HTTP request, DB row).

## Layers

- **Domain**: business invariants, pure, no I/O, no framework imports. Rich behaviour rather than anaemic data bags where invariants exist.
- **Application**: one use case per class/function; defines **ports** (interfaces) for what it needs (repositories, gateways, clock, id generator); manages transactions and authorisation checks.
- **Adapters**: implement ports (SQL repository, HTTP gateway), map between external and internal models, translate errors.
- **Frameworks**: wiring, config, controllers/routes, DI composition root.

## Practical rules

1. Controllers: parse/validate → call a use case → map the result. No business logic.
2. Repositories return domain objects; queries for read models may bypass the domain (CQRS-lite) when it simplifies and stays inside the adapter layer.
3. Composition root wires implementations; nothing else instantiates infrastructure.
4. Test pyramid follows layers: domain unit tests (fast, pure), use-case tests with fake ports, adapter integration tests against real infra, thin end-to-end tests.
5. Keep mapping cost proportional: skip separate DTOs where the shapes are identical and the boundary is internal.
6. Adopt incrementally: introduce ports at the boundaries that hurt (DB, external APIs) before restructuring everything.

## Smells

Domain importing ORM/HTTP/SDK types; use cases returning ORM entities; business rules in controllers or SQL; shared "models" folder used by every layer; circular imports between layers; framework decorators throughout the domain.

## Mapping to common stacks

- NestJS: modules per bounded context; providers injected via tokens for ports; keep Nest decorators out of the domain.
- Angular: smart/presentational components, facades/services as application layer, API clients as adapters.
- Spring/Java, .NET, Go: same layering with package/assembly boundaries enforced (ArchUnit, NetArchTest, `internal/`).

See also [hexagonal architecture](hexagonal-architecture.md) and [domain-driven design](domain-driven-design.md).
