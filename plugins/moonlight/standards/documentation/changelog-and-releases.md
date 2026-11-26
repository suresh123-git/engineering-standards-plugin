---
title: Changelog Standards
version: 1.0.0
---

# Changelog Standards

Format: [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) + [Semantic Versioning](https://semver.org/). If the project uses an automated tool (release-please, semantic-release, changesets, towncrier), follow its format and say how the file is generated.

## Structure

```
# Changelog
All notable changes to this project are documented here.

## [Unreleased]

## [1.2.0] - 2026-11-26
### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security

[Unreleased]: https://github.com/org/repo/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/org/repo/compare/v1.1.0...v1.2.0
```

## Writing entries

- Written for **users and operators**, not developers: describe impact ("Fixed duplicate invoices when a payment webhook is retried"), not commits ("fix webhook").
- Group by category; newest release first; ISO dates.
- Highlight **breaking changes** and **migration steps** prominently (put under **Changed**/**Removed** with a `BREAKING:` prefix and link to the guide).
- Link PRs/issues; credit external contributors.
- Security fixes: mention CVE/advisory ids once disclosed.
- Omit noise: dependency bumps without user impact, refactors, CI tweaks (unless the project wants them).

## Generating from history (`/changelog`)

1. Determine the range: last tag → `HEAD` (or user-provided).
2. Gather `git log --no-merges` plus merged PR titles/labels; parse conventional commit types ([conventional commits](../git/conventional-commits.md)).
3. Map: `feat`→Added, `fix`→Fixed, `perf`/`refactor` with user impact→Changed, `BREAKING CHANGE`→flag, deprecations, security.
4. Propose the next version from SemVer rules.
5. Merge into the existing `## [Unreleased]` section without altering published releases.
