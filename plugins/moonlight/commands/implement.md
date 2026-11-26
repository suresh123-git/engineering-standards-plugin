---
disable-model-invocation: true
description: "Implement a production-ready feature or change following project conventions with a plan, minimal diff, tests and validation."
argument-hint: "<feature description | issue link | spec file>"
---
# /implement

> **Mode: modifying.** Change only the files the task requires, explain what changed, and validate the result. Ask before any destructive or irreversible action.
>
> **User input:** $ARGUMENTS


## Purpose

Turn a requirement into working, tested, production-quality code using the smallest maintainable change that fits the existing architecture and conventions. It plans before coding, reuses what exists, validates its work, and reports exactly what changed.

## Expected Input

A feature description, user story, issue/ticket text, or spec file path. If acceptance criteria are missing, derive them and confirm only when ambiguity would change the design (data model, public contract, security behaviour, destructive effects).

## Project Context Discovery

Run [project discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md). Additionally:

- Find the **closest existing feature** (same layer, same kind) and mirror its structure, naming, error handling, validation, logging and tests.
- Search for existing utilities, types, constants, DTOs and components that already solve part of the problem — do not duplicate them.
- Identify how the project runs tests, lint and type checks for the area (exact commands).
- Load matching `stack-*` skills and follow their **Implementation conventions**.

## Applicable Standards

- [Clean code](${CLAUDE_PLUGIN_ROOT}/standards/coding/clean-code.md), [error handling](${CLAUDE_PLUGIN_ROOT}/standards/coding/error-handling.md), [logging](${CLAUDE_PLUGIN_ROOT}/standards/coding/logging.md)
- [Input validation](${CLAUDE_PLUGIN_ROOT}/standards/security/input-validation-injection.md), [authn/authz](${CLAUDE_PLUGIN_ROOT}/standards/security/authn-authz-sessions-jwt.md) when exposing endpoints or data
- [Testing strategy](${CLAUDE_PLUGIN_ROOT}/standards/testing/testing-strategy.md), [test design](${CLAUDE_PLUGIN_ROOT}/standards/testing/test-design-edge-cases.md)
- [REST design](${CLAUDE_PLUGIN_ROOT}/standards/api/rest-design.md) / [DB migrations](${CLAUDE_PLUGIN_ROOT}/standards/database/migration-safety.md) if the change touches APIs or schema

## Execution Steps

1. **Understand**: restate the requirement, acceptance criteria, non-goals and assumptions in ≤ 8 lines. Ask only blocking questions.
2. **Inspect**: run discovery; read the files you will touch and their tests; map the integration points.
3. **Plan** (required for anything beyond a trivial edit): list files to create/modify, data/contract changes, edge cases, security considerations, test plan, rollout/migration notes. For non-trivial or risky plans, present the plan and wait for confirmation; otherwise proceed.
4. **Implement incrementally** in the smallest coherent steps:
   - Domain/logic first, then boundaries (controllers/handlers), then wiring.
   - Validate inputs at the boundary; handle errors explicitly; use the project's logger and config mechanisms.
   - Add no new dependency unless justified; keep backward compatibility.
5. **Test**: write/extend tests at the right layer (unit for logic, integration for wiring/data access); include error paths and boundaries. Use the project's test style and fixtures.
6. **Validate**: run the narrowest relevant tests, then lint, type check and build where available. Fix failures caused by your change; report pre-existing failures without "fixing" unrelated code.
7. **Review your diff** against [clean code](${CLAUDE_PLUGIN_ROOT}/standards/coding/clean-code.md) and the security checklist; remove debug output and scope creep.
8. **Report**.

## Output Format

1. Brief summary of what was implemented and key decisions.
2. **Modified files** list (created/changed/deleted) with one line each.
3. **Tests**: added tests and the commands run with results (pass/fail counts), or exact commands for the user if not runnable.
4. **Notes**: assumptions, follow-ups, migrations/config/env changes, known limitations.

## Safety Constraints

- Modify only files necessary for the requirement; no drive-by refactors or formatting of unrelated code.
- Obtain approval before deleting files, changing schemas destructively, or touching infrastructure/CI/secrets.
- Never weaken validation, auth, tests or lint rules to make the change pass.
- Stop and ask if the requirement conflicts with existing behaviour that other code depends on.

## Examples

```
/implement add password reset via emailed one-time token
/implement ISSUE-482 — soft-delete projects and hide them from list endpoints
/implement docs/specs/export-csv.md
```

## Shared Requirements

- Run [project context discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md) first and load the matching `stack-*` skills.
- Follow the [safety rules](${CLAUDE_PLUGIN_ROOT}/standards/global/safety-rules.md); audit-style output uses the [findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md).
- Project conventions override generic advice unless they cause a concrete problem; never force a framework or architecture the project does not use.

## Loading stack skills (plugin)

Skills in this plugin are user-invoked only, so read the matching stack skills as files: `${CLAUDE_PLUGIN_ROOT}/skills/stack-<name>/SKILL.md` (e.g. `stack-nestjs`, `stack-postgresql`), and core skills at `${CLAUDE_PLUGIN_ROOT}/skills/<name>/SKILL.md`. Read only those for technologies the project actually uses.
