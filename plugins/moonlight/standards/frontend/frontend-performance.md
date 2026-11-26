---
title: Frontend Performance
version: 1.0.0
---

# Frontend Performance

Measure with real data: Lighthouse, WebPageTest, Chrome Performance panel, bundle analyser, and field data (CrUX/RUM). Targets (good): **LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1**.

## Loading

- Ship less JavaScript: route-level code splitting and lazy loading, tree-shaking (ESM, `sideEffects: false`), avoid large libraries for small tasks (moment→date-fns/Temporal, lodash per-method imports), analyse the bundle for duplicates.
- Critical path: inline critical CSS, defer non-critical scripts (`defer`/`async`/`type=module`), preload key resources (LCP image, fonts), `preconnect` to required origins.
- Images: modern formats (AVIF/WebP), responsive `srcset/sizes`, explicit width/height (prevents CLS), `loading="lazy"` below the fold, `fetchpriority="high"` for the LCP image, framework image components.
- Fonts: `font-display: swap`, subset, self-host, limit weights.
- Caching: immutable hashed assets with long `Cache-Control`; CDN; HTTP/2/3; Brotli compression.
- SSR/SSG/ISR/streaming where it improves LCP and SEO; hydrate selectively (islands, server components).

## Runtime

- Avoid unnecessary re-renders: stable references, memoisation **only where profiled**, split state so updates are local, keep state near its use; derived data via selectors/computed.
- Virtualise long lists/tables; paginate; debounce/throttle input handlers; use `requestIdleCallback`/web workers for heavy CPU work; avoid layout thrashing (batch DOM reads/writes); animate `transform`/`opacity`.
- Network: dedupe/cached requests (React Query/SWR/RxJS `shareReplay`), prefetch likely next routes, avoid waterfalls (parallelise requests), cancel stale requests.
- Memory: unsubscribe/clean up effects, listeners, timers, observables (Angular `takeUntilDestroyed`, React effect cleanup).
- Third-party scripts: audit, lazy load, sandbox.

## Framework notes

- **React**: `React.lazy/Suspense`, `useMemo/useCallback` after profiling, keys stable, avoid inline object/array props to memoised children, server components for data-heavy static parts.
- **Angular**: `OnPush`, signals, `trackBy`/`@for track`, lazy-loaded routes/standalone components, `@defer`, avoid function calls in templates, `NgOptimizedImage`.
- **Next.js**: `next/image`, `next/font`, dynamic imports, caching/revalidation strategy, avoid client components where unnecessary.

## Budgets

Set performance budgets in CI (bundle size, Lighthouse scores) and fail on regression.
