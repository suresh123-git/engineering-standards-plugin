---
description: "Evaluate SOLID compliance of code and report only violations that cause real design pain, with the smallest effective refactor."
argument-hint: "<file | class | module | directory>"
allowed-tools: "Read, Grep, Glob, Bash(git diff:*), Bash(git log:*), Bash(git status:*), Bash(git show:*), Bash(git blame:*)"
---
# /solid

> **Mode: read-only.** Do not create, modify or delete files unless the user explicitly asks you to apply the changes. Running side-effect-free inspection commands (git log/diff, tests, linters) is fine.
>
> **User input:** $ARGUMENTS


## Purpose

Assess how well code follows Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation and Dependency Inversion — **pragmatically**. Only violations with demonstrable cost (hard to test, change amplification, defects) are reported.

## Expected Input

A class, file, module or directory. For large scopes, sample the highest-churn and largest units and say so.

## Project Context Discovery

Run [project discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md). Additionally:

- Determine the language's idioms (functional modules, classes, traits, protocols) — SOLID maps differently in each.
- Identify the DI mechanism in use (framework container, constructor injection, factories) and existing abstraction conventions.
- Check test code: difficulty of testing is the best SOLID signal (many mocks, DB needed for logic tests).

## Applicable Standards

- [SOLID](${CLAUDE_PLUGIN_ROOT}/standards/architecture/solid.md) — test questions, smells, remedies
- [Clean code](${CLAUDE_PLUGIN_ROOT}/standards/coding/clean-code.md) — YAGNI, premature abstraction
- [Findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md)

## Execution Steps

1. Read the target plus its collaborators and tests; list each unit's responsibilities by the actors/reasons that would change it.
2. Evaluate each principle with its test question and gather evidence (`file:line`):
   - **SRP**: count reasons to change; look at constructor dependency count, mixed concerns (I/O + rules + formatting), method name clusters.
   - **OCP**: repeated type/enum switches, edits needed in many places to add a variant.
   - **LSP**: overrides that throw, ignore, or narrow behaviour; `instanceof` checks on abstractions; weakened postconditions.
   - **ISP**: fat interfaces, no-op implementations, clients using a fraction of the API.
   - **DIP**: domain/application code importing infrastructure (ORM, HTTP clients, SDKs), `new` of collaborators inside logic, static singletons.
3. For each issue, ask: *Does this hurt now?* (changes, bugs, testing). If not, drop it or mark Informational.
4. Propose the **smallest** remedy (extract collaborator, introduce port at one boundary, replace conditional with strategy/map, split interface) with a short before/after sketch in the project's idioms.
5. Do not recommend interfaces/layers for their own sake, or heavy patterns in simple code; respect existing architecture.
6. Provide a per-principle scorecard and priority order.

## Output Format

- **Scorecard** table: principle | status (OK / Minor / Problem) | key evidence
- **Findings** in the shared format (category: SOLID), ordered by value
- **Suggested refactor sequence** (small steps) and what to leave alone
- Offer `/refactor` to execute selected items

## Safety Constraints

- Read-only. Report, don't restructure.
- No false positives: skip violations in glue code, scripts, DTOs/data holders and framework-mandated shapes.
- Never recommend abstraction layers that the project's size/lifespan doesn't justify.

## Examples

```
/solid src/orders/order.service.ts
/solid src/payments
/solid UserManager — why is this hard to test?
```

## Shared Requirements

- Run [project context discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md) first and load the matching `stack-*` skills.
- Follow the [safety rules](${CLAUDE_PLUGIN_ROOT}/standards/global/safety-rules.md); audit-style output uses the [findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md).
- Project conventions override generic advice unless they cause a concrete problem; never force a framework or architecture the project does not use.
