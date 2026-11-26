---
name: "clean-architecture"
description: "Use when structuring or assessing application layers, dependency direction, ports/adapters and module boundaries — adapting to the project's existing architecture instead of imposing one."
---
# Clean Architecture

## When to apply

Designing features/modules, evaluating layering, untangling business logic from frameworks or infrastructure, planning integrations. If the project is a thin CRUD service or uses another coherent structure, **adopt its structure** and apply only the dependency rule where it helps.

## How to apply

1. Discover the existing architecture from folders and import direction ([project discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md)); describe it before judging it.
2. Apply the **dependency rule** from [clean architecture](${CLAUDE_PLUGIN_ROOT}/standards/architecture/clean-architecture.md): inner layers never import outer ones; boundaries exchange simple data.
3. Use [hexagonal architecture](${CLAUDE_PLUGIN_ROOT}/standards/architecture/hexagonal-architecture.md) vocabulary for ports/adapters when integrating external systems; define ports in the core, name them by business intent.
4. Place logic correctly: controllers parse/validate/delegate; use cases orchestrate; domain holds invariants; adapters map and talk to the outside.
5. Adopt **incrementally**: introduce ports at the boundaries that hurt (DB, third-party APIs) before reorganising everything.
6. Verify with dependency tooling where available (dependency-cruiser, madge, ArchUnit) and propose a lightweight rule to keep it that way.

## Checklist

- [ ] Domain code has no framework/ORM/HTTP imports
- [ ] Use cases are small, named for intent, and testable with fakes
- [ ] ORM/HTTP/SDK types don't cross layer boundaries
- [ ] Composition root wires dependencies; no hidden `new` of infrastructure in logic
- [ ] Structure matches the project's size and lifespan (no ceremony for trivial code)

## Common mistakes

Four layers for a CRUD endpoint; mirroring every entity with DTO + domain + ORM classes needlessly; interfaces without a second implementation or boundary reason; moving files without changing dependencies (cosmetic); forcing clean architecture onto framework-idiomatic code that already separates concerns well.
