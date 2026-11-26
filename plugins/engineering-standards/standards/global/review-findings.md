---
title: Findings, Severity and Report Format
version: 1.0.0
---

# Findings, Severity and Report Format

Shared by `/review`, `/pr-review`, `/security`, `/quality`, `/db-review`, `/api-review`, `/production-check` and other audit commands.

## Severity scale

| Severity | Definition | Examples |
|---|---|---|
| **Critical** | Exploitable now, data loss/corruption, or outage-level defect. Must fix before merge/release. | Auth bypass, SQL injection, secret in repo, destructive migration without rollback |
| **High** | Likely bug or serious weakness under realistic conditions. Fix before release. | Race condition on shared state, missing authorization on a route, N+1 on a hot path, unhandled promise rejection |
| **Medium** | Real defect or maintainability risk with limited blast radius. Fix soon. | Swallowed errors, missing index on a frequent filter, missing input validation on internal endpoint |
| **Low** | Minor issue; improves robustness or clarity. | Misleading name, redundant code, weak test assertion |
| **Informational** | Observation, praise or optional suggestion. Not a defect. | Alternative approach, future consideration |

Style preferences that the project's formatter/linter does not enforce are **not findings**. At most mention them as Informational, once, grouped.

## Finding format

```
### [SEVERITY] <short title>
- Location: path/to/file.ext:LINE (or LINE-RANGE)
- Category: <correctness | security | architecture | SOLID | code quality | performance | database | error handling | logging | testing | maintainability | compatibility>
- Problem: <what is wrong, with evidence>
- Why it matters: <concrete impact / scenario>
- Recommendation: <specific fix>
- Example: <short corrected snippet, only when it clarifies>
```

Rules:

1. Cite file and line for every finding where the code is available.
2. Explain impact in terms of a concrete failure scenario, not a principle name.
3. One finding per root cause; do not repeat the same issue per occurrence — list locations.
4. Order by severity, then by likelihood.
5. Confidence: if you are not certain, say what would confirm it and downgrade accordingly. Do not pad the report.
6. Include positives briefly (what is done well) so the author knows what to keep.

## Report skeleton

```
## Summary
<2–4 sentences: scope reviewed, overall verdict, counts per severity>

## Project context
<from project discovery>

## Findings
<grouped by severity, highest first>

## Coverage
<what was reviewed, what was not, and why>

## Recommended next steps
<ordered, actionable>
```

Verdicts for gated reviews: **Approve**, **Approve with comments**, **Request changes** (any Critical/High), **Block** (Critical security or data-loss risk).
