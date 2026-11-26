---
title: Hexagonal Architecture (Ports and Adapters)
version: 1.0.0
---

# Hexagonal Architecture (Ports and Adapters)

The application core (domain + use cases) is isolated from the outside world by **ports**; **adapters** plug technology into those ports. It is the same dependency rule as [clean architecture](clean-architecture.md) with a symmetrical view of "driving" and "driven" sides.

## Vocabulary

- **Driving (primary) side** — what calls the app: HTTP controller, GraphQL resolver, CLI, message consumer, scheduler. Adapters here translate input into use-case calls through **inbound ports** (use-case interfaces).
- **Driven (secondary) side** — what the app calls: database, message broker, email, payment API, clock. The core declares **outbound ports**; adapters implement them.
- **Core** — domain model and application services; testable with in-memory adapters.

## Guidelines

1. Name ports by business intent (`PaymentGateway`, `OrderRepository`, `Notifier`), not technology (`StripeClient`).
2. A port is owned by the core and shaped by its needs, not by the vendor's SDK.
3. One adapter per technology per port; adapters contain mapping, retries, translation of vendor errors to domain errors.
4. Provide in-memory/fake adapters for tests and local development.
5. Cross-cutting concerns (transactions, auth, tracing) are applied at the use-case boundary via decorators/middleware, not inside adapters.
6. Do not create a port for something with no realistic alternative and no testing pain (e.g., a pure utility library).

## Suggested folder shape (adapt to the project)

```
src/<context>/
  domain/            entities, value objects, domain services, events
  application/       use-cases/, ports/ (in & out)
  adapters/
    inbound/         http/, graphql/, consumers/
    outbound/        persistence/, messaging/, clients/
  config/            composition root
```

## When it helps / when it does not

Helps: multiple integrations, replaceable vendors, heavy business logic, need for fast tests. Overkill: thin CRUD services, prototypes, glue scripts. Recommend the smallest adoption (ports only at the few boundaries that matter).
