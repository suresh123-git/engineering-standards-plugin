---
title: Secrets Management
version: 1.0.0
---

# Secrets Management

## Rules

1. **No secrets in source control** — code, config, tests, Dockerfiles, CI YAML, notebooks, IaC state, examples. Use `.env.example` with placeholders; keep `.env` in `.gitignore`.
2. Load from the environment or a secrets manager (AWS Secrets Manager/SSM Parameter Store, Vault, GCP Secret Manager, Azure Key Vault, Kubernetes Secrets with encryption/external-secrets, CI secret stores). Prefer **workload identity / IAM roles** over long-lived keys.
3. Least privilege: scope each credential to one service and minimal permissions; separate per environment; no shared admin credentials.
4. **Rotate** on a schedule and on suspicion; support rotation without redeploy where possible (re-read on 401, versioned secrets).
5. Never log, echo, print in CI output, include in error messages, URLs, client bundles (`NEXT_PUBLIC_*`, `REACT_APP_*`, Angular `environment.ts` are public!), crash dumps or analytics.
6. Build-time secrets: use Docker BuildKit `--mount=type=secret`; never `ARG`/`ENV` secrets (they persist in image layers).
7. Encrypt at rest and in transit; use KMS-managed keys; envelope encryption for application data.
8. Terraform/CloudFormation: no plaintext secrets in state/templates; use dynamic references/`NoEcho`/secret ARNs; protect remote state (encrypted, access-controlled).
9. Pre-commit and CI secret scanning (gitleaks, trufflehog, GitHub secret scanning/push protection).
10. **If a secret is exposed**: treat as compromised — revoke and rotate immediately, then remove from history (rewriting history is not a substitute for rotation), audit usage, add a scanner rule.

## Detection patterns to flag in review

High-entropy strings, `AKIA…`, `-----BEGIN … PRIVATE KEY-----`, `password=`, `secret`, `token`, connection strings with credentials, JWT-looking strings, `.pem/.p12/.pfx/.keystore` files, `terraform.tfstate`, `.npmrc` with `_authToken`, Slack/Stripe/GitHub token prefixes. Report **location only**, never the value.

## Review checklist

- [ ] No credentials in repo/history/images/CI logs
- [ ] Config via env or secret manager; documented in `.env.example`
- [ ] Least privilege and per-environment separation
- [ ] Rotation procedure exists; scanner in CI
