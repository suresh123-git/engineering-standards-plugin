---
title: Structured Logging
version: 1.0.0
---

# Structured Logging

## Format

- Emit **structured JSON** (one event per line) to stdout/stderr; let the platform ship it. Use the project's logger, not `console.log`/`print`, in production code.
- Stable fields: `timestamp` (ISO-8601 UTC), `level`, `message`, `service`, `env`, `version`, `correlationId`/`traceId`, `spanId`, plus event-specific context (`userId` as an opaque id, `orderId`, `durationMs`).
- Messages are constant strings; variable data goes in fields (greppable, aggregatable).

## Levels

| Level | Use |
|---|---|
| `error` | Operation failed and needs attention; an alert-worthy condition |
| `warn` | Unexpected but handled; degraded behaviour; retries exhausted soon |
| `info` | Significant lifecycle/business events (startup, request summary, job completed) |
| `debug` | Diagnostic detail, off in production by default |
| `trace` | Very verbose; local only |

## Rules

1. **Never log secrets or sensitive data**: passwords, tokens, API keys, full card numbers, government IDs, session cookies, raw request bodies with PII. Redact or hash.
2. Log an error **once**, where it is handled, with context — not at every layer it passes through.
3. Propagate a correlation id across HTTP calls, queue messages and async jobs.
4. Log at boundaries: inbound request/response summary, outbound dependency calls (target, status, duration), job start/finish, auth decisions, config at startup (sanitised).
5. Avoid logging in tight loops; sample or aggregate.
6. Logging must never throw or block request handling; use async transports.
7. Make logs actionable: include what failed, with which identifiers, and what the system did next.

## Review checklist

- [ ] Structured logger used; consistent field names
- [ ] No sensitive data in logs or error messages
- [ ] Correlation id propagated
- [ ] Levels used appropriately; no log-and-throw duplication
- [ ] Key business and security events are logged (login failure, permission denied, payment state change)

See [observability](../devops/observability.md) for metrics, tracing and alerting.
