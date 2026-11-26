---
name: "stack-nodejs"
description: "Use in Node.js projects (package.json, .nvmrc, server-side JS/TS) for runtime-specific review, implementation and testing guidance — event loop, async, streams, process lifecycle and config."
---
# Node.js

## Detect

`package.json` with `engines.node`, `.nvmrc`/`.node-version`, server entry points (`main`, `bin`, `server.ts`), lockfile for npm/yarn/pnpm. Use the project's package manager only.

## Review focus

- **Event loop**: CPU-heavy sync work (JSON on huge payloads, crypto sync APIs, regex, `fs.*Sync` on request path) → offload to worker threads/queue.
- **Async correctness**: un-awaited promises, `async` in `forEach`, missing `try/catch` in event handlers, `Promise.all` without concurrency limits, mixing callbacks and promises, unhandled rejections.
- **Process lifecycle**: `SIGTERM`/`SIGINT` graceful shutdown (stop accepting, drain, close DB/queues), no `process.exit` in libraries, handlers for `unhandledRejection` log-and-exit.
- **Streams & memory**: stream large files/responses with `pipeline`; avoid reading whole files/bodies; backpressure; leak sources (listeners, timers, unbounded caches/Maps).
- **Config**: env read once at startup into a validated typed config; fail fast; no secrets in code ([secrets](${CLAUDE_PLUGIN_ROOT}/standards/security/secrets-management.md)).
- **Security**: prototype pollution, `child_process` with user input, path traversal, `eval`/`vm`, SSRF in `fetch`/`axios`, unvalidated JSON, `Math.random` for tokens, outdated runtime (check EOL).
- **Dependencies**: heavy/abandoned packages, install scripts, duplicate versions ([dependencies](${CLAUDE_PLUGIN_ROOT}/standards/security/dependency-security.md)).
- **Errors**: custom `Error` subclasses with `cause`; central error handling ([error handling](${CLAUDE_PLUGIN_ROOT}/standards/coding/error-handling.md)).

## Implementation conventions

Use ESM/CJS as the project does; `node:` prefix for built-ins where used; `AbortController` + timeouts for outbound calls; `structuredClone`/native `fetch` where the runtime version supports it; pino/winston per project; `dotenv` only in dev; keep modules side-effect free at import time.

## Testing conventions

Use the project's runner (Jest/Vitest/`node:test`/Mocha); fake timers for time; close servers/DB handles in `afterAll` to avoid open-handle hangs; avoid `setTimeout` waits; Supertest for HTTP; Testcontainers for DB/queue integration.

## Pitfalls

Blocking the loop under load; swallowing rejections; unbounded `Promise.all`; leaking connections without pooling; relying on module-level mutable singletons across tests.
