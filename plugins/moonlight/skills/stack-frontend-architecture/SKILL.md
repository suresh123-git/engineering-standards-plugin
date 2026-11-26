---
disable-model-invocation: true
name: "stack-frontend-architecture"
description: "Use in frontend codebases to evaluate and design component architecture, state management, data flow, folder structure, design-system use and frontend performance/accessibility budgets across React, Angular and Next.js."
---
# Frontend Architecture (components, state, structure)

## Detect

Component libraries/design system, global stores (Redux Toolkit, NgRx, Zustand, Pinia, MobX, signals stores), query libraries (React Query, SWR, Apollo, RTK Query), monorepo packages (`ui`, `app`, `shared`), Storybook, micro-frontends (Module Federation).

## Review focus

- **Component architecture**: hierarchy of primitives → composites → features → pages; presentational components pure and reusable; feature components own data/state; composition (`children`, slots, render props, content projection) over configuration explosion; consistent prop/event contracts; no cross-feature imports (enforce boundaries).
- **State management**: classify state — *server cache* (query library), *URL state* (router/search params), *form state*, *ephemeral UI state* (local), *global client state* (rare, store). Use the narrowest scope; avoid duplicating server data in a global store; normalise only when needed; selectors memoised; side effects isolated and testable.
- **Data flow**: unidirectional; events up, data down; avoid two-way shared mutation; a single source of truth per datum; optimistic updates with rollback; loading/empty/error states modelled explicitly (discriminated unions).
- **Structure**: feature-sliced or domain folders with public entry points (`index`), shared kernel small and stable; dependency direction `app → features → shared`; avoid barrel cycles; colocate tests/stories/styles.
- **Design system**: use existing tokens/components; no one-off duplicates; theming via tokens; accessibility baked into primitives ([accessibility](${CLAUDE_PLUGIN_ROOT}/standards/frontend/accessibility.md)).
- **API layer**: typed clients (OpenAPI/GraphQL codegen), error normalisation, auth/refresh interceptors in one place, retry/cancel policy, no `fetch` scattered in components.
- **Performance budgets**: bundle size per route, Core Web Vitals, lazy boundaries aligned to routes/features ([frontend performance](${CLAUDE_PLUGIN_ROOT}/standards/frontend/frontend-performance.md)).
- **Micro-frontends** (if present): ownership, shared dependency versions, contracts, shared state discipline, runtime failure isolation; ask whether the complexity pays off.
- **Testability**: logic extracted from components into hooks/services/pure functions; boundaries mockable; Storybook/visual regression for UI primitives.

## Design notes

Use [clean architecture](${CLAUDE_PLUGIN_ROOT}/standards/architecture/clean-architecture.md) ideas lightly: UI → application services/hooks → API adapters, so business rules don't live in components. Choose the state tool by problem (see classification), not by trend. Document decisions as ADRs.

## Testing conventions

Test primitives with component tests/visual snapshots; features with integration tests (RTL/TestBed + mocked network); critical journeys with E2E; test selectors/reducers as pure functions.

## Pitfalls

Global store as a cache for server data; prop drilling vs context overuse; god components; hidden coupling via shared singletons; folder-by-type sprawl; inconsistent patterns per team member; building a design system without ownership.
