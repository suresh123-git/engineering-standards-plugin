---
title: Input Validation and Injection Prevention
version: 1.0.0
---

# Input Validation and Injection Prevention

## Validation

- Validate **all** external input at the trust boundary (HTTP bodies/params/headers, queue messages, files, webhooks, env/config, third-party responses): type, format, length, range, enumerations, cardinality.
- **Allow-list** over deny-list; reject by default; canonicalise before validating (Unicode normalisation, trim, decode once).
- Use schema validation libraries already in the project (class-validator/zod/joi/yup/pydantic/Bean Validation). Whitelist properties (`whitelist: true, forbidNonWhitelisted: true` in Nest `ValidationPipe`; `strict()` in zod).
- Enforce limits: body size, array length, string length, nesting depth, upload size, pagination caps.
- Validation is not output encoding: do both.

## SQL injection

- **Parameterised queries / prepared statements only**; ORMs' query builders with bound params. Never concatenate or template user data into SQL, including `ORDER BY` column names and `LIMIT` (allow-list them).
- Raw ORM escape hatches (`$queryRawUnsafe`, `sequelize.query` with interpolation, `knex.raw` with template strings, `createQueryBuilder().where(\`...${x}\`)`) are review hot-spots.
- Least-privilege DB accounts; no DDL rights for the app user at runtime.

## NoSQL injection

- MongoDB: reject objects where scalars are expected (`{"$gt": ""}` in login); cast/validate types (`typeof === 'string'`), use `mongo-sanitize`/schema validation; disable server-side JS (`$where`, `mapReduce`) unless essential; never pass raw request objects as filters.
- Redis: no string-built commands/scripts; namespace keys; validate key components.

## Other injection classes

- **OS command**: avoid shells; use `execFile`/`spawn` with argument arrays and allow-listed commands, never `exec` with user data.
- **XSS**: contextual output encoding; framework auto-escaping on; avoid `innerHTML`, `dangerouslySetInnerHTML`, `bypassSecurityTrust*` (Angular), `v-html`; sanitise rich text with DOMPurify; CSP.
- **Template/expression injection**, **LDAP**, **XPath**, **header/CRLF**, **log injection** (strip/encode newlines), **prototype pollution** (reject `__proto__`/`constructor`, use `Object.create(null)`/Maps), **path traversal** (resolve and verify prefix, allow-list filenames), **SSRF** (allow-list hosts/schemes, block private ranges and metadata IPs, don't follow redirects blindly), **deserialization** (no untrusted pickle/Java/`eval`), **ReDoS** (avoid nested quantifiers, use timeouts/safe regex engines), **XXE** (disable external entities).

## Review checklist

- [ ] Every entry point has schema validation and size limits
- [ ] No string-built queries/commands; raw query usage reviewed
- [ ] Output encoded for its context; unsafe HTML sinks justified
- [ ] File/URL inputs constrained (path traversal, SSRF)
