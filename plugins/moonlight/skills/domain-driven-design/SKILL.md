---
disable-model-invocation: true
name: "domain-driven-design"
description: "Use when modelling complex business domains — ubiquitous language, bounded contexts, aggregates, domain events and context integration — and when judging whether DDD is warranted at all."
---
# Domain-Driven Design

## When to apply

Complex, rule-heavy domains (pricing, billing, fulfilment, underwriting, scheduling), inconsistent terminology across teams/modules, or modules that cannot change independently. Not for plain CRUD, glue services or generic subdomains — recommend a simpler design there.

## How to apply

1. Classify subdomains (core/supporting/generic) and concentrate DDD effort on the core ([DDD standard](${CLAUDE_PLUGIN_ROOT}/standards/architecture/domain-driven-design.md)).
2. Extract the **ubiquitous language** from code, docs and tickets; list conflicts and renames; keep a glossary per context.
3. Draw **bounded contexts** and a context map with relationship types; use an anti-corruption layer against legacy/external models.
4. Model aggregates around **invariants** (one transaction = one aggregate; reference others by id); use value objects for concepts with rules (`Money`, `Email`, `Quantity`); raise past-tense domain events for cross-aggregate/context consistency.
5. Map the model to the project's structure ([clean architecture](${CLAUDE_PLUGIN_ROOT}/standards/architecture/clean-architecture.md)) without forcing layers it doesn't use; keep persistence mapping in adapters.
6. Plan adoption incrementally: rename to the language, extract value objects, protect one aggregate's invariants, then add events.
7. Never invent domain rules — list them as assumptions to confirm with domain experts.

## Checklist

- [ ] Code names match business terms; glossary exists
- [ ] Each aggregate protects explicit invariants and stays small
- [ ] No cross-aggregate object references or multi-aggregate transactions by default
- [ ] Context boundaries owned by one team/data model; integration via contracts/events
- [ ] Events are versioned facts; consumers idempotent

## Common mistakes

DDD vocabulary without domain insight (everything an "aggregate"); one giant aggregate; shared database between contexts; anaemic models where invariants exist *and* rich models where none do; microservice per entity.
