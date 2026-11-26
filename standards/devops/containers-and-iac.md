---
title: Containers and Infrastructure as Code
version: 1.0.0
---

# Containers and Infrastructure as Code

## Dockerfiles

- Minimal, pinned base image (version + digest for production); prefer slim/distroless; multi-stage builds so toolchains stay out of the runtime image.
- Run as **non-root** (`USER`), read-only root filesystem where possible, drop capabilities.
- Layer ordering for cache: copy manifests/lockfile → install deps → copy source. Use `.dockerignore` (exclude `.git`, `node_modules`, `.env`, tests, docs).
- `npm ci --omit=dev`/equivalent; no dev tools in the final image; clean package manager caches in the same layer.
- No secrets in `ENV`/`ARG`/layers (use BuildKit secrets). One process per container; `exec`-form `CMD`/`ENTRYPOINT` with proper signal handling (tini/`--init`); `HEALTHCHECK` or orchestrator probes.
- Scan images; rebuild regularly for base-image patches; set `LABEL` provenance; reproducible tags (never `latest` in deployments).

## Kubernetes

- Set **requests and limits**, probes (startup/readiness/liveness), `securityContext` (`runAsNonRoot`, `allowPrivilegeEscalation: false`, `readOnlyRootFilesystem`, seccomp `RuntimeDefault`), `PodDisruptionBudget`, anti-affinity/topology spread, HPA, graceful termination.
- Config via ConfigMap/Secret (external secrets operator), NetworkPolicies default-deny, RBAC least privilege, dedicated ServiceAccounts, resource quotas per namespace, image pull from trusted registry by digest.
- Declarative GitOps (Argo CD/Flux); Helm/Kustomize with values per environment; no `kubectl apply` by hand to prod.

## Terraform

- Remote encrypted state with locking; separate state per environment/component; modules with pinned versions; provider and Terraform version constraints; `terraform fmt/validate`, `tflint`, `tfsec`/`checkov` in CI; **plan reviewed before apply**; no manual console drift.
- No secrets in variables/state; use data sources/secret references; mark `sensitive`.
- `prevent_destroy` and deletion protection on stateful resources; understand `force replacement` in plans.
- Tag everything (owner, env, cost-centre); least-privilege IAM; avoid wildcard `*` actions/resources.

## CloudFormation

- Parameters with constraints; `Conditions`; `DeletionPolicy`/`UpdateReplacePolicy: Retain|Snapshot` on data stores; `NoEcho` for sensitive parameters and dynamic references to Secrets Manager/SSM; change sets reviewed before execute; stack policies; drift detection; nested stacks/modules for reuse; `cfn-lint`/`cfn-guard`; avoid circular `DependsOn`; export/import coupling kept minimal.

## AWS general

Multi-AZ, encryption (KMS) at rest/in transit, private subnets for data/app tiers, security groups least-open (no `0.0.0.0/0` on admin ports), IAM roles not users, MFA, CloudTrail/Config/GuardDuty, backups with tested restores, cost tags/budgets, S3 Block Public Access.

## Safety

Infra changes to production require explicit approval, a reviewed plan, and a rollback path (see [safety rules](../global/safety-rules.md)).
