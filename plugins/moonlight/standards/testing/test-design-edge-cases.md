---
title: Test Design and Edge Cases
version: 1.0.0
---

# Test Design and Edge Cases

## Deriving test cases

1. List behaviours from requirements, types, branches, error paths and public contract — not from the code's line count.
2. For each input dimension apply **equivalence partitioning** and **boundary value analysis**: below / at / above each limit.
3. Add **state-transition** cases for stateful flows (valid and invalid transitions).
4. Add **error and failure injection**: dependency throws, times out, returns malformed data, returns partial results.
5. Add **property-based** tests (fast-check, Hypothesis, jqwik) for pure functions with algebraic laws: round-trips, idempotence, ordering, invariants.

## Edge-case checklist

- **Values**: `null`/`undefined`/missing, empty string/array/object, whitespace-only, zero, negative, max/min int, NaN/Infinity, very large payloads, duplicates, single element.
- **Strings**: Unicode (emoji, combining characters, RTL), very long, leading/trailing spaces, case variants, SQL/HTML/path-traversal payloads.
- **Numbers & money**: float rounding, currency scale, overflow, division by zero.
- **Dates/time**: timezones, DST transitions, leap day/second, month-end, epoch/millis confusion, clock skew, expiry exactly at boundary.
- **Collections**: ordering stability, pagination boundaries (first/last/empty/beyond last page), large sets.
- **Concurrency**: simultaneous updates, double-submit, retries, out-of-order and duplicate events, partial failure between steps.
- **Security**: unauthenticated, wrong tenant, wrong role, expired/tampered token, mass-assigned fields, oversized input.
- **I/O**: network timeout, partial writes, disk full, permission denied, file not found, encoding issues.
- **Idempotency**: repeated request yields the same result; replayed message processed once.
- **Compatibility**: old payload shapes, unknown extra fields, missing optional fields.

## Test data

Use builders/factories with sensible defaults and explicit overrides for what matters in the test. Avoid shared fixtures with hidden coupling; avoid production data; anonymise if sampled.

## Good vs weak tests

Weak: asserts only that "no error was thrown", mirrors implementation, one giant test, depends on execution order, tests getters/setters, mocks everything. Strong: fails when behaviour breaks, readable as documentation, small, isolated.
