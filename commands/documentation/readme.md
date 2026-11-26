---
name: readme
description: Generate or update a README with verified setup, usage, configuration and contribution information drawn from the actual project.
category: documentation
version: 1.0.0
mode: modifying
argument-hint: "[path to project/package | 'update' | 'audit']"
standards:
  - global/project-discovery
  - global/safety-rules
  - documentation/documentation-standards
skills:
  - clean-code
---

# /readme

## Purpose

Create a README that gets a new developer from clone to running in minutes — or bring an existing README back in line with reality. Everything in it (commands, env vars, ports, versions) comes from the repository, not from imagination.

## Expected Input

A project/package path (monorepo packages get their own README), and mode: `create` (default when none exists), `update`, or `audit` (report only). 

## Project Context Discovery

Run [project discovery](../../standards/global/project-discovery.md) (full pass). Additionally:

- Extract: purpose (package description, code, docs), runtime versions (`engines`, `.nvmrc`, Docker base), install/build/test/lint/start scripts, env vars (`.env.example`, config schema, code reads of `process.env`), ports, DB/queue dependencies (docker-compose), project structure, licence, CI badges, contribution docs.
- Read the existing README and its structure/voice if updating — keep what is accurate and useful.
- Verify commands by checking they exist in scripts/Makefile; run quick safe ones (e.g., `npm run lint --help` not destructive ops) only when sensible.

## Applicable Standards

- [Documentation standards](../../standards/documentation/documentation-standards.md) — README essentials and style

## Execution Steps

1. **Inspect** the project per discovery; for monorepos, decide root README vs package READMEs and link between them.
2. **Plan sections** from the essentials: title + one-line purpose · badges · overview/features · prerequisites · quick start · configuration (env var table: name, required, default, description) · usage/examples · scripts · project structure · architecture notes/link · testing · deployment · troubleshooting · contributing · licence · support.
3. **Draft** with verified commands, exact versions, and runnable examples; keep it scannable (tables, short sections); push deep content to `docs/` with links.
4. **Update mode**: diff reality vs README — stale commands, removed scripts, new env vars, outdated versions, dead links — fix those, preserve accurate content and the owner's voice; avoid rewriting for style alone.
5. **Verify**: every command exists; every env var appears in code/config; every link resolves; no secrets or real credentials; badges point to the right repo/workflow.
6. For `audit`: output a discrepancy report instead of editing.

## Output Format

- README file written/updated (path) and a **summary of changes**
- **Verification notes** (what was confirmed, what couldn't be, TODO placeholders for facts only the owners know — e.g. support contact, licence holder)

## Safety Constraints

- Edit README files only (and create `docs/` links only if requested). Do not change code or manifests.
- Never include real secrets, internal hostnames or personal data; use `.env.example`-style placeholders.
- Do not claim features, badges, licence or support that you cannot find; use `TODO:` markers for missing facts.

## Examples

```
/readme
/readme update
/readme packages/api audit
```
