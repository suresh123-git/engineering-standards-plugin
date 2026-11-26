---
name: components
description: Conventions for frontend components — composition, state placement, async states, performance and accessibility.
scope: glob
globs: ["**/*.tsx", "**/*.jsx", "**/*.component.ts", "**/*.component.html", "**/*.vue"]
version: 1.0.0
---

# Frontend Components

- Small, single-purpose components; compose rather than configure; keep business logic out of templates/JSX.
- Place state at the narrowest scope; do not copy server data into global stores; derive instead of duplicating.
- Every async view handles loading, empty and error states.
- Clean up subscriptions, timers, listeners and in-flight requests.
- Use semantic HTML, label every control, support keyboard use and visible focus; do not use ARIA where native elements suffice.
- Avoid unsafe HTML sinks (`dangerouslySetInnerHTML`, `innerHTML`, `bypassSecurityTrust*`) with untrusted data.
- Optimise only measured problems: lazy-load routes, virtualise long lists, avoid unnecessary re-renders.

Details: [accessibility](../../standards/frontend/accessibility.md) · [frontend performance](../../standards/frontend/frontend-performance.md)
