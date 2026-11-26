---
title: Error Handling
version: 1.0.0
---

# Error Handling

## Principles

1. **Fail fast, fail loudly, fail specifically.** Validate inputs at the boundary; raise typed/domain errors, not strings.
2. **Never swallow errors.** An empty `catch`, `catch (e) {}` or ignored return/promise is a defect unless a comment explains why it is safe.
3. **Handle at the right level.** Catch where you can recover or add context; otherwise let it propagate. Do not catch-and-rethrow without adding information.
4. **Preserve the cause.** Wrap with context but keep the original (`cause`, inner exception, `%w`).
5. **Distinguish error classes**: client/validation (4xx), not-found, conflict, authorization, transient/retryable dependency failure, programmer error/bug (5xx).
6. **Do not leak internals.** Return stable error codes and safe messages to clients; log stack traces and details server-side only.

## Practices

- One centralised translation layer from exceptions to responses (HTTP exception filter/middleware, GraphQL formatError, message-queue DLQ policy).
- Consistent error body (see [REST design](../api/rest-design.md)): code, message, details, correlation id.
- Async code: every promise is awaited or has a `.catch`; register process-level handlers for `unhandledRejection`/`uncaughtException` only to log and exit cleanly.
- Retries: only for idempotent operations and transient errors; exponential backoff with jitter; bounded attempts; circuit breaker for repeated dependency failures; always set timeouts.
- Resource safety: `finally`/`using`/context managers to release connections, locks, file handles.
- Transactions: roll back on error; do not partially commit.
- Messaging: poison messages go to a dead-letter queue with the failure reason; consumers must be idempotent.
- Do not use exceptions for normal control flow in hot paths.
- Log an error once, at the handling boundary, with context (see [logging](logging.md)).

## Review checklist

- [ ] No empty/ignored catch blocks or unawaited promises
- [ ] Errors carry context and cause; clients never see stack traces or SQL
- [ ] Retries/timeouts/backoff defined for every external call
- [ ] Cleanup guaranteed on all paths
- [ ] Error paths are tested, not just the happy path
