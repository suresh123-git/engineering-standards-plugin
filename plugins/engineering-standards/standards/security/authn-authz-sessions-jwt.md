---
title: Authentication, Authorization, Sessions and JWT
version: 1.0.0
---

# Authentication, Authorization, Sessions and JWT

## Authentication

- Prefer a battle-tested identity provider/library (OIDC/OAuth 2.1, Auth0/Cognito/Keycloak, Passport, Spring Security). Do not invent protocols.
- Passwords: hash with **Argon2id** (or bcrypt cost ≥ 12 / scrypt); unique salt per hash; never reversible encryption; constant-time comparison. Enforce length ≥ 12 (no composition theatre), check against breached lists, rate-limit and lock out progressively, uniform error messages ("invalid credentials").
- MFA for privileged and sensitive actions; WebAuthn/passkeys preferred over SMS.
- Password reset/verification: single-use, short-lived, high-entropy tokens stored hashed; do not reveal whether an account exists.
- Service-to-service: mTLS or signed short-lived tokens/workload identity; no shared static secrets in code.

## Authorization

- **Deny by default.** Authorise on the **server**, on **every request**, at the **object level** (does this user own/can access *this* record, in *this* tenant?).
- Centralise policy (guards/middleware/policy engine such as CASL/Casbin/OPA) rather than scattering `if (role === …)`.
- Prefer permission/attribute-based checks over role-name checks in business code; least privilege; separate admin surfaces.
- Prevent mass assignment: explicit DTO allow-lists; never bind request bodies directly to entities.
- Re-check authorization on indirect access paths (exports, background jobs, GraphQL nested resolvers, websocket events).

## Sessions

- Server-side sessions: cookie flags `HttpOnly; Secure; SameSite=Lax|Strict`, `__Host-` prefix where possible; regenerate id on login/privilege change; idle and absolute timeouts; invalidate on logout and password change; store in Redis/DB, not memory, for multi-instance.
- CSRF protection for cookie-authenticated mutating requests (SameSite + token/double-submit or custom header).

## JWT

- Use for short-lived **access tokens** (≈5–15 min); refresh tokens are opaque, rotated on use, revocable, stored server-side (hashed), bound to client where possible.
- Verify **signature, `alg` (allow-list, never `none`, no alg confusion), `iss`, `aud`, `exp`, `nbf`**; reject unknown `kid`; fetch JWKS over TLS with caching.
- Prefer asymmetric signing (RS256/ES256/EdDSA) across services; HS256 only with a strong secret (≥ 256-bit) shared by one party; rotate keys.
- Put minimal claims; no secrets or sensitive PII in payload (it is only encoded). Authorisation-critical data should be checked against server state when staleness is unacceptable.
- Browser storage: avoid `localStorage` for tokens where XSS is a risk; prefer `HttpOnly` cookies or in-memory + silent refresh.
- Plan revocation (short TTL + denylist/versioning, "logout all").

## Review checklist

- [ ] Every route/resolver has an explicit auth decision (including public ones)
- [ ] Object-level ownership/tenant checks
- [ ] Hashing algorithm & parameters appropriate
- [ ] JWT validation complete; TTLs sane; refresh rotation
- [ ] Cookie flags & CSRF handled; session lifecycle correct
- [ ] Auth events logged; brute-force controls present
