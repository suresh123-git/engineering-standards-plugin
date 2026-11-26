---
description: "Review error-handling strategy end to end — error taxonomy, propagation, translation, retries, logging and client-facing errors."
argument-hint: "<module | service | directory>"
allowed-tools: "Read, Grep, Glob, Bash(git diff:*), Bash(git log:*), Bash(git status:*), Bash(git show:*), Bash(git blame:*)"
---
# /error-handling

> **Mode: read-only.** Do not create, modify or delete files unless the user explicitly asks you to apply the changes. Running side-effect-free inspection commands (git log/diff, tests, linters) is fine.
>
> **User input:** $ARGUMENTS


## Purpose

Assess whether failures are anticipated, classified, propagated, logged and presented consistently — and whether the system degrades gracefully. Finds swallowed errors, leaked internals, missing timeouts/retries, partial-failure bugs and inconsistent client errors.

## Expected Input

A module, service or directory. Optionally a concrete failure scenario ("what happens if the payment API times out?").

## Project Context Discovery

Run [project discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md). Additionally:

- Find the central error machinery: exception classes, exception filters/middleware/`@ControllerAdvice`, GraphQL `formatError`, Angular `HttpInterceptor`/`ErrorHandler`, React error boundaries, process-level handlers.
- Identify the logging setup and the error response shape used by clients.
- List external calls (HTTP, DB, queue, filesystem) and check their timeout/retry configuration.

## Applicable Standards

- [Error handling](${CLAUDE_PLUGIN_ROOT}/standards/coding/error-handling.md), [logging](${CLAUDE_PLUGIN_ROOT}/standards/coding/logging.md), [REST error model](${CLAUDE_PLUGIN_ROOT}/standards/api/rest-design.md)
- [Findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md)

## Execution Steps

1. **Inventory the error model**: custom error types, codes, mapping to HTTP/GraphQL/queue outcomes; note gaps and duplicates.
2. **Hunt anti-patterns** (verify each in context): empty/ignored catch, catch-log-continue on critical paths, catch-and-rethrow without context, lost `cause`, string errors, `catch (e: any)` misuse, unawaited promises, missing `finally`/cleanup, `process.exit` in libraries, generic `500` for client mistakes.
3. **Boundaries**: for each external call verify timeout, retry policy (idempotent only, backoff, jitter), circuit breaking, error translation to domain errors.
4. **Transactions & partial failure**: rollback on error, compensation for multi-step workflows, idempotency on retried operations, poison-message handling / DLQ.
5. **Client-facing errors**: consistent shape, correct status codes, no stack traces/SQL/paths, stable machine-readable codes, validation error detail, correlation id.
6. **Logging of errors**: once at the handling boundary, with context, correct level, no secrets/PII, no log-and-throw duplication.
7. **Frontend (if present)**: error boundaries/interceptors, user-friendly messages, retry UX, offline/timeout handling.
8. **Failure-mode walkthrough** for 3–5 critical flows: list failure points and resulting behaviour (table).
9. Report findings and a recommended minimal error-handling design aligned with the project's framework features.

## Output Format

Shared findings format + **Error taxonomy table**, **Failure-mode table** (flow | failure | current behaviour | desired), and **recommended central handling approach** (small code sketch in the project's framework).

## Safety Constraints

- Read-only; do not inject faults into running/shared systems. Use code reading and, if needed, tests in local environments.
- Do not recommend catching everything or retrying non-idempotent operations.
- Preserve existing client error contracts unless a break is explicitly accepted.

## Examples

```
/error-handling src/orders
/error-handling what happens if the email provider is down when a user registers?
/error-handling backend/ — consistency of error responses
```

## Shared Requirements

- Run [project context discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md) first and load the matching `stack-*` skills.
- Follow the [safety rules](${CLAUDE_PLUGIN_ROOT}/standards/global/safety-rules.md); audit-style output uses the [findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md).
- Project conventions override generic advice unless they cause a concrete problem; never force a framework or architecture the project does not use.
