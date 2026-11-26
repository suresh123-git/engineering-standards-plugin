---
disable-model-invocation: true
name: "stack-terraform"
description: "Use in projects with Terraform/OpenTofu (*.tf, .terraform.lock.hcl) to review module structure, state management, provider/version pinning, IAM and network security, safe changes, drift and plan review."
---
# Terraform

## Detect

`*.tf`, `*.tfvars`, `.terraform.lock.hcl`, `terraform {}` blocks, `backend` config, `modules/`, `environments/`, Terragrunt files, `tofu` usage, CI steps running `terraform plan/apply`.

## Review focus

- **State**: remote backend (S3 + DynamoDB lock / GCS / Azure Blob / Terraform Cloud) with encryption, versioning and restricted access; **state contains secrets** — treat as sensitive; separate state per environment/component (small blast radius); no local state in repo; `terraform_remote_state`/data sources for cross-stack reads with minimal permissions.
- **Versions**: `required_version` and `required_providers` constrained (`~>`); `.terraform.lock.hcl` committed; module sources pinned to tags/commits; avoid `latest`/branch refs.
- **Structure**: reusable modules with clear inputs/outputs/descriptions/validation; no giant root module; consistent naming/tagging (`default_tags`); `for_each` (stable keys) over `count` for collections to avoid index-shift replacements; `locals` for DRY; avoid over-clever dynamic blocks.
- **Safety**: `lifecycle { prevent_destroy = true }` on stateful resources, `deletion_protection`, `create_before_destroy` where needed, `ignore_changes` used deliberately and documented; check plans for **forces replacement** (`-/+`) on databases, volumes, load balancers, KMS keys; `moved`/`import` blocks for refactors instead of destroy/recreate.
- **Security**: no secrets in `.tf`/`.tfvars` committed or default values; mark variables/outputs `sensitive`; secrets from Secrets Manager/SSM/Vault data sources; IAM least privilege (no `*`), encryption defaults (KMS), no public buckets/DBs, security groups scoped, logging enabled; scan with `tfsec`/`trivy config`/`checkov`/`tflint`.
- **Workflow**: `fmt -check`, `validate`, `tflint`, policy-as-code (OPA/Sentinel/Conftest) in CI; **plan on PR**, human-reviewed plan before apply; apply from CI with least-privilege role via OIDC, one apply at a time (locking); drift detection scheduled; destroy protections.
- **Cost & ops**: resource sizing via variables per env; autoscaling; lifecycle/retention rules; outputs documented; `terraform-docs` for modules.

## Implementation conventions

Follow existing module layout and naming; make additive changes first; use `terraform plan -out` and show the plan summary; prefer `moved` blocks for renames; keep variable descriptions/types/validation.

## Testing conventions

`terraform validate`, `terraform test` (native tests) or Terratest for modules; policy checks; ephemeral sandbox accounts for integration tests.

## Safety

Never run `apply`/`destroy` or touch state against shared/production environments without explicit approval and a reviewed plan ([safety rules](${CLAUDE_PLUGIN_ROOT}/standards/global/safety-rules.md)). Analysis tasks stay read-only.

## Pitfalls

`count` with lists (reordering destroys resources); secrets in state/outputs; unpinned providers/modules; broad IAM; hand-edited console resources causing drift; monolithic state; `ignore_changes = all`.
