---
title: Domain-Driven Design
version: 1.0.0
---

# Domain-Driven Design

Apply DDD where the domain is complex and business rules are the competitive core. Do not apply tactical patterns to simple CRUD.

## Strategic design

1. **Ubiquitous language**: use the business's terms in code, tests, APIs and docs. Rename code to match language; capture a glossary per context.
2. **Bounded contexts**: each context owns its model; the same word may mean different things in different contexts. Draw boundaries around language and consistency, not around technical layers.
3. **Context mapping**: describe relationships — partnership, shared kernel (minimise), customer/supplier, conformist, **anti-corruption layer (ACL)** for legacy/external models, open-host service / published language.
4. **Subdomains**: core (invest, build in-house), supporting (simple/custom), generic (buy/adopt). Spend design effort accordingly.

## Tactical design

| Building block | Rules |
|---|---|
| **Entity** | Identity and lifecycle; behaviour methods enforce invariants; no public setters that bypass rules |
| **Value object** | Immutable, equality by value, self-validating (`Money`, `Email`, `DateRange`) |
| **Aggregate** | Consistency boundary; one root; reference other aggregates by id; modify one aggregate per transaction; keep small |
| **Repository** | Per aggregate root; collection-like interface in the domain; hides persistence |
| **Domain service** | Stateless domain logic not belonging to one entity |
| **Domain event** | Past-tense fact (`OrderPlaced`); raised by aggregates; used for cross-aggregate/context consistency (eventual) |
| **Application service** | Orchestrates use cases, transactions, authorisation; contains no domain rules |
| **Factory** | Complex creation with invariants |

## Heuristics

- If a rule spans two aggregates, prefer eventual consistency via events (and sagas/process managers for long flows) over a big transaction.
- Avoid anaemic domain models only where invariants exist; do not move trivial getters/setters into "rich" classes for show.
- Events crossing contexts form contracts: version them, make consumers idempotent, publish via outbox for reliability.
- Event storming / domain storytelling are good discovery workshops; produce a context map and glossary as artifacts.
- Keep persistence concerns out of the model; map in the adapter layer (see [clean architecture](clean-architecture.md)).

## Smells

Shared database between contexts; one "God" aggregate; entities with setters for every field; business rules in controllers/SQL; naming that differs from business language; chatty synchronous calls between contexts.
