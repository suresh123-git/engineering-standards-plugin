---
name: stack-typescript
description: Use in TypeScript projects (tsconfig.json, .ts/.tsx) for type-safety review, strictness, typing patterns, module config and compiler-aware implementation and testing.
version: 1.0.0
category: stack
---

# TypeScript

## Detect

`tsconfig.json` (+ `tsconfig.*.json`), `typescript` dependency, `.ts/.tsx` files, `typescript-eslint`, `ts-jest`/`tsx`/`ts-node`/`swc`. Read the actual `compilerOptions` (strict flags, `target`, `module`, paths) before judging.

## Review focus

- **Strictness**: is `strict` on? Flag erosion: `any`, `as` casts through `unknown`, `@ts-ignore`/`@ts-expect-error` without reason, non-null `!` on values that can be absent, `Function`/`Object`/`{}` types.
- **Boundary validation**: types vanish at runtime — external input (HTTP, queue, JSON, env) must be validated (zod/class-validator/io-ts/valibot) and *then* typed; no `JSON.parse(...) as T`.
- **Modelling**: discriminated unions over optional-field bags; `readonly`/immutability for shared data; branded/opaque ids for domain primitives; exhaustive `switch` with `never` check; enums vs union literals per project convention.
- **Generics & utility types**: needless generics; over-clever conditional types hurting readability; prefer simple explicit types at module boundaries.
- **Async**: return types `Promise<T>`; no floating promises (`@typescript-eslint/no-floating-promises`).
- **Public API**: explicit return types on exported functions; exported types stable; avoid leaking implementation types.
- **Config**: `skipLibCheck` hides issues; `esModuleInterop`/`module` mismatches; path aliases that don't resolve at runtime/build.

## Implementation conventions

Follow existing lint/format rules; prefer `unknown` over `any` for untrusted data and narrow with guards; use `satisfies` to check shapes without widening; `as const` for literal tables; keep types next to usage; avoid barrel-file cycles; don't silence the compiler—fix the model.

## Testing conventions

Type tests where types are the product (`expectTypeOf`, `tsd`); ensure test files compile under the project's `tsconfig` (or a test tsconfig); avoid `any` in mocks — use typed factories/`jest.Mocked<T>`/`vi.mocked`.

## Pitfalls

Casting to silence errors; trusting types from the network; enum runtime surprises (`const enum` with isolatedModules); structural typing hiding wrong arguments; huge union types slowing the compiler; declaration merging surprises.
