---
description: "Compare technical approaches with explicit criteria, pros and cons, risks and a conditional recommendation."
argument-hint: "<decision to make, with the options if known>"
allowed-tools: "Read, Grep, Glob, Bash(git diff:*), Bash(git log:*), Bash(git status:*), Bash(git show:*), Bash(git blame:*)"
---
# /tradeoffs

> **Mode: read-only.** Do not create, modify or delete files unless the user explicitly asks you to apply the changes. Running side-effect-free inspection commands (git log/diff, tests, linters) is fine.
>
> **User input:** $ARGUMENTS


## Purpose

Help choose between technical approaches (libraries, architectures, data stores, protocols, build-vs-buy, refactor-vs-rewrite) with a transparent, evidence-based comparison rather than opinion. Ends with a recommendation **and the conditions that would change it**.

## Expected Input

The decision and, if known, the candidate options and constraints (team, deadline, scale, budget, compliance). If options aren't given, generate realistic ones, including the status quo.

## Project Context Discovery

Run [project discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md). Additionally:

- Identify existing technologies already in the project/organisation that could solve the problem (reuse beats novelty).
- Check version/compatibility constraints, licences and maintenance health of candidate libraries from manifests and official sources.
- Gauge team conventions and prior decisions (ADRs).

## Applicable Standards

- [Trade-off analysis](${CLAUDE_PLUGIN_ROOT}/standards/architecture/tradeoff-analysis.md) — method and output table
- Domain standards relevant to the decision (e.g. [scalability](${CLAUDE_PLUGIN_ROOT}/standards/architecture/scalability.md), [schema design](${CLAUDE_PLUGIN_ROOT}/standards/database/schema-design.md), [REST design](${CLAUDE_PLUGIN_ROOT}/standards/api/rest-design.md))

## Execution Steps

1. **Frame**: decision statement, context, constraints, non-goals, reversibility.
2. **Select criteria** and weights that matter *for this decision* (don't use a generic list blindly).
3. **Define 2–4 options** (include the minimal/status-quo option) described neutrally in 2–3 lines each.
4. **Gather evidence**: official docs, benchmarks relevant to the workload, project constraints. Note where evidence is thin; propose a cheap spike to resolve it. Verify facts about current library capabilities from authoritative sources instead of memory when they affect the outcome.
5. **Evaluate** each option per criterion; list pros, cons, risks, effort (S/M/L), lock-in, and operational burden.
6. **Sensitivity**: which assumptions, if wrong, flip the recommendation?
7. **Recommend** with reasoning and "choose differently if…" conditions; propose next steps (spike, ADR, pilot).

## Output Format

```
## Decision & constraints
## Options (short descriptions)
## Comparison table (criteria × options, with weights)
## Pros / cons / risks per option
## Recommendation + "revisit if" triggers
## Next steps (spike / ADR link to template)
```

## Safety Constraints

- Read-only; no code or dependency changes.
- Don't present invented benchmarks or numbers; label estimates; cite sources for factual claims.
- Stay neutral: avoid vendor hype and resume-driven choices.

## Examples

```
/tradeoffs PostgreSQL JSONB vs MongoDB for our product catalog
/tradeoffs REST vs GraphQL for the new mobile app BFF
/tradeoffs Kafka vs SQS for order events — team of 6, AWS only
```

## Shared Requirements

- Run [project context discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md) first and load the matching `stack-*` skills.
- Follow the [safety rules](${CLAUDE_PLUGIN_ROOT}/standards/global/safety-rules.md); audit-style output uses the [findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md).
- Project conventions override generic advice unless they cause a concrete problem; never force a framework or architecture the project does not use.
