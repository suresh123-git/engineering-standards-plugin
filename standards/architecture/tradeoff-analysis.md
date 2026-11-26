---
title: Trade-off Analysis
version: 1.0.0
---

# Trade-off Analysis

Use for `/tradeoffs`, `/architecture`, `/design` and any "which approach?" question.

## Method

1. **Frame the decision**: the problem, constraints (team size/skills, deadline, budget, compliance, existing stack), and non-goals.
2. **Elicit quality attributes** and rank them for *this* decision: correctness, security, performance, scalability, availability, operability, cost, simplicity, time-to-market, testability, evolvability, vendor lock-in.
3. **Generate 2–4 real options**, always including "do nothing / smallest change" and the option the project already uses.
4. **Evaluate each** against the ranked attributes with concrete evidence (benchmarks, docs, team experience), not slogans.
5. **Identify risks and reversibility**: what is the cost of being wrong? Prefer reversible decisions; spend analysis effort on irreversible ones.
6. **Recommend** one option with explicit conditions under which you would choose differently.
7. **Record** the decision (see [ADR template](../../templates/adr.md)).

## Output table

| Criterion (weight) | Option A | Option B | Option C |
|---|---|---|---|
| Fit with existing stack | | | |
| Complexity / ops burden | | | |
| Performance / scale | | | |
| Security | | | |
| Cost | | | |
| Team familiarity | | | |
| Reversibility | | | |

Followed by: pros, cons, risks, effort estimate (S/M/L), recommendation, and "revisit if…" triggers.

## Biases to avoid

Novelty bias, resume-driven design, sunk cost, over-generalisation for imagined scale, ignoring operational cost, comparing a polished option to a sketched one, treating the first idea as the baseline.

## Rules

- State assumptions and unknowns; propose the cheapest experiment/spike that would resolve each.
- Do not present false precision (invented numbers). Use ranges and label estimates as such.
