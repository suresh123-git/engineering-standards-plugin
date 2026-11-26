---
disable-model-invocation: true
name: "secure-coding"
description: "Use whenever code handles input, authentication, authorization, data access, secrets, files, outbound requests or dependencies — applies OWASP-aligned secure coding and review practices."
---
# Secure Coding

## When to apply

Writing or reviewing endpoints, auth flows, queries, file/URL handling, config, CI/IaC, or dependency changes. Security is a baseline for all code, but be proportionate: report exploitable issues, not hypothetical ones.

## How to apply

1. Map **trust boundaries**: where untrusted data enters (HTTP, queues, files, webhooks, env) and which sinks it reaches (SQL, shell, HTML, paths, URLs, deserialisers).
2. Check **access control first** ([authn/authz](${CLAUDE_PLUGIN_ROOT}/standards/security/authn-authz-sessions-jwt.md)): explicit decision on every entry point, object-level and tenant checks, deny by default.
3. Validate input at the boundary and encode output by context ([input validation](${CLAUDE_PLUGIN_ROOT}/standards/security/input-validation-injection.md)); parameterise queries; avoid shells and `eval`.
4. Handle **secrets** per [secrets management](${CLAUDE_PLUGIN_ROOT}/standards/security/secrets-management.md); never log sensitive data.
5. Walk the [OWASP Top 10 guide](${CLAUDE_PLUGIN_ROOT}/standards/security/owasp-top-10.md) for the code in scope; add [dependency checks](${CLAUDE_PLUGIN_ROOT}/standards/security/dependency-security.md) when manifests change.
6. For each finding write the **attack scenario** and impact; prefer fixes using the project's existing security libraries (guards, middleware, Helmet, validation pipes).
7. Add a regression test for each fixed vulnerability (unauthorised access denied, malicious input rejected).
8. Use the [security checklist](${CLAUDE_PLUGIN_ROOT}/checklists/security-review.md) for audits.

## Checklist

- [ ] AuthN/AuthZ on every route; no IDOR; tenant isolation
- [ ] Inputs validated with allow-lists and size limits
- [ ] No string-built queries/commands; XSS sinks reviewed
- [ ] No secrets in code/logs; least privilege everywhere
- [ ] Safe defaults: TLS, cookie flags, CORS allow-list, security headers
- [ ] Dependencies audited and pinned; CI permissions minimal

## Common mistakes

Authentication without authorisation; validating only on the client; trusting JWT claims without verification; relying on obscurity of ids; adding security libraries that duplicate what the framework already provides; reporting low-risk "best practice" gaps as Critical.
