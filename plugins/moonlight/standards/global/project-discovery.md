---
title: Project Context Discovery
version: 1.0.0
---

# Project Context Discovery

Every command runs this protocol **before** analysing, designing or changing anything. Keep it proportionate: a one-line fix needs a quick scan, a feature or audit needs the full pass. Never ask the user for facts you can read from the repository.

## Precedence of guidance

1. Explicit instructions from the user in the current request.
2. The project's own documentation and conventions (`AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`, ADRs, lint/format config, existing code).
3. The standards in this toolkit.
4. General industry best practice.

Deviate from level 2 only when it causes a concrete problem (security hole, correctness bug, measurable performance issue) and say so explicitly. A stylistic disagreement is not a concrete problem.

## Discovery steps

1. **Language and runtime** — manifests: `package.json`, `tsconfig.json`, `pom.xml`, `build.gradle*`, `go.mod`, `pyproject.toml`, `requirements.txt`, `Cargo.toml`, `*.csproj`, `Gemfile`, `composer.json`. Read engine/version constraints.
2. **Framework** — match signals in the table below.
3. **Package manager** — lockfile: `package-lock.json` (npm), `yarn.lock`, `pnpm-lock.yaml`, `bun.lockb`, `poetry.lock`, `uv.lock`. Use the detected one for every command you suggest or run.
4. **Structure** — list top-level folders; identify source, tests, config, infra, docs. Note monorepo markers (`workspaces`, `nx.json`, `turbo.json`, `lerna.json`) and operate on the relevant package only.
5. **Conventions** — read lint/format config (`.eslintrc*`, `eslint.config.*`, `.prettierrc*`, `.editorconfig`, `ruff.toml`, `checkstyle.xml`) and read 2–3 representative source files near the target code for naming, layering, error handling and import style.
6. **Architecture** — infer from folder layout and dependency direction (layered, modular monolith, hexagonal, feature-sliced, microservices). Describe what exists; do not assume.
7. **Testing** — test runner, location, naming, fixtures, how tests are run (`scripts` in manifest, CI file). Find the narrowest command that runs tests for the area you touch.
8. **Build and CI** — `Dockerfile`, `docker-compose*`, `.github/workflows`, `.gitlab-ci.yml`, `Jenkinsfile`, `buildspec.yml`, IaC folders.
9. **Data stores** — ORM/ODM config, `migrations/` folders, schema files, connection config, `docker-compose` services.
10. **Dependencies** — read direct dependencies; before adding any library check whether an existing one already covers the need.
11. **Existing docs** — README, `docs/`, ADRs, OpenAPI files, changelog.

## Stack signal table

| Signal | Stack skill to load |
|---|---|
| `package.json` with `express` | `stack-express` |
| `@nestjs/*`, `nest-cli.json` | `stack-nestjs` |
| `tsconfig.json` / `typescript` dep | `stack-typescript` |
| Node runtime (`package.json`, `.nvmrc`) | `stack-nodejs` |
| `graphql`, `@apollo/*`, `*.graphql` | `stack-graphql` |
| Multiple deployable services, service-to-service calls | `stack-microservices` |
| `react`, `.tsx`/`.jsx` | `stack-react` |
| `angular.json`, `@angular/*` | `stack-angular` |
| `next` dep, `next.config.*` | `stack-nextjs` |
| Component library, store (`redux`, `ngrx`, `zustand`, `pinia`) | `stack-frontend-architecture` |
| `mongodb`, `mongoose` | `stack-mongodb` |
| `pg`, `postgres`, Prisma/TypeORM with postgres | `stack-postgresql` |
| `mysql`, `mysql2`, MariaDB | `stack-mysql` |
| `redis`, `ioredis`, `bull*` | `stack-redis` |
| `kafkajs`, `confluent-kafka`, Spring Kafka | `stack-kafka` |
| `amqplib`, `rabbitmq` | `stack-rabbitmq` |
| `@aws-sdk/client-sqs`, `sqs` | `stack-sqs` |
| `aws-sdk`, `@aws-sdk/*`, CDK, SAM | `stack-aws` |
| `Dockerfile`, compose files | `stack-docker` |
| `k8s/`, `helm/`, `kustomization.yaml` | `stack-kubernetes` |
| CI config files | `stack-cicd` |
| `*.tf` | `stack-terraform` |
| CloudFormation templates (`AWSTemplateFormatVersion`) | `stack-cloudformation` |

Load only the skills whose signals are present. If nothing matches, apply the language-agnostic standards only. **Never force a framework, pattern or layer onto a project that does not use it.**

## Output: Project Context summary

Start the response with a short block (max ~10 lines):

```
Project context
- Stack: <language/framework/versions>
- Package manager / build: <...>
- Architecture: <as observed>
- Conventions: <lint/format/naming in force>
- Tests: <runner + command>
- Data / infra: <...>
- Stack skills applied: <...>
- Unknowns: <anything you could not determine>
```

## Ask only when genuinely ambiguous

Ask for clarification when the answer changes the design materially and cannot be inferred (conflicting requirements, missing acceptance criteria, destructive scope). Otherwise state your assumption and proceed.
