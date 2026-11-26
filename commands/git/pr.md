---
name: pr
description: Generate a complete pull request title and description from the branch diff using the project's PR template.
category: git
version: 1.0.0
mode: read-only
argument-hint: "[base branch | issue reference]"
standards:
  - global/project-discovery
  - global/safety-rules
  - git/pull-requests
  - git/conventional-commits
skills:
  - code-review
---

# /pr

## Purpose

Produce a reviewer-friendly PR title and description: what/why, how, testing, risk and rollback, breaking changes and migration notes — grounded in the actual diff. It does not open or merge the PR unless asked.

## Expected Input

Optional base branch (default: the repository's default branch) and linked issue reference.

## Project Context Discovery

Run a light pass of [project discovery](../../standards/global/project-discovery.md). Additionally:

- Find the PR template (`.github/pull_request_template.md`, `.github/PULL_REQUEST_TEMPLATE/`, GitLab templates) and follow it exactly; otherwise use the toolkit [PR template](../../templates/pull-request.md).
- Compute the diff: `git merge-base <base> HEAD`, `git log <base>..HEAD --oneline`, `git diff <base>...HEAD --stat` and relevant file diffs.
- Read commit messages, branch name (ticket ids), changed tests, migrations, config and API/spec files.

## Applicable Standards

- [Pull request standards](../../standards/git/pull-requests.md), [conventional commits](../../standards/git/conventional-commits.md)
- Checklist: [pull request](../../checklists/pull-request.md)

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
