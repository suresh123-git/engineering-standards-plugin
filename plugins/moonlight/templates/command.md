---
name: example-command
description: One sentence stating what the command does and when to use it.
category: development
version: 1.0.0
mode: read-only
argument-hint: "[what the user can pass]"
standards:
  - global/project-discovery
  - global/safety-rules
skills:
  - code-review
---

# /example-command

## Purpose

What problem this command solves, in 2–4 sentences. State explicitly what it does **not** do.

## Expected Input

Accepted arguments (file, directory, PR, feature description, error text, none). What to do when the input is missing or ambiguous (infer from the open file/selection/diff, or ask one targeted question).

## Project Context Discovery

Follow [project discovery](../../standards/global/project-discovery.md). Command-specific discovery: which extra files or tools to inspect before acting.

## Applicable Standards

- [Standard name](../../standards/<area>/<file>.md) — why it applies here.
- Skills to load: `skill-name` (and matching `stack-*` skills detected during discovery).

## Execution Steps

1. Numbered, concrete, ordered steps that are specific to this command.
2. Include decision points ("if X, then Y").
3. Include verification steps.

## Output Format

Exact structure of the response (headings, tables, finding format).

## Safety Constraints

Command-specific limits in addition to [safety rules](../../standards/global/safety-rules.md).

## Examples

```
/example-command src/orders/
/example-command "explain what to check"
```
