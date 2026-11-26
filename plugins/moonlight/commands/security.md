---
disable-model-invocation: true
description: "Perform a security assessment of code and configuration against OWASP Top 10 and secure-coding standards, with exploit-aware, evidence-backed findings."
argument-hint: "<file | directory | feature | PR range | blank for whole repo>"
allowed-tools: "Read, Grep, Glob, Bash(git diff:*), Bash(git log:*), Bash(git status:*), Bash(git show:*), Bash(git blame:*)"
---
# /security

> **Mode: read-only.** Do not create, modify or delete files unless the user explicitly asks you to apply the changes. Running side-effect-free inspection commands (git log/diff, tests, linters) is fine.
>
> **User input:** $ARGUMENTS


## Purpose

Find exploitable weaknesses and unsafe defaults: access control flaws, injection, authentication/session/JWT mistakes, secrets exposure, insecure configuration, SSRF, unsafe file handling, and vulnerable dependencies. Reports **realistic attack paths**, not generic warnings.

## Expected Input

A scope (file/feature/PR/whole repo). With no scope, map the attack surface first, then audit the highest-risk areas (auth, payments, file upload, admin, data export, webhooks).

## Project Context Discovery

Run [project discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md). Additionally:

- Map the **attack surface**: routes/resolvers/consumers/webhooks/cron/CLI, their auth requirements and data touched.
- Identify trust boundaries and sensitive data (PII, credentials, payments, health) and where it is stored/logged.
- Locate auth middleware/guards, validation layer, ORM/raw query usage, crypto usage, CORS/headers config, file handling, outbound HTTP calls.
- Check IaC/Docker/CI for misconfigurations; check for existing security tooling (SAST, secret scanning, Dependabot).

## Applicable Standards

- [OWASP Top 10](${CLAUDE_PLUGIN_ROOT}/standards/security/owasp-top-10.md), [authn/authz/JWT](${CLAUDE_PLUGIN_ROOT}/standards/security/authn-authz-sessions-jwt.md), [input validation and injection](${CLAUDE_PLUGIN_ROOT}/standards/security/input-validation-injection.md), [secrets](${CLAUDE_PLUGIN_ROOT}/standards/security/secrets-management.md), [dependency security](${CLAUDE_PLUGIN_ROOT}/standards/security/dependency-security.md)
- [Findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md); checklist: [security review](${CLAUDE_PLUGIN_ROOT}/checklists/security-review.md)

## Execution Steps

1. Map the attack surface and data flows; list assets and trust boundaries.
2. **Access control**: for each entry point verify authentication *and* object-level authorisation (IDOR, tenant isolation, role checks on the server), mass-assignment, admin endpoints.
3. **Injection & input**: trace each untrusted input to its sinks (SQL/NoSQL, shell, templates, HTML, file paths, URLs, deserialisation, regex); confirm validation and encoding.
4. **Authentication/session/JWT**: password hashing, reset/verification flows, token validation (alg/iss/aud/exp), cookie flags, CSRF, brute-force protection, MFA.
5. **Secrets & crypto**: scan for hard-coded credentials (report location only), weak algorithms, `Math.random` for security values, key management, TLS config.
6. **Configuration**: debug flags, CORS, security headers, error verbosity, default credentials, public buckets/security groups, container privileges, CI permissions.
7. **Outbound & files**: SSRF controls, upload validation/storage, path traversal, archive extraction.
8. **Dependencies**: assess per [dependency security](${CLAUDE_PLUGIN_ROOT}/standards/security/dependency-security.md); run available audit tools if allowed.
9. **Verify each suspicion** in code; write the attack scenario (who, how, impact) and **exploitability**; drop theoretical items without a path. Rate severity accordingly.
10. Provide fixes aligned with project libraries (e.g., Nest guards, Express middleware, Helmet, parameterised ORM queries) and a verification test idea per finding.

## Output Format

Shared finding format plus **Attack scenario** and **Mapped OWASP category** per finding. Add: attack-surface summary, "secure by default" strengths, residual-risk notes, and a prioritised remediation order.

## Safety Constraints

- Read-only static assessment. **Do not exploit, probe live systems, run scanners against hosts you don't own, or fetch credentials.**
- Redact secrets; cite `file:line` only. Do not include working exploit payloads beyond minimal proof-of-concept inputs needed to explain the issue.
- If you find an exposed live secret, advise immediate rotation before anything else.

## Examples

```
/security
/security src/auth src/users
/security main..HEAD — new file upload feature
```

## Shared Requirements

- Run [project context discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md) first and load the matching `stack-*` skills.
- Follow the [safety rules](${CLAUDE_PLUGIN_ROOT}/standards/global/safety-rules.md); audit-style output uses the [findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md).
- Project conventions override generic advice unless they cause a concrete problem; never force a framework or architecture the project does not use.

## Loading stack skills (plugin)

Skills in this plugin are user-invoked only, so read the matching stack skills as files: `${CLAUDE_PLUGIN_ROOT}/skills/stack-<name>/SKILL.md` (e.g. `stack-nestjs`, `stack-postgresql`), and core skills at `${CLAUDE_PLUGIN_ROOT}/skills/<name>/SKILL.md`. Read only those for technologies the project actually uses.
