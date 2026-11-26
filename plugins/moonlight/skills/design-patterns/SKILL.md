---
disable-model-invocation: true
name: "design-patterns"
description: "Use when a recurring design problem (growing conditionals, vendor variance, cross-cutting behaviour, state, reliability) may call for a pattern — recommends one only with evidence, or none."
---
# Design Patterns

## When to apply

You see a recurring force: a conditional that grows with every new variant, repeated setup, behaviour that must wrap many calls (retry, cache, auth), vendor/legacy interface mismatch, lifecycle/state complexity, event fan-out, or resilience needs. Do not apply because a pattern "might be useful later".

## How to apply

1. Name the forces and gather evidence in the code (`file:line`), including expected change frequency.
2. Check what the language/framework already provides (functions as values, union types, middleware, interceptors, DI, RxJS operators) and which patterns the project **already uses** — extend those.
3. Pick from the [selection guide](${CLAUDE_PLUGIN_ROOT}/standards/architecture/design-patterns.md); compare with "do nothing / plain function".
4. Sketch the minimal form in the project's style (often 10–40 lines), including wiring and a test.
5. State costs: indirection, more files, hidden coupling (observers), global state (singletons).
6. Flag misused patterns and anti-patterns when you find them.

## Checklist

- [ ] The force is real and demonstrated in code
- [ ] ≥ 2 variants exist (or a boundary/testing need) before introducing variation patterns
- [ ] Simpler language-level alternative considered
- [ ] Naming follows project vocabulary rather than textbook class names
- [ ] Migration path is incremental and testable

## Common mistakes

Strategy for two stable cases; Singleton for convenience; Factory wrapping a plain constructor; Observer without lifecycle/unsubscribe handling; inheritance-based Template Method where composition fits; patterns named in code instead of expressing intent.
