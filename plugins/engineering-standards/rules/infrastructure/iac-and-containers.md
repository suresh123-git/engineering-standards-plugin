---
name: iac-and-containers
description: Conventions for Dockerfiles, Terraform, CloudFormation, Kubernetes manifests and CI workflows — least privilege, no secrets, safe changes.
scope: glob
globs: ["**/Dockerfile*", "**/docker-compose*.yml", "**/*.tf", "**/.github/workflows/*.yml", "**/k8s/**", "**/helm/**", "**/template.yaml"]
version: 1.0.0
---

# Infrastructure and Containers

- Run containers as non-root; pin base images; multi-stage builds; no secrets in layers, `ENV` or `ARG`.
- IAM and RBAC follow least privilege (no wildcard actions/resources without justification); no public data stores or `0.0.0.0/0` on admin/data ports.
- No secrets in IaC, values files or CI YAML; use secret managers and OIDC federation.
- Pin third-party CI actions/modules/providers to exact versions or SHAs; set minimal CI `permissions`.
- Stateful resources have backups, deletion protection and retain policies; review plans/change sets for replacements.
- **Never** apply, destroy or deploy to shared/production environments without explicit approval and a reviewed plan.

Details: [containers and IaC](../../standards/devops/containers-and-iac.md) · [CI/CD](../../standards/devops/ci-cd.md)
