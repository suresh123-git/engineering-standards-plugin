---
name: solid-principles
description: Use when designing or reviewing class/module structure to judge SRP, OCP, LSP, ISP and DIP pragmatically, recommending the smallest refactor that removes real design pain.
version: 1.0.0
category: core
---

# SOLID Principles

## When to apply

Designing modules/classes, reviewing services that "do too much", hard-to-test code, growing conditionals, or inheritance hierarchies. Skip for scripts, DTOs, glue code, and functional code where the principles map to modules/functions instead.

## How to apply

1. Read the unit and its tests; the pain shows up there first (many mocks, DB needed for logic tests, edits in many places).
2. For each principle ask the test question in the [SOLID standard](../../standards/architecture/solid.md); gather `file:line` evidence.
3. Convert to language idioms: in TypeScript/Node a function map can be the Strategy; in NestJS a provider token is the port; in Angular an injection token/abstract class; in functional modules, higher-order functions.
4. Recommend the **smallest** remedy, show a sketch in project style, state its cost, and say whether to do it now.
5. Respect the project's architecture ([clean architecture](../../standards/architecture/clean-architecture.md) only if it uses layers).

## Checklist

- [ ] One reason to change per unit (actor-based, not method-count-based)
- [ ] New variants don't require editing many places
- [ ] Subtypes honour base contracts; no throwing/ignoring overrides
- [ ] Interfaces are role-based and consumer-owned; no no-op implementations
- [ ] Core logic depends on abstractions it owns; infrastructure injected
- [ ] Abstractions have a justification (≥2 implementations, boundary, or testing need)

## Common mistakes

Interface-per-class "for DIP"; splitting classes by method count; inheritance for code reuse; reporting violations that cause no pain; introducing a DI container where constructors suffice.
