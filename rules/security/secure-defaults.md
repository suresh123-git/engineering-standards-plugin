---
name: secure-defaults
description: Always-on secure coding defaults for input handling, access control, secrets, data access and dependencies.
scope: always
globs: []
version: 1.0.0
---

# Secure Defaults

- Authenticate **and** authorise every request at the object level; deny by default; enforce tenant isolation.
- Validate all external input with allow-lists and size limits; encode output for its context.
- Use parameterised queries; never build SQL/NoSQL/shell commands from user input.
- Secrets come from the environment or a secrets manager — never from source, logs, client bundles or error messages.
- Hash passwords with Argon2id/bcrypt; use vetted libraries for crypto, JWT and sessions; verify JWT `alg`, `iss`, `aud`, `exp`.
- Return generic errors to clients; log details server-side without sensitive data.
- Prefer existing, maintained dependencies; avoid unnecessary new ones; keep lockfiles committed.

Details: [OWASP guide](../../standards/security/owasp-top-10.md) · [authn/authz](../../standards/security/authn-authz-sessions-jwt.md) · [input validation](../../standards/security/input-validation-injection.md) · [secrets](../../standards/security/secrets-management.md)
