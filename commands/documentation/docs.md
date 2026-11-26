---
name: docs
description: Generate accurate technical documentation (architecture, module, API, how-to, runbook, ADR) verified against the code.
category: documentation
version: 1.0.0
mode: modifying
argument-hint: "<what to document: module | API | architecture | decision | runbook> [audience]"
standards:
  - global/project-discovery
  - global/safety-rules
  - documentation/documentation-standards
  - api/openapi-documentation
skills:
  - clean-architecture
  - code-review
---

# /docs

## Purpose

Create or update technical documentation that a real reader can use: architecture overviews, module/service docs, developer guides, API references, ADRs and runbooks. Every statement is verified against the code, config or running behaviour; nothing is invented.

## Expected Input

The subject and doc type (architecture overview, module guide, how-to, API reference, ADR, runbook), plus audience (new developer, operator, API consumer). If an existing doc is named, update it in place.

## Project Context Discovery

Run [project discovery](../../standards/global/project-discovery.md). Additionally:

- Find where docs live and their format/style (`docs/`, `README`s, wiki exports, MkDocs/Docusaurus config, ADR folder, OpenAPI files).
- Read existing docs on the subject to update, not duplicate; note outdated sections by comparing to code.
- Read the code, config, scripts and tests for the subject to establish truth; run documented commands locally if safe to verify.

## Applicable Standards

- [Documentation standards](../../standards/documentation/documentation-standards.md) — principles, doc types, checklist
- [OpenAPI documentation](../../standards/api/openapi-documentation.md) for API reference
- Templates: [ADR](../../templates/adr.md), [runbook](../../templates/runbook.md)

## Execution Steps

1. Identify **reader and task**; choose the doc type and location per project conventions.
2. **Gather facts** from code/config/tests; list claims you could not verify and mark them or omit them.
3. Outline: purpose, prerequisites, concepts, procedure/reference, troubleshooting, links. Use the right template for ADRs/runbooks.
4. Write concise, task-oriented prose with copy-pasteable, **verified** commands and realistic examples; add Mermaid diagrams for flows/architecture when they clarify.
5. For API docs prefer generating from the OpenAPI/SDL source; document auth, errors, pagination, rate limits, examples.
6. Cross-link existing docs instead of copying; fix stale statements you touch; update tables of contents and indexes.
7. Validate: links resolve, code blocks have language tags, commands exist in scripts/manifest, config keys exist in code, no secrets or internal-only hostnames.
8. Report created/updated files and open questions for the owners.

## Output Format

- The documentation file(s) written/updated (paths)
- **Verification notes**: what was checked and how; unverified items flagged
- Suggested follow-ups (missing docs, stale pages)

## Safety Constraints

- Modify/create documentation files only; no code changes. Updating existing docs: preserve author intent and structure; don't delete sections without noting it.
- Never copy secrets, tokens, internal URLs or personal data into docs. Don't document behaviour you haven't verified.
- Don't generate large amounts of boilerplate that restates the code.

## Examples

```
/docs architecture overview of services/billing for new developers
/docs runbook for the "queue backlog" alert
/docs ADR: why we chose cursor pagination
```
