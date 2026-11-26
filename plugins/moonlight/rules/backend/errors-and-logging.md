---
name: errors-and-logging
description: Apply when writing backend code that can fail or needs observability — error handling, timeouts, retries and structured logging.
scope: model
globs: []
version: 1.0.0
---

# Errors and Logging

- Never swallow errors; wrap with context and keep the cause; use typed/domain errors translated centrally.
- Every external call has a timeout; retry only idempotent operations, with exponential backoff and jitter, bounded attempts.
- Release resources on all paths (`finally`/context managers); no unawaited promises.
- Log with the project's structured logger; log an error once where it is handled; include correlation ids.
- Never log secrets, tokens, credentials or personal data.
- Use appropriate levels (`error` = needs attention, `warn` = degraded, `info` = lifecycle/business events, `debug` = diagnostics).

Details: [error handling](../../standards/coding/error-handling.md) · [logging](../../standards/coding/logging.md)
