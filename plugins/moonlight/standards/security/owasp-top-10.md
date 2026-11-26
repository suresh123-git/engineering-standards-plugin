---
title: OWASP Top 10 Review Guide
version: 1.0.0
---

# OWASP Top 10 Review Guide

Mapped to the OWASP Top 10 (2021 edition, still the widely-referenced baseline; check owasp.org for the current release when auditing). For each category: what to look for in code/config. Report only issues with evidence and a plausible attack path.

| # | Category | Look for |
|---|---|---|
| A01 | **Broken Access Control** | Missing authorization on routes/handlers; IDOR (object ids accepted without ownership/tenant check); privilege escalation via mass assignment; CORS `*` with credentials; client-side-only checks; forced browsing to admin paths; JWT claims trusted without verification. See [authn/authz](authn-authz-sessions-jwt.md) |
| A02 | **Cryptographic Failures** | Plaintext secrets/PII at rest or in transit; HTTP instead of TLS; MD5/SHA1 for passwords; home-made crypto; static IVs/keys; weak randomness (`Math.random` for tokens); missing HSTS |
| A03 | **Injection** | String-built SQL/NoSQL/LDAP/OS commands; `eval`/`Function`; template injection; unsafe deserialization; XSS via `innerHTML`/`dangerouslySetInnerHTML`/unescaped templates. See [input validation](input-validation-injection.md) |
| A04 | **Insecure Design** | No threat model; missing rate limits/abuse cases; business-logic flaws (price tampering, race to redeem twice); trust boundaries unclear |
| A05 | **Security Misconfiguration** | Debug mode/verbose errors in prod; default creds; open S3/buckets; permissive security groups/IAM; missing security headers (CSP, X-Content-Type-Options, frame-ancestors); unnecessary services/ports; directory listing |
| A06 | **Vulnerable & Outdated Components** | Known-CVE dependencies, EOL runtimes, unpinned/unverified sources, abandoned packages. See [dependencies](dependency-security.md) |
| A07 | **Identification & Authentication Failures** | Weak password policy/storage, no MFA for admin, credential stuffing exposure, session fixation, tokens in URLs, long-lived tokens without rotation |
| A08 | **Software & Data Integrity Failures** | Unsigned artifacts, CI/CD with unreviewed third-party actions/scripts, auto-update without verification, insecure deserialization, `curl | sh` in build |
| A09 | **Logging & Monitoring Failures** | No audit log for auth/access/admin actions; secrets in logs; no alerting; logs injectable (CRLF) |
| A10 | **SSRF** | Server fetching user-supplied URLs without allow-list; access to cloud metadata (169.254.169.254); redirects followed blindly |

## Additional checks

- File uploads: type/size/content validation, storage outside web root, randomised names, malware scan, no direct execution.
- Open redirects; clickjacking; CSRF on cookie-authenticated state-changing requests (SameSite, anti-CSRF tokens).
- Mass assignment / over-posting: bind to explicit DTO allow-lists.
- Race conditions on single-use resources (coupons, tokens): atomic DB operations.
- Error messages and responses that disclose existence of users/resources.
- Multi-tenant isolation: tenant id in every query and cache key.
- Denial of service: unbounded payloads, regex (ReDoS), unbounded queries, expensive GraphQL queries.

## Severity guidance

Critical: unauthenticated RCE/SQLi/auth bypass, secrets exposed publicly. High: authenticated privilege escalation/IDOR, stored XSS, SSRF to internal. Medium: reflected XSS with limited impact, missing headers on sensitive app, weak crypto with mitigations. Low/Info: hardening gaps.
