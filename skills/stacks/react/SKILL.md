---
name: stack-react
description: Use in React projects (react dependency, .jsx/.tsx) for review and implementation of components, hooks, effects, state, rendering performance, accessibility and Testing Library tests.
version: 1.0.0
category: stack
---

# React

## Detect

`react`/`react-dom`, `.jsx/.tsx`, Vite/CRA/Webpack/Next config, state libs (Redux Toolkit, Zustand, Jotai, React Query/SWR), test libs (Testing Library, Vitest/Jest, Playwright/Cypress). Check React version (18/19 features: concurrent rendering, `use`, Actions, Server Components in frameworks).

## Review focus

- **Components**: small, single-purpose; function components; props typed; avoid prop drilling via composition/context; no business logic in JSX; separate container/presentational where it clarifies; stable `key` (never array index for dynamic lists).
- **Hooks rules**: only at top level; **exhaustive deps** (honour `react-hooks/exhaustive-deps`); custom hooks for reusable logic; no hooks in conditions/loops.
- **Effects**: `useEffect` is for syncing with external systems — not for deriving state or handling events; cleanup subscriptions/timers/fetches (AbortController); avoid fetch-in-effect waterfalls — use React Query/SWR/loader/Server Components; race conditions on stale responses.
- **State**: lift only as needed; derive instead of duplicating; colocate; server state ≠ client state (use a query library); avoid giant context re-rendering the tree (split contexts/selectors); immutability in updates; reducers for complex transitions.
- **Rendering performance**: unnecessary re-renders from new object/array/function props to memoised children; `memo/useMemo/useCallback` **only after profiling**; virtualise long lists; code-split routes (`lazy`/`Suspense`) ([frontend performance](../../../standards/frontend/frontend-performance.md)).
- **Forms**: controlled vs uncontrolled consistently; validation library (react-hook-form + zod); accessible errors.
- **Security**: avoid `dangerouslySetInnerHTML` (sanitise with DOMPurify); validate URLs for `href`/`src`; no secrets in bundle (`VITE_*`/`REACT_APP_*` are public); safe `target="_blank"` (`rel="noopener"`).
- **Error handling**: error boundaries around route/feature areas; loading/empty/error states for every async view.
- **TypeScript**: typed props/events/refs; no `any`; discriminated union props over boolean soup.

## Accessibility notes

Semantic elements first; label every control; manage focus for modals/route changes; `eslint-plugin-jsx-a11y`; `jest-axe` / Playwright axe; see [accessibility](../../../standards/frontend/accessibility.md).

## Implementation conventions

Match the project's file layout (feature folders vs type folders), styling approach (CSS modules/Tailwind/styled), data-fetching library and test style; extend existing hooks/components before creating new ones.

## Testing conventions

React Testing Library: query by role/label/text (not test ids first), `user-event` for interactions, MSW for network, `findBy*`/`waitFor` instead of sleeps; test behaviour not implementation; avoid snapshot sprawl; Playwright for critical journeys.

## Pitfalls

Effects that sync state to state; stale closures; missing cleanup; context overuse; memoising everything; index keys; fetching in many components without cache; unhandled loading/error states.
