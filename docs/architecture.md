# Architecture

## Goals
One canonical source, many IDE-native outputs, no runtime, no duplication.

## Pipeline
1. **Load** — `scripts/lib.mjs` parses commands, skills, rules (small YAML-subset frontmatter parser, no dependencies).
2. **Transform** — each `adapters/<ide>/adapter.mjs` exports `generate(ctx)` returning `{ path, content }` or `{ path, block }` entries.
   - `renderCommandBody` adds a mode notice (read-only vs modifying), a user-input line and a *Shared Requirements* footer.
   - `rewriteLinks` converts relative links (e.g. `../../standards/x.md`) into `.engineering-standards/standards/x.md`. It is fence-aware and only rewrites links that resolve inside the repo.
3. **Write** — `scripts/build.mjs` writes `dist/<ide>/…` and `dist/shared/.engineering-standards/…`.
4. **Install** — `scripts/install.mjs` copies the selected IDE trees plus the shared folder into a project. Files carrying a `block` are merged between `engineering-standards:start/end` markers.

## Managed blocks
`CLAUDE.md`, `AGENTS.md` and `.github/copilot-instructions.md` are usually user-authored. The installer only replaces the text between its markers and appends the block if none exists. Uninstall strips the block and deletes the file only if nothing else remains.

## Manifest
`.engineering-standards/.install.json` stores the version, IDEs, a SHA-256 per installed file and the list of block files. This gives safe upgrades (unmodified files are refreshed, modified ones are skipped unless `--force`) and safe uninstalls.

## Why commands for Codex are skills
Codex has no repository-level custom slash commands, and `~/.codex/prompts` is deprecated, so commands are emitted as explicit-invocation skills.

## Stack awareness
Commands never hard-code a framework. They run [project discovery](../standards/global/project-discovery.md), which maps repository signals (`nest-cli.json`, `angular.json`, `pom.xml`, `Dockerfile`, …) to `stack-*` skills and records a short *Project context* summary used in every report.

## Non-goals
No agents or orchestration, no services, no LLM calls, no vector stores.
