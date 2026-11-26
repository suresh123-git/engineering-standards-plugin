---
title: Branching Strategy and Release Management
version: 1.0.0
---

# Branching Strategy and Release Management

Detect and follow the strategy the project already uses (protected branches, `develop`, `release/*`, tags, CI triggers).

## Strategies

| Strategy | Fit | Notes |
|---|---|---|
| **Trunk-based** (short-lived branches off `main`, feature flags) | Teams with strong CI/CD and fast reviews | Preferred default: branches live < 2 days; incomplete work hidden behind flags |
| **GitHub Flow** | Continuous deployment of `main` | Branch → PR → review → merge → deploy |
| **Git Flow** (`develop`, `release/*`, `hotfix/*`) | Scheduled, versioned releases; multiple supported versions | Heavier; justify before introducing |

## Branch naming

`feat/<ticket>-short-desc`, `fix/<ticket>-…`, `chore/…`, `release/x.y.z`, `hotfix/x.y.z`. Lowercase, hyphenated.

## Merge practices

- `main` is always releasable and protected: required reviews, required status checks, no force-push, linear history if the team prefers.
- Squash-merge for small feature branches (clean history), merge commits when preserving a multi-commit story matters; rebase locally to keep up to date — **never rewrite shared history**.
- Keep branches small; rebase/merge `main` frequently to avoid large conflicts.

## Releases

- **Semantic Versioning**: MAJOR.MINOR.PATCH, pre-release tags (`-rc.1`). Version bump derived from conventional commits.
- Tag releases (`vX.Y.Z`, annotated); build artifacts **once** and promote the same artifact through environments.
- Maintain a `CHANGELOG.md` ([Keep a Changelog](https://keepachangelog.com/)) generated/curated from commits and PRs.
- Release checklist: green CI, migrations reviewed, config/secrets verified, feature flags set, rollback plan, monitoring/alerts ready, release notes, communication.
- **Hotfix**: branch from the released tag, minimal fix, test, tag, and merge back to `main`.
- Rollback: redeploy previous artifact; ensure DB migrations were backward compatible (see [migration safety](../database/migration-safety.md)).
- Deprecation policy and support windows documented.
