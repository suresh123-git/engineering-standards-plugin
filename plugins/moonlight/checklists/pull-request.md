---
title: Pull Request Checklist
version: 1.0.0
---

# Pull Request Checklist

Standards: [pull requests](../standards/git/pull-requests.md), [conventional commits](../standards/git/conventional-commits.md).

**Author**
- [ ] One purpose; < ~400 changed lines or split
- [ ] Title/commits follow project convention
- [ ] Description explains what, why, how tested, risk and rollback
- [ ] Tests added/updated and passing; coverage of new branches
- [ ] Docs, OpenAPI, changelog updated
- [ ] Migrations/config/feature flags called out
- [ ] No secrets, debug code, unrelated formatting changes

**Reviewer**
- [ ] Solves the stated problem; nothing unrelated
- [ ] Correctness, security, compatibility reviewed ([code review checklist](code-review.md))
- [ ] Blocking vs non-blocking comments clearly marked
- [ ] Verdict recorded
