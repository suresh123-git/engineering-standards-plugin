---
title: Documentation Standards
version: 1.0.0
---

# Documentation Standards

Docs are code: versioned, reviewed, tested where possible, and kept next to what they describe. Match the project's existing documentation structure and tone.

## Principles

1. Write for a specific reader and task (new contributor, operator, API consumer); say who in the first lines.
2. **Accurate over comprehensive.** Verify commands, paths, versions and examples by reading the code/config or running them. Never document behaviour you have not confirmed.
3. Prefer concrete examples and copy-pasteable commands.
4. Single source of truth; link instead of duplicating (this repository's own rule).
5. Explain *why* and trade-offs in design docs; explain *how* in guides; list *what* in references.
6. Keep it current: update docs in the same change as behaviour; delete stale pages.

## README essentials

Name and one-line purpose · badges (CI, version, licence) · what/why · quick start (≤ 5 commands to run) · prerequisites · installation · configuration (env vars table with defaults and required/optional) · usage with examples · scripts/commands · project structure · architecture overview/link · testing · deployment · troubleshooting · contributing and licence links · support/contact.

## Technical documentation types

| Type | Content |
|---|---|
| Tutorial / how-to | Goal-oriented steps with expected output |
| Reference | API/CLI/config, generated from code/OpenAPI where possible |
| Explanation / architecture | Context, diagrams (Mermaid/C4), key decisions, constraints |
| ADR | One decision: context, options, decision, consequences ([template](../../templates/adr.md)) |
| Runbook | Alert → diagnosis → mitigation → escalation ([template](../../templates/runbook.md)) |
| Changelog | User-visible changes per release (Keep a Changelog) |

## Code-level documentation

- Doc comments (JSDoc/TSDoc, docstrings, Javadoc) on public APIs: purpose, parameters, return, errors, side effects, examples. Not on every private function.
- Keep comments in sync or delete them.

## Style

Active voice, present tense, short sentences, consistent terminology, descriptive headings, relative links, fenced code blocks with language, tables for comparisons, diagrams as text (Mermaid) so they diff.

## Checklist

- [ ] Commands verified; versions current
- [ ] No secrets/internal URLs that shouldn't be public
- [ ] Links valid; table of contents for long pages
- [ ] Reader can complete the task without asking someone
