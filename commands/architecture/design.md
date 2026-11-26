---
name: design
description: Design a feature or module before implementation, producing a concrete, convention-aligned technical design with options and risks.
category: architecture
version: 1.0.0
mode: read-only
argument-hint: "<feature or module description | issue | spec>"
standards:
  - global/project-discovery
  - global/safety-rules
  - architecture/clean-architecture
  - architecture/tradeoff-analysis
  - api/rest-design
  - database/schema-design
skills:
  - clean-architecture
  - solid-principles
  - design-patterns
  - secure-coding
---

# /design

## Purpose

Produce a technical design for a feature or module **before code is written**: components and responsibilities, data model, contracts, flows, failure handling, security, testing and rollout — fitted to the project's existing architecture. It is design only; implementation is a separate step (`/implement`).

## Expected Input

A feature description, user story, issue, or spec. Include scale expectations and constraints if known; otherwise state assumptions explicitly.

## Project Context Discovery

Run [project discovery](../../standards/global/project-discovery.md). Additionally:

- Find the closest existing feature/module and how it is structured (layers, naming, DI, error model, API style, persistence, events).
- Read ADRs and architecture docs; identify constraints already decided.
- Identify integration points: services, tables/collections, queues, external APIs, auth model.
- Load matching `stack-*` skills for **Design conventions**.

## Applicable Standards

- [Clean architecture](../../standards/architecture/clean-architecture.md) / [hexagonal](../../standards/architecture/hexagonal-architecture.md) — only if consistent with the project
- [SOLID](../../standards/architecture/solid.md), [design patterns](../../standards/architecture/design-patterns.md), [DDD](../../standards/architecture/domain-driven-design.md) when the domain warrants
- [REST design](../../standards/api/rest-design.md), [schema design](../../standards/database/schema-design.md), [authn/authz](../../standards/security/authn-authz-sessions-jwt.md)
- [Trade-off analysis](../../standards/architecture/tradeoff-analysis.md), [scalability](../../standards/architecture/scalability.md)

## Execution Steps

1. **Requirements**: functional requirements, acceptance criteria, non-functional requirements (latency, volume, availability, security/compliance), non-goals, assumptions, open questions. Ask only questions that change the design.
2. **Fit to the system**: where the feature lives, which existing modules it touches, what it must not break.
3. **Options**: 2–3 viable designs including the simplest that works; evaluate with [trade-offs](../../standards/architecture/tradeoff-analysis.md); recommend one.
4. **Detail the recommended design**:
   - Components/classes/modules and responsibilities; dependency direction; where logic lives.
   - Data model: entities/tables/collections, constraints, indexes, migrations (expand/contract).
   - Contracts: endpoints/events/GraphQL with request/response shapes, status/error codes, versioning, idempotency.
   - Flows: main path and key failure paths (sequence diagram in Mermaid).
   - Cross-cutting: authn/authz, validation, transactions/consistency, caching, logging/metrics, config/feature flags.
5. **Risks and mitigations**; performance/scale considerations; security threat notes (STRIDE-lite).
6. **Test strategy** by layer; **rollout plan** (flags, migration order, backward compatibility, rollback).
7. **Implementation plan**: ordered, independently shippable steps with rough size.
8. Offer an [ADR](../../templates/adr.md) for significant decisions.

## Output Format

```
## Context & requirements   ## Assumptions / open questions
## Options considered (table) → Recommendation
## Design (components, data, contracts, flows + Mermaid diagram)
## Cross-cutting concerns   ## Risks & mitigations
## Test strategy            ## Rollout & rollback
## Implementation steps     ## Decisions to record (ADR)
```

## Safety Constraints

- Read-only: write a design document only if the user asks (then place it where project docs live, e.g. `docs/design/`).
- Do not impose architectures the project does not use; adapt to what exists.
- Do not invent requirements; label assumptions. Avoid speculative generality (YAGNI).

## Examples

```
/design notification preferences per user with email and push channels
/design bulk CSV import for products — up to 500k rows
/design multi-tenant audit log for the billing module
```
