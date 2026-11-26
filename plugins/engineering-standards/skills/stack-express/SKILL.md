---
name: "stack-express"
description: "Use in Express.js projects (express dependency, app.use/router patterns) for middleware order, async error handling, validation, security hardening, structure and Supertest testing."
---
# Express.js

## Detect

`express` dependency (check v4 vs v5: async handler error propagation differs), `app.use`, `Router()`, middleware files, `server.js/app.ts`.

## Review focus

- **Middleware order**: security (`helmet`, CORS), body parsers with size limits, request id/logging, auth, routes, 404, then **error-handling middleware last** (4-arg signature).
- **Async errors**: Express 4 does not catch rejected promises in handlers — require a wrapper (`express-async-errors`/custom `asyncHandler`) or try/catch → `next(err)`; Express 5 forwards rejections.
- **Validation**: schema validation (zod/joi/express-validator) on `params/query/body`; reject unknown fields; limits (`express.json({ limit })`); never trust `req.query` types (arrays/objects).
- **AuthN/AuthZ**: middleware applied per router/route, not forgotten on new routes; object-level checks in handlers/services; no auth based only on client-provided flags.
- **Security hardening**: `helmet`, strict CORS allow-list, `trust proxy` configured correctly, rate limiting (`express-rate-limit` with shared store), secure cookie flags, disable `x-powered-by`, avoid `res.send(userInput)` with HTML, SSRF in proxy routes, path traversal in `sendFile`.
- **Structure**: thin routes → controllers → services → repositories; no business logic or SQL in route files; route modules per feature; central error classes and handler; config module.
- **Responses**: consistent JSON shape and status codes; no stack traces in production; `res.status(...).json(...)` once per request (avoid "headers already sent").
- **Resilience**: timeouts (`server.requestTimeout`/`headersTimeout`), graceful shutdown (`server.close` + connection drain), health endpoints, keep-alive tuning behind load balancers.
- **Performance**: compression at edge, avoid sync I/O, pooled DB clients created once, avoid per-request heavy setup.

## Implementation conventions

Follow the project's file layout; one router per resource; use `Router()` with prefixed mounts; typed `Request` generics in TypeScript; central `AppError` with status/code mapped in the final error middleware; inject dependencies into controllers via factories for testability.

## API conventions

[REST design](${CLAUDE_PLUGIN_ROOT}/standards/api/rest-design.md); document with OpenAPI (swagger-jsdoc/zod-to-openapi/tsoa) and keep it in sync; version via prefix (`/v1`).

## Testing conventions

Export the `app` separately from `listen()`; Supertest against the app; mock services at module boundaries; assert status, body shape, headers and auth failures; test the error middleware (4xx/5xx mapping, no leakage).

## Pitfalls

Error middleware placed before routes; missing `next(err)`; unhandled promise rejections in v4; trusting `req.ip` without `trust proxy`; global mutable state across requests; `body-parser` without limits.
