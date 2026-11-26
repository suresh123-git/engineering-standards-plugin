---
name: "engineering-rules"
description: "Baseline engineering rules (safe changes, project awareness, secure defaults, clean code). Apply whenever writing, modifying, reviewing or designing code."
---
# Engineering rules

Baseline rules for any coding task in this project. Project conventions and explicit user instructions win over these rules.

## Engineering principles

- Understand the task and inspect the relevant code **before** changing anything.
- Prefer the smallest solution that is correct, readable and consistent with the project; no speculative abstractions or features.
- Handle errors explicitly; never swallow them. Validate input at boundaries.
- Treat security as a baseline: authorisation on every entry point, parameterised queries, no secrets in code or logs.
- Add or update tests for behaviour you change; run the relevant tests, linter and type check when possible.
- Be honest: say what you verified, what you assumed, and what you could not check. Never invent APIs, paths or results.

Details: [clean code](${CLAUDE_PLUGIN_ROOT}/standards/coding/clean-code.md) · [error handling](${CLAUDE_PLUGIN_ROOT}/standards/coding/error-handling.md) · [OWASP](${CLAUDE_PLUGIN_ROOT}/standards/security/owasp-top-10.md) · [testing](${CLAUDE_PLUGIN_ROOT}/standards/testing/testing-strategy.md)

## Project awareness

- Before non-trivial work, identify language, framework, package manager, structure, conventions (lint/format), architecture, test setup and data stores from the repository itself.
- **Respect existing conventions** unless they cause a concrete problem; then explain the problem.
- Do not assume or force an architecture, framework or pattern the project doesn't use.
- Reuse existing utilities, libraries and patterns; do not duplicate them; add dependencies only when clearly justified.
- Use the project's package manager and scripts for every command.
- Apply stack-specific guidance (`stack-*` skills) only for technologies actually present.
- Ask for clarification only when a requirement is genuinely ambiguous and the answer changes the design.

Details: [project discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md)

## Safe changes

- **Analysis vs modification**: review, audit, explain, design and assessment requests do **not** modify files unless the user explicitly asks you to apply changes.
- Modify only files needed for the task; do not reformat or refactor unrelated code; preserve backward compatibility unless told otherwise.
- **Ask for approval first** before: deleting files, dropping/truncating database objects, destructive or production migrations, changing production infrastructure/IAM/secrets, force-pushing or rewriting history, publishing/deploying.
- Never run migrations, deployments or infrastructure changes against shared or production environments.
- Never print or commit secrets; refer to them by location only.
- After automatic changes, explain what changed and validate the result (tests/lint/build).

Details: [safety rules](${CLAUDE_PLUGIN_ROOT}/standards/global/safety-rules.md)

## Secure defaults

- Authenticate **and** authorise every request at the object level; deny by default; enforce tenant isolation.
- Validate all external input with allow-lists and size limits; encode output for its context.
- Use parameterised queries; never build SQL/NoSQL/shell commands from user input.
- Secrets come from the environment or a secrets manager — never from source, logs, client bundles or error messages.
- Hash passwords with Argon2id/bcrypt; use vetted libraries for crypto, JWT and sessions; verify JWT `alg`, `iss`, `aud`, `exp`.
- Return generic errors to clients; log details server-side without sensitive data.
- Prefer existing, maintained dependencies; avoid unnecessary new ones; keep lockfiles committed.

Details: [OWASP guide](${CLAUDE_PLUGIN_ROOT}/standards/security/owasp-top-10.md) · [authn/authz](${CLAUDE_PLUGIN_ROOT}/standards/security/authn-authz-sessions-jwt.md) · [input validation](${CLAUDE_PLUGIN_ROOT}/standards/security/input-validation-injection.md) · [secrets](${CLAUDE_PLUGIN_ROOT}/standards/security/secrets-management.md)

## Scoped rules

Read these when working on matching files or topics:

- [api-and-services](${CLAUDE_PLUGIN_ROOT}/rules/backend/api-and-services.md) — Conventions for backend controllers, routes, resolvers and services — thin handlers, validation, status codes, pagination and error shape. (files: `**/*.controller.ts`, `**/controllers/**`, `**/routes/**`, `**/resolvers/**`, `**/api/**`)
- [errors-and-logging](${CLAUDE_PLUGIN_ROOT}/rules/backend/errors-and-logging.md) — Apply when writing backend code that can fail or needs observability — error handling, timeouts, retries and structured logging. (when relevant)
- [queries-and-migrations](${CLAUDE_PLUGIN_ROOT}/rules/database/queries-and-migrations.md) — Conventions for SQL, ORM entities, repositories and migrations — safe, backward-compatible schema changes and efficient parameterised queries. (files: `**/migrations/**`, `**/*.sql`, `**/*.entity.ts`, `**/*.repository.ts`, `**/schema.prisma`, `**/models/**`)
- [components](${CLAUDE_PLUGIN_ROOT}/rules/frontend/components.md) — Conventions for frontend components — composition, state placement, async states, performance and accessibility. (files: `**/*.tsx`, `**/*.jsx`, `**/*.component.ts`, `**/*.component.html`, `**/*.vue`)
- [iac-and-containers](${CLAUDE_PLUGIN_ROOT}/rules/infrastructure/iac-and-containers.md) — Conventions for Dockerfiles, Terraform, CloudFormation, Kubernetes manifests and CI workflows — least privilege, no secrets, safe changes. (files: `**/Dockerfile*`, `**/docker-compose*.yml`, `**/*.tf`, `**/.github/workflows/*.yml`, `**/k8s/**`, `**/helm/**`, `**/template.yaml`)
