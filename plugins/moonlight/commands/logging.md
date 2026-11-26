---
disable-model-invocation: true
description: "Establish or improve structured logging — format, levels, correlation, redaction and what to log — consistent with the project's logger."
argument-hint: "<service | module | 'audit' | 'setup'>"
---
# /logging

> **Mode: modifying.** Change only the files the task requires, explain what changed, and validate the result. Ask before any destructive or irreversible action.
>
> **User input:** $ARGUMENTS


## Purpose

Make logs useful and safe: structured, consistent, correlated across services, free of sensitive data, and covering the events that matter for debugging, security and audit. Can **audit** the current state or **set up/refactor** logging.

## Expected Input

`audit` (default; report only), `setup` (introduce/standardise logging), or a module/service to apply it to. State the log destination if known (stdout → CloudWatch/ELK/Datadog/Loki).

## Project Context Discovery

Run [project discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md). Additionally:

- Identify the logger(s) in use (pino, winston, bunyan, NestJS `Logger`, log4j/logback/SLF4J, Python `logging`/structlog) and `console.*`/`print` usage in production code.
- Find request-context mechanisms (AsyncLocalStorage/CLS, MDC, middleware/interceptors) and correlation/trace id sources.
- Check log config per environment (level, format, transports) and deployment conventions (stdout-only vs files).
- Grep for sensitive fields near log statements (password, token, authorization, card, ssn, email, phone).

## Applicable Standards

- [Structured logging](${CLAUDE_PLUGIN_ROOT}/standards/coding/logging.md) — format, levels, rules
- [Observability](${CLAUDE_PLUGIN_ROOT}/standards/devops/observability.md), [secrets management](${CLAUDE_PLUGIN_ROOT}/standards/security/secrets-management.md)

## Execution Steps

1. **Audit**: classify existing logging — unstructured vs structured, levels used, missing context, duplicate log-and-throw, noisy loops, `console.log`, missing logs at boundaries, sensitive data leaks (list `file:line`, never values).
2. **Design the standard** using the project's logger: field schema (`timestamp, level, message, service, env, version, correlationId, traceId`, domain ids), level policy, redaction list (paths/regex), sampling for high-volume logs.
3. **Correlation**: propagate ids via middleware/interceptor + async context; forward on outbound HTTP and message headers; include in error responses.
4. **Boundary logging**: inbound request summary (method, route template, status, duration), outbound dependency calls, job lifecycle, auth/security events, config at startup (sanitised), unhandled errors at a single central point.
5. **For `setup`/modifying**: implement the minimal change — logger module/config, redaction, request-logging middleware, replace `console.*` in the targeted scope, add tests for redaction and correlation. Reuse the existing logger; add a dependency only if none exists and with approval.
6. Validate: run tests/lint; run the service locally if possible and show a sample log line (synthetic data only).
7. Provide an operational note: retention, log-based alerts, cost considerations.

## Output Format

- **Audit findings** (shared format, category: logging) with locations
- **Logging standard** adopted (field table, level policy, redaction list)
- **Changes made** (files) and sample structured log output
- **Test/validation results**; follow-ups (alerts, dashboards)

## Safety Constraints

- In `audit` mode, read-only. In `setup` mode, modify only logging-related code within the stated scope.
- Never log or echo secrets/PII — including in examples, tests and fixtures; use synthetic data.
- Don't change log levels/format in production config without approval; avoid breaking downstream parsers (note format changes).

## Examples

```
/logging audit src/
/logging setup the orders service: JSON logs with correlation ids using pino
/logging find places where tokens or passwords might be logged
```

## Shared Requirements

- Run [project context discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md) first and load the matching `stack-*` skills.
- Follow the [safety rules](${CLAUDE_PLUGIN_ROOT}/standards/global/safety-rules.md); audit-style output uses the [findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md).
- Project conventions override generic advice unless they cause a concrete problem; never force a framework or architecture the project does not use.

## Loading stack skills (plugin)

Skills in this plugin are user-invoked only, so read the matching stack skills as files: `${CLAUDE_PLUGIN_ROOT}/skills/stack-<name>/SKILL.md` (e.g. `stack-nestjs`, `stack-postgresql`), and core skills at `${CLAUDE_PLUGIN_ROOT}/skills/<name>/SKILL.md`. Read only those for technologies the project actually uses.
