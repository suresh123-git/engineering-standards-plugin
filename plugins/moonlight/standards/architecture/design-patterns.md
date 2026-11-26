---
title: Design Patterns
version: 1.0.0
---

# Design Patterns

A pattern is a response to a **recurring force**. Recommend one only when you can name the force in this codebase and show the code that hurts. If the language offers a simpler construct (first-class functions, modules, union types), prefer it.

## Selection guide

| Force / problem | Candidate pattern | Notes |
|---|---|---|
| Behaviour varies by type/config, growing conditionals | **Strategy** | Often just a function map or injected function |
| Same algorithm skeleton, varying steps | **Template Method** / higher-order function | Prefer composition |
| Create objects with complex setup or vary by input | **Factory / Abstract Factory / Builder** | Builder for many optional fields |
| Add behaviour without modifying/subclassing | **Decorator** / middleware / interceptor | Logging, caching, retry, auth |
| Incompatible interface from vendor/legacy | **Adapter** / ACL | Isolate at the boundary |
| Simplify a complex subsystem | **Facade** | Keep it thin |
| Notify many dependents of changes | **Observer / Event emitter / Pub-Sub** | Beware hidden coupling and ordering |
| Undoable/queued/auditable operations | **Command** | Pairs with CQRS, job queues |
| Object lifecycle with distinct behaviour per state | **State** / state machine | Prefer explicit transitions table |
| Control access, lazy-load, remote | **Proxy** | |
| Traverse structure uniformly | **Iterator / generators / Visitor** | Visitor only for stable hierarchies |
| Persistence abstraction | **Repository / Unit of Work** | See [DDD](domain-driven-design.md) |
| Shared single resource | **Singleton** — avoid | Use DI-managed single instance instead |
| Share fine-grained immutable objects | **Flyweight** | Rare; measure first |
| Chain of handlers | **Chain of Responsibility** | Middleware pipelines |
| Reliable events with DB writes | **Transactional Outbox** | Distributed systems |
| Long-running distributed workflow | **Saga** | Choreography vs orchestration |
| Resilience to failing dependency | **Circuit Breaker, Retry, Bulkhead, Timeout** | |

## Rules for recommending

1. Name the forces and the evidence (file:line).
2. Show the minimal shape in the project's language and idioms — not textbook class hierarchies.
3. State the cost (indirection, more files, learning curve) and the alternative of doing nothing.
4. Never recommend a pattern "for future flexibility" without a concrete near-term requirement (YAGNI).
5. Check existing code for an established equivalent before introducing a new one.

## Anti-patterns to flag

God object, Singleton with global mutable state, Service Locator, Anemic domain model with all logic in services *where invariants matter*, Golden hammer (same pattern everywhere), Inner-platform effect, Spaghetti inheritance, Lava flow (dead code kept "just in case").
