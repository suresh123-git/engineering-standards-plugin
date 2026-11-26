---
title: Security Review Checklist
version: 1.0.0
---

# Security Review Checklist

Detail: [OWASP guide](../standards/security/owasp-top-10.md), [authn/authz](../standards/security/authn-authz-sessions-jwt.md), [input validation](../standards/security/input-validation-injection.md), [secrets](../standards/security/secrets-management.md), [dependencies](../standards/security/dependency-security.md).

- [ ] Access control: deny-by-default; object-level and tenant checks; no IDOR
- [ ] Authentication: strong hashing (Argon2id/bcrypt), MFA for privileged, lockout/rate limits
- [ ] Sessions/JWT: validated alg/iss/aud/exp; short TTL; refresh rotation; cookie flags
- [ ] Input validation: allow-lists, size limits, schema validation on every entry point
- [ ] Injection: parameterised SQL/NoSQL; no shell string building; XSS encoding/sanitisation
- [ ] SSRF/path traversal/open redirect: allow-lists and normalisation
- [ ] Secrets: none in repo/images/logs; rotation; least privilege
- [ ] Crypto: TLS 1.2+, modern algorithms, secure randomness, KMS for keys
- [ ] Configuration: no debug in prod, security headers, CORS allow-list, no default creds
- [ ] Dependencies: audited; lockfile; pinned CI actions
- [ ] Logging/monitoring: security events logged; no sensitive data; alerts
- [ ] File uploads/downloads: validation, storage isolation
- [ ] Business logic abuse: rate limits, race conditions, replay
- [ ] Infrastructure: least-privilege IAM, no public data stores, network segmentation
