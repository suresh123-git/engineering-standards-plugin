---
name: ddd
description: Apply domain-driven design — model bounded contexts, ubiquitous language, aggregates and events — where the domain complexity warrants it.
category: architecture
version: 1.0.0
mode: read-only
argument-hint: "<domain area | module | requirements text>"
standards:
  - global/project-discovery
  - global/safety-rules
  - architecture/domain-driven-design
  - architecture/clean-architecture
  - architecture/tradeoff-analysis
skills:
  - domain-driven-design
  - clean-architecture
---

# /ddd

## Purpose

Analyse or design a domain with DDD: discover the ubiquitous language, bounded contexts and their relationships, aggregates and invariants, and domain events — and judge whether tactical DDD is worth it for the area. Produces a model and a pragmatic adoption path, not a rewrite.

## Expected Input

A domain area, module, requirements, or existing code to assess. Business glossary/stakeholder notes help; ask for missing domain rules only where they change aggregate boundaries.

## Project Context Discovery

Run [project discovery](../../standards/global/project-discovery.md). Additionally:

- Extract the **current vocabulary** from class/table/endpoint/event names, docs, tickets; note synonyms, overloaded terms, technical names masking business concepts.
- Map data ownership: which modules write which tables; shared tables; cross-module joins.
- Find where business rules live today (services, controllers, SQL, validators).
- Check existing layering to choose a fitting, minimal expression of the model.

## Applicable Standards

- [Domain-driven design](../../standards/architecture/domain-driven-design.md) — strategic and tactical building blocks
- [Clean architecture](../../standards/architecture/clean-architecture.md) — placing the model
- [Trade-off analysis](../../standards/architecture/tradeoff-analysis.md) — is DDD worth it here?

## Execution Steps

1. **Classify subdomains**: core / supporting / generic; invest DDD effort in core only. If the area is simple CRUD, say so and recommend a lighter design.
2. **Build the glossary**: term, definition, context, code name; flag conflicts and rename candidates.
3. **Identify bounded contexts** by language and consistency boundaries; draw a **context map** (Mermaid) with relationship types (customer/supplier, conformist, ACL, published language, shared kernel).
4. **Model each core context**: entities, value objects, aggregates (roots, invariants enforced, size), domain services, repositories (ports), domain events (past tense), commands/queries.
5. **Check aggregate boundaries**: one transaction = one aggregate; cross-aggregate rules → eventual consistency via events; no references by object across aggregates (use ids).
6. **Integration**: events/APIs between contexts, ACL for legacy/external models, idempotent consumers, outbox for reliability.
7. **Map to code** in the project's structure (module/folder per context, domain layer purity, mapping at adapters).
8. **Adoption path**: smallest first steps (e.g., introduce value objects and one aggregate; rename to ubiquitous language; add ACL), not a rewrite.

## Output Format

```
## Domain & subdomain classification
## Ubiquitous language (glossary table)
## Context map (diagram + relationships)
## Domain model per context (aggregates, invariants, events)
## Integration & consistency strategy
## Mapping to the codebase
## Adoption roadmap, risks, and what not to model
```

## Safety Constraints

- Read-only. Do not invent business rules — list them as assumptions to validate with domain experts.
- Do not apply tactical patterns to CRUD; do not split into microservices as a DDD side effect.
- Avoid renaming public contracts without a migration plan.

## Examples

```
/ddd order fulfilment: ordering, inventory, shipping and invoicing
/ddd assess src/billing for aggregate boundaries
/ddd model a loan approval workflow with regulatory audit requirements
```
