---
disable-model-invocation: true
description: "Evaluate the current system architecture, identify structural problems and recommend an incremental, evidence-based target architecture."
argument-hint: "<repo | service | module | question>"
allowed-tools: "Read, Grep, Glob, Bash(git diff:*), Bash(git log:*), Bash(git status:*), Bash(git show:*), Bash(git blame:*)"
---
# /architecture

> **Mode: read-only.** Do not create, modify or delete files unless the user explicitly asks you to apply the changes. Running side-effect-free inspection commands (git log/diff, tests, linters) is fine.
>
> **User input:** $ARGUMENTS


## Purpose

Describe the architecture **as it actually is**, assess it against quality attributes and the project's goals, and recommend evolutionary improvements. It recommends; it does not restructure code.

## Expected Input

A repository, service, module or a question ("is this a good fit for microservices?", "why is this hard to change?"). Include business context and pain points if known.

## Project Context Discovery

Run [project discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md) (full pass). Additionally:

- Map **dependency direction**: imports between modules/packages; detect cycles (`madge`, `dependency-cruiser`, `go list`, IDE graphs) when available.
- Identify deployment units, runtime topology (docker-compose, k8s, serverless), data stores and who owns which data, sync vs async communication.
- Locate hotspots: files with high churn (`git log --name-only`), large modules, god classes.
- Read ADRs/docs and compare with the code (documented vs real architecture).

## Applicable Standards

- [Clean architecture](${CLAUDE_PLUGIN_ROOT}/standards/architecture/clean-architecture.md), [hexagonal](${CLAUDE_PLUGIN_ROOT}/standards/architecture/hexagonal-architecture.md), [DDD](${CLAUDE_PLUGIN_ROOT}/standards/architecture/domain-driven-design.md) — as lenses, never as mandates
- [Scalability](${CLAUDE_PLUGIN_ROOT}/standards/architecture/scalability.md), [trade-off analysis](${CLAUDE_PLUGIN_ROOT}/standards/architecture/tradeoff-analysis.md)
- [Findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md)

## Execution Steps

1. **Reconstruct the architecture**: components, boundaries, responsibilities, data flow, integration points, deployment. Produce a Mermaid component diagram.
2. **Name the architectural style(s)** you observe (layered, modular monolith, hexagonal, event-driven, microservices, serverless) and note deviations from the *intended* style.
3. **Assess quality attributes**: modifiability, testability, scalability, reliability, security, operability, performance, cost, team autonomy — each with evidence.
4. **Find structural problems**: cyclic dependencies, leaky layers, shared databases across services, distributed monolith, anaemic/overloaded modules, missing boundaries, duplicated capabilities, inconsistent patterns, unclear ownership.
5. **Prioritise** problems by impact on the stated goals (not by purity).
6. **Recommend** an incremental path (strangler pattern, introduce ports at one boundary, extract module, add anti-corruption layer…) with 2–3 options, trade-offs, effort, risk, and an order of steps that keeps the system shippable.
7. State what **not** to change and why (working, low-risk areas).
8. Propose ADRs for decisions needing a record.

## Output Format

```
## Executive summary
## Current architecture (diagram + description)
## Quality-attribute assessment (table: attribute | rating | evidence)
## Findings (severity-ranked, shared format)
## Recommendations (options, trade-offs, sequencing, effort/risk)
## Not recommended / leave as is
## Open questions
```

## Safety Constraints

- Read-only analysis; no refactors or file moves.
- Do not recommend microservices, CQRS, event sourcing or other heavy styles without a concrete force and evidence of need; prefer the simplest change that removes the problem.
- Base claims on observed code/config; mark inferences.

## Examples

```
/architecture
/architecture services/billing — is the module boundary healthy?
/architecture should we split the monolith? we have 12 engineers and weekly deploys
```

## Shared Requirements

- Run [project context discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md) first and load the matching `stack-*` skills.
- Follow the [safety rules](${CLAUDE_PLUGIN_ROOT}/standards/global/safety-rules.md); audit-style output uses the [findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md).
- Project conventions override generic advice unless they cause a concrete problem; never force a framework or architecture the project does not use.

## Loading stack skills (plugin)

Skills in this plugin are user-invoked only, so read the matching stack skills as files: `${CLAUDE_PLUGIN_ROOT}/skills/stack-<name>/SKILL.md` (e.g. `stack-nestjs`, `stack-postgresql`), and core skills at `${CLAUDE_PLUGIN_ROOT}/skills/<name>/SKILL.md`. Read only those for technologies the project actually uses.
