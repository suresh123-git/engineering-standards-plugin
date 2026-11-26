---
title: CI/CD Standards
version: 1.0.0
---

# CI/CD Standards

## Pipeline shape

1. **Fast feedback first**: install (cached, from lockfile) → lint/format/typecheck → unit tests → build → integration tests → security scans → package → deploy to staging → smoke/E2E → promote to production.
2. **Build once, deploy many**: produce an immutable, versioned artifact (image tagged with commit SHA and version); promote the *same* artifact across environments; configuration injected at deploy time.
3. Run jobs in parallel where independent; cache dependencies and build layers; use path filters/matrix builds in monorepos.
4. Pipelines are code in the repo; reviewed like application code.

## Quality gates

Required checks on protected branches: tests, lint, type check, build, coverage on changed lines, SAST/dependency/secret scanning, IaC scan (tfsec/checkov), container scan (Trivy/Grype), licence check, migration check, OpenAPI diff.

## Security of the pipeline

- **Least-privilege** tokens (`permissions:` in GitHub Actions set to read by default); short-lived OIDC federation to cloud instead of stored keys.
- **Pin third-party actions/images by digest/SHA**; review marketplace actions; avoid `pull_request_target` with untrusted code; never echo secrets; mask outputs.
- Separate build and deploy credentials; manual approval for production; protected environments; branch protection.
- Sign artifacts and generate SBOM/provenance (cosign, SLSA) where mandated.
- Ephemeral, isolated runners; no secrets exposed to forked-PR workflows.

## Deployment strategies

Rolling, blue/green, canary with automated analysis and **automatic rollback** on SLO breach; feature flags decouple deploy from release; database migrations follow [migration safety](../database/migration-safety.md); post-deploy smoke tests; deploy markers on dashboards.

## Reliability and maintainability

- Idempotent, re-runnable jobs; timeouts and `concurrency` groups to avoid overlapping deploys; retries only for infra flake.
- Flaky tests are quarantined **with an owner and deadline**, not ignored.
- Keep pipeline duration within a budget (e.g., < 10 min to merge-ready); report timing.
- Environment parity: same container, same commands locally and in CI (`make ci`/npm scripts).

## Review checklist

- [ ] Triggers correct (PR, main, tags); path filters sound
- [ ] Permissions minimal; actions pinned; secrets handled safely
- [ ] Deterministic installs (`npm ci`), caches keyed on lockfile
- [ ] Artifact built once and promoted; rollback documented and tested
- [ ] Production deploy gated and observable
