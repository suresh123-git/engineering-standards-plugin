---
name: "stack-cicd"
description: "Use when a project has CI/CD pipeline definitions (GitHub Actions, GitLab CI, Jenkins, CircleCI, Azure Pipelines, CodeBuild) to review correctness, speed, pipeline security, quality gates and deployment safety."
---
# CI/CD

## Detect

`.github/workflows/*.yml`, `.gitlab-ci.yml`, `Jenkinsfile`, `.circleci/config.yml`, `azure-pipelines.yml`, `buildspec.yml`, `bitbucket-pipelines.yml`, `Makefile`/scripts invoked by CI, Argo Workflows/Tekton.

## Review focus

Use [CI/CD standards](${CLAUDE_PLUGIN_ROOT}/standards/devops/ci-cd.md) as the checklist; platform specifics:

- **GitHub Actions**: top-level `permissions: contents: read` with job-level escalation; **pin third-party actions to full commit SHA**; avoid `pull_request_target` + checkout of PR code; never interpolate untrusted `${{ github.event.* }}` (titles, branch names, comments) directly into `run:` (script injection) — pass via `env:`; use `concurrency` to cancel superseded runs and serialise deploys; OIDC (`id-token: write`) to AWS/GCP/Azure instead of stored keys; environments with required reviewers for prod; reusable workflows/composite actions to remove duplication; `actions/cache` keyed on lockfile hash; matrix for supported runtimes; `timeout-minutes` on jobs; `if: always()` only where intended.
- **GitLab CI**: protected variables/branches, `rules` over `only/except`, `needs` DAG for speed, cache vs artifacts distinction, environments with manual gates, includes/templates.
- **Jenkins**: declarative pipelines in SCM, credentials binding (no echo), agents isolated/ephemeral, shared libraries versioned, no scripted `sh` with interpolated secrets.
- **Cross-platform**: deterministic installs (`npm ci`, `pip --require-hashes` where used), tests+lint+types+build gates, artefact built once and promoted, container scan + dependency audit + secret scan steps, SBOM/provenance if required, deploy markers/notifications, automatic rollback or documented manual rollback, DB migration step ordering, flaky-test quarantine with owner, caching correctness (no cache poisoning from PRs).
- **Speed**: parallel jobs, path filters, affected-only builds (Nx/Turborepo), test sharding, Docker layer caching, right-sized runners; measure median duration.
- **Quality of config**: DRY, readable job names, comments for non-obvious choices, local reproducibility (`make ci`/npm scripts used by both).

## Implementation conventions

Edit the existing pipeline style; make minimal, safe changes; test pipeline changes on a branch; keep secrets in the platform's store and reference by name; document required secrets/variables in README.

## Pitfalls

Unpinned actions; broad `GITHUB_TOKEN` permissions; secrets exposed to forked PRs; `continue-on-error` hiding failures; building different artefacts per environment; deploying from any branch; no concurrency control causing overlapping deploys; cache keys that never invalidate.
