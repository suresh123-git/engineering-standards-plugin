---
title: Release Checklist
version: 1.0.0
---

# Release Checklist

Standards: [branching and releases](../standards/git/branching-and-releases.md), [changelog](../standards/documentation/changelog-and-releases.md), [CI/CD](../standards/devops/ci-cd.md).

- [ ] Version bump follows SemVer; breaking changes documented
- [ ] Changelog `[Unreleased]` moved to a dated release section
- [ ] CI green on the release commit; artifacts built once and signed/tagged (`vX.Y.Z`)
- [ ] Database migrations reviewed; backward compatible; backup verified ([migration safety](../standards/database/migration-safety.md))
- [ ] Config/secrets present in target environment; feature flags set
- [ ] Staging smoke/E2E passed; performance sanity check
- [ ] [Production readiness](production-readiness.md) reviewed for significant changes
- [ ] Rollback plan and previous artifact available
- [ ] Monitoring/alerts and on-call aware; deploy marker created
- [ ] Post-deploy verification and announcement; follow-ups ticketed
