---
disable-model-invocation: true
name: "code-review"
description: "Use when reviewing code, diffs or pull requests — a structured, low-false-positive method producing severity-ranked findings with evidence, impact and fixes."
---
# Code Review

## When to apply

Reviewing any change or codebase area; also as the final self-review before presenting your own implementation.

## How to apply

1. **Intent first**: what is this change supposed to do? Read the description/issue/commits. Review against that.
2. **Context**: read callers, callees, tests and config around the change; run [project discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md) and load matching `stack-*` skills for their review focus.
3. **Triage by risk**: auth, money, data/migrations, concurrency, public contracts, config/infra, dependencies — review those first.
4. **Walk the categories**: functional correctness → security → architecture/SOLID → code quality → performance → database efficiency → error handling → logging → testing → maintainability → backward compatibility (see [code review checklist](${CLAUDE_PLUGIN_ROOT}/checklists/code-review.md)).
5. **Verify each suspicion** in the code. Write the concrete failure scenario. If you can't, downgrade to a question or drop it.
6. **Filter false positives**: skip anything the formatter/linter enforces, pure style preference, issues handled elsewhere, and pre-existing problems not touched by the change (mention separately, once).
7. **Report** in the [findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md): severity, `file:line`, problem, why it matters, recommendation, optional corrected snippet. Group by root cause and include what is done well.
8. Give a verdict and the shortest path to approval.

## Checklist

- [ ] Every finding has evidence and impact
- [ ] Severity reflects likelihood × impact, not irritation
- [ ] Blocking vs non-blocking is explicit
- [ ] Tests reviewed as carefully as code
- [ ] Feedback is specific, actionable and respectful

## Common mistakes

Reviewing only the diff without context; nitpicking style; asking for unrelated refactors; vague comments ("this is confusing"); missing the absent code (unhandled error path, missing auth check, missing test); rubber-stamping large PRs.

## Loading stack skills (plugin)

Skills in this plugin are user-invoked only, so read the matching stack skills as files: `${CLAUDE_PLUGIN_ROOT}/skills/stack-<name>/SKILL.md` (e.g. `stack-nestjs`, `stack-postgresql`), and core skills at `${CLAUDE_PLUGIN_ROOT}/skills/<name>/SKILL.md`. Read only those for technologies the project actually uses.
