---
name: "stack-nextjs"
description: "Use in Next.js projects (next dependency, next.config.*, app/ or pages/) for routing model, server vs client components, data fetching and caching, route handlers, security, performance and testing."
---
# Next.js

## Detect

`next` dependency, `next.config.*`, `app/` (App Router) and/or `pages/` (Pages Router), `middleware.ts`, `route.ts` handlers, server actions. **Check the Next.js major version** and consult official docs for caching/`fetch` defaults — they changed between versions; do not rely on memory.

## Review focus

- **Server vs Client Components** (App Router): default to Server Components; `'use client'` only at leaves needing state/effects/browser APIs; don't import server-only code (secrets, DB) into client components (`server-only` package); serialisable props across the boundary.
- **Data fetching & caching**: fetch on the server near where data is used; understand and set explicit caching/revalidation (`revalidate`, tags, `cache` options, `dynamic`) per route; avoid request waterfalls (parallelise with `Promise.all`, streaming with `Suspense`); don't fetch your own API route from a server component—call the service directly.
- **Route handlers / API routes**: validate input; authN/authZ on each handler; correct status codes; no secrets in responses; CORS; rate limits ([REST design](${CLAUDE_PLUGIN_ROOT}/standards/api/rest-design.md)).
- **Server Actions**: treat as public endpoints — authenticate, authorise, validate inputs (zod), CSRF considerations per version, revalidate affected paths/tags, return typed results, no sensitive data in closures.
- **Middleware**: lightweight, edge-compatible; matcher scoped; auth redirects without heavy work; don't rely on middleware alone for authorisation.
- **Env & secrets**: only `NEXT_PUBLIC_*` reaches the browser — verify nothing sensitive is prefixed; validate env at build/start.
- **Performance**: `next/image` (sizes, priority for LCP), `next/font`, dynamic imports for heavy client code, bundle analysis, avoid large client trees, static generation/ISR where possible ([frontend performance](${CLAUDE_PLUGIN_ROOT}/standards/frontend/frontend-performance.md)).
- **SEO/metadata**: `generateMetadata`, canonical URLs, sitemaps, structured data; correct `notFound()`/redirect handling.
- **Security**: headers via `next.config` (CSP, frame-ancestors, etc.), `dangerouslySetInnerHTML` risks, open redirects, SSRF in image/proxy handlers, cookie flags for sessions (NextAuth/Auth.js config review).
- **Error/loading UX**: `error.tsx`, `loading.tsx`, `not-found.tsx` per segment; hydration mismatch sources (dates, random, `window`).

## Accessibility notes

Route-change focus/announcements, `<Link>` semantics, `alt` text on `Image`, heading structure per page ([accessibility](${CLAUDE_PLUGIN_ROOT}/standards/frontend/accessibility.md)).

## Implementation conventions

Follow the existing router (don't mix App and Pages casually); colocate route files with components; shared server logic in service modules reusable by actions/handlers/components; typed route params; consistent data-access layer.

## Testing conventions

Unit/component tests with Testing Library/Vitest/Jest (mock `next/navigation`, `next/headers` as needed); Playwright E2E against `next build && next start` for realistic caching behaviour; test route handlers by calling exported functions with `Request`.

## Pitfalls

Making everything a client component; accidental dynamic rendering killing caching; stale data from misunderstood cache semantics; leaking server-only data to the client; unvalidated server actions; env var prefix mistakes.
