---
disable-model-invocation: true
description: "Generate a Conventional Commits message from the staged (or working) changes, matching the project's commit style."
argument-hint: "[hint about intent | ticket id]"
allowed-tools: "Read, Grep, Glob, Bash(git diff:*), Bash(git log:*), Bash(git status:*), Bash(git show:*), Bash(git blame:*)"
---
# /commit

> **Mode: read-only.** Do not create, modify or delete files unless the user explicitly asks you to apply the changes. Running side-effect-free inspection commands (git log/diff, tests, linters) is fine.
>
> **User input:** $ARGUMENTS


## Purpose

Write a precise, conventional commit message that explains **what changed and why**, following the repository's existing style. By default it only **proposes** the message; it commits only if the user explicitly asks.

## Expected Input

Optional hint (intent, ticket id such as `ABC-123`). Otherwise derive everything from the diff.

## Project Context Discovery

Run a light pass of [project discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md). Additionally:

- `git status --short`, `git diff --staged` (if empty, `git diff`), `git log --oneline -20` for style, scopes and ticket-id conventions.
- Check `commitlint.config.*`, `.commitlintrc*`, `package.json` `commitlint`, husky/lefthook hooks, `CONTRIBUTING.md` for rules (types, scopes, max length, required footers).

## Applicable Standards

- [Conventional commits](${CLAUDE_PLUGIN_ROOT}/standards/git/conventional-commits.md) — types, format, breaking changes

## Execution Steps

1. Inspect staged changes; if nothing staged, inspect the working tree and say which files the message covers.
2. **Check cohesion**: if the diff mixes unrelated concerns (feature + refactor + formatting), recommend how to split (`git add -p` groupings) and propose one message per commit.
3. Determine **type** (`feat`, `fix`, `perf`, `refactor`, `docs`, `test`, `build`, `ci`, `chore`, `revert`) from effect, not file names; determine **scope** from the project's established scopes/folders.
4. Write the **subject**: imperative, ≤ 72 chars (prefer ≤ 50), no trailing period, matches observed project casing.
5. Write the **body** when the *why* isn't obvious: motivation, approach/trade-offs, side effects; wrap ~72 cols. Skip the body for trivial changes.
6. Add **footers**: `BREAKING CHANGE:` (and `!`) when public contracts change; `Closes #n`/ticket references from branch name or hint.
7. Verify the message is truthful: don't claim tests passed unless they were run; don't mention files that aren't in the diff; no secrets.
8. Output in a code block. **Do not run `git commit`** unless asked; if asked, run exactly the proposed message and show the result.

## Output Format

```
<proposed commit message in a code block>
```
Followed by: one line on classification rationale, and (if applicable) a split recommendation or a warning (e.g., "diff contains what looks like a secret in `.env.local`").

## Safety Constraints

- Never commit, amend, push, force-push or rewrite history without explicit instruction.
- If the diff contains secrets or large generated/binary files, warn before anything else.
- Do not include co-author or tool attribution lines unless the project requires them.

## Examples

```
/commit
/commit ABC-482
/commit this is a breaking API change
```

## Shared Requirements

- Run [project context discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md) first and load the matching `stack-*` skills.
- Follow the [safety rules](${CLAUDE_PLUGIN_ROOT}/standards/global/safety-rules.md); audit-style output uses the [findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md).
- Project conventions override generic advice unless they cause a concrete problem; never force a framework or architecture the project does not use.

## Loading stack skills (plugin)

Skills in this plugin are user-invoked only, so read the matching stack skills as files: `${CLAUDE_PLUGIN_ROOT}/skills/stack-<name>/SKILL.md` (e.g. `stack-nestjs`, `stack-postgresql`), and core skills at `${CLAUDE_PLUGIN_ROOT}/skills/<name>/SKILL.md`. Read only those for technologies the project actually uses.
