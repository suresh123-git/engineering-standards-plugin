---
disable-model-invocation: true
description: "Generate a complete pull request title and description from the branch diff using the project's PR template."
argument-hint: "[base branch | issue reference]"
allowed-tools: "Read, Grep, Glob, Bash(git diff:*), Bash(git log:*), Bash(git status:*), Bash(git show:*), Bash(git blame:*)"
---
# /pr

> **Mode: read-only.** Do not create, modify or delete files unless the user explicitly asks you to apply the changes. Running side-effect-free inspection commands (git log/diff, tests, linters) is fine.
>
> **User input:** $ARGUMENTS


## Purpose

Produce a reviewer-friendly PR title and description: what/why, how, testing, risk and rollback, breaking changes and migration notes — grounded in the actual diff. It does not open or merge the PR unless asked.

## Expected Input

Optional base branch (default: the repository's default branch) and linked issue reference.

## Project Context Discovery

Run a light pass of [project discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md). Additionally:

- Find the PR template (`.github/pull_request_template.md`, `.github/PULL_REQUEST_TEMPLATE/`, GitLab templates) and follow it exactly; otherwise use the toolkit [PR template](${CLAUDE_PLUGIN_ROOT}/templates/pull-request.md).
- Compute the diff: `git merge-base <base> HEAD`, `git log <base>..HEAD --oneline`, `git diff <base>...HEAD --stat` and relevant file diffs.
- Read commit messages, branch name (ticket ids), changed tests, migrations, config and API/spec files.

## Applicable Standards

- [Pull request standards](${CLAUDE_PLUGIN_ROOT}/standards/git/pull-requests.md), [conventional commits](${CLAUDE_PLUGIN_ROOT}/standards/git/conventional-commits.md)
- Checklist: [pull request](${CLAUDE_PLUGIN_ROOT}/checklists/pull-request.md)

## Execution Steps

1. Collect the diff and commits; group changes by purpose (feature, fix, refactor, tests, docs, config).
2. **Title**: conventional-commit style unless the project differs; ≤ ~70 chars.
3. **What & why**: motivation from issue/commit context — do not invent business reasons; mark unknowns as TODO for the author.
4. **How**: key design decisions and notable implementation points; call out files reviewers should read first.
5. **Testing**: list tests added/changed; include only commands actually run, otherwise "not run" with the commands to run.
6. **Risk & rollback**: blast radius, migrations (and their compatibility), feature flags, config/env var changes, performance implications, rollback steps.
7. **Breaking changes / deprecations** with migration notes; **screenshots** placeholders for UI changes.
8. **Self-review flags**: oversize PR (suggest splitting), unrelated changes, missing tests/docs, leftover debug code, secrets, TODOs.
9. Fill the template's checklist honestly: tick only what the diff demonstrates.

## Output Format

Markdown ready to paste: `Title:` line, then the description following the template. Append a short "Author notes" list (not part of the description) with split suggestions or gaps. If the user asks to create the PR and `gh`/platform tooling exists, show the command first and run it only after confirmation.

## Safety Constraints

- Do not push branches, create/merge PRs, or change labels/reviewers without explicit instruction.
- Never fabricate test results, issue numbers or approvals; never include secrets or internal URLs not already in the repo.

## Examples

```
/pr
/pr main
/pr closes #482, targets the release/2.4 branch
```

## Shared Requirements

- Run [project context discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md) first and load the matching `stack-*` skills.
- Follow the [safety rules](${CLAUDE_PLUGIN_ROOT}/standards/global/safety-rules.md); audit-style output uses the [findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md).
- Project conventions override generic advice unless they cause a concrete problem; never force a framework or architecture the project does not use.

## Loading stack skills (plugin)

Skills in this plugin are user-invoked only, so read the matching stack skills as files: `${CLAUDE_PLUGIN_ROOT}/skills/stack-<name>/SKILL.md` (e.g. `stack-nestjs`, `stack-postgresql`), and core skills at `${CLAUDE_PLUGIN_ROOT}/skills/<name>/SKILL.md`. Read only those for technologies the project actually uses.
