---
title: Pull Request and Review Standards
version: 1.0.0
---

# Pull Request and Review Standards

## Authoring PRs (`/pr`)

- **Small and focused**: ideally < 400 changed lines, one purpose. Split refactors from behaviour changes and generated files from handwritten ones.
- **Title**: conventional-commit style ([conventional commits](conventional-commits.md)) unless the project differs.
- **Description** — use the [PR template](../../templates/pull-request.md): what and why, how it was done, how it was tested, screenshots/logs, risk and rollback, migrations/config changes, breaking changes, linked issues.
- Self-review the diff first; remove debug code; ensure CI is green; update docs, OpenAPI, changelog and tests in the same PR.
- Draft PRs for early feedback; mark ready when complete.

## Reviewing PRs (`/pr-review`)

Order of attention: **design and correctness → security → tests → performance → maintainability → style** (automate style).

1. Read the description and linked issue; confirm the change solves the stated problem and nothing more.
2. Inspect the diff in context (callers, related tests) — not just changed lines.
3. Look for: unhandled errors, missing authorisation, data-integrity and migration risks, backward-compatibility breaks, race conditions, N+1 queries, missing tests for new branches, logging of sensitive data, new dependencies.
4. Use the shared [finding format](../global/review-findings.md). Mark **blocking** vs **non-blocking** (`nit:`, `suggestion:`, `question:`).
5. Be specific, kind, and explain *why*; offer concrete alternatives; praise good work.
6. Do not request unrelated refactors; open follow-up issues instead.
7. Verdict: Approve / Approve with comments / Request changes.

## Review guidelines for teams

- Respond within one business day; reviewers limited to ~60 minutes / 400 lines per session for quality.
- Authors resolve or answer every comment; reviewers re-check fixes.
- Automate: formatting, linting, type checks, tests, coverage diff, dependency/secret scanning, PR size labels.
- Require at least one approval from a code owner for sensitive paths (`CODEOWNERS`).
