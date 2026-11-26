# Engineering Standards

An IDE-independent, open-source toolkit of **slash commands, skills, rules, standards, checklists and templates** that make AI coding assistants review, design, write and ship code the way a disciplined senior engineer would.

Author the instructions **once**; generate native files for **Claude Code, Cursor, GitHub Copilot, Windsurf and OpenAI Codex**.

- 42 specialized commands (`/review`, `/implement`, `/design`, `/security`, `/production-check`, …)
- 9 core skills + 23 stack-aware skills (NestJS, Angular, React, Next.js, Node.js, PostgreSQL, Kafka, AWS, Kubernetes, Terraform, …)
- 9 rules (always-on, file-scoped and model-selected)
- 41 shared standards, 5 checklists, 7 templates
- Zero runtime dependencies — Node.js ≥ 18 scripts only. No agents, no backend, no API, no LLM calls.

## Why

AI assistants are only as good as the instructions they follow. Teams end up with prompt snippets scattered across IDE-specific folders that drift apart. This repo keeps **one canonical source** and an **adapter per IDE**, so a fix to `/review` lands everywhere.

Principles: stack-aware (never force a framework the project doesn't use), project conventions win over generic advice, review commands are read-only, destructive actions need approval, and findings are structured and evidence-based to avoid false positives.

## Install as a Claude Code plugin

This repo is also a Claude Code plugin marketplace:

```text
/plugin marketplace add suresh123-git/engineering-standards-plugin
/plugin install engineering-standards@engineering-standards
```

Commands are namespaced by the plugin, e.g. `/engineering-standards:review`, `/engineering-standards:production-check`. The always-on rules ship as the `engineering-rules` skill (Claude Code does not load a `CLAUDE.md` from plugins). The plugin is generated into `plugins/engineering-standards/` by `npm run build:plugin` and checked for freshness by `npm run validate`. The same plugin format can be used in claude.ai/Cowork, which load a different component set — see Anthropic's [component support table](https://claude.com/docs/plugins/platform-support#compare-component-support-by-app). Cost: roughly 3.5k tokens of skill descriptions are added to every session.

## Quick start

```bash
git clone <this-repo> engineering-standards
cd engineering-standards

# Install into a project (choose any combination, or "all")
node scripts/install.mjs --ide claude-code,cursor --target /path/to/your/project

# Preview first
node scripts/install.mjs --ide all --target /path/to/your/project --dry-run

# Check the installation, later remove it
node scripts/verify-install.mjs --target /path/to/your/project
node scripts/install.mjs --uninstall --target /path/to/your/project
```

The installer:

- writes IDE-native files (see the table below) plus a shared `.engineering-standards/` folder with the standards, checklists, templates and rules the commands link to;
- **merges** into existing `CLAUDE.md`, `AGENTS.md` and `.github/copilot-instructions.md` using a managed block (`<!-- engineering-standards:start/end -->`) — your own content is never touched;
- never overwrites a file it did not create unless you pass `--force`;
- records hashes in `.engineering-standards/.install.json` so upgrades and uninstalls only touch unmodified toolkit files.

## IDE support

| IDE | Commands become | Skills | Rules / instructions | Details |
|---|---|---|---|---|
| Claude Code | `.claude/commands/<name>.md` → `/name` | `.claude/skills/` | `CLAUDE.md` managed block | [adapter](adapters/claude-code/README.md) |
| Cursor | `.cursor/commands/<name>.md` → `/name` | `.cursor/skills/` | `.cursor/rules/*.mdc` | [adapter](adapters/cursor/README.md) |
| GitHub Copilot | `.github/prompts/<name>.prompt.md` → `/name` | `.github/skills/` | `.github/instructions/*.instructions.md` + `copilot-instructions.md` block | [adapter](adapters/copilot/README.md) |
| Windsurf | `.windsurf/workflows/<name>.md` → `/name` | `.windsurf/skills/` | `.windsurf/rules/*.md` | [adapter](adapters/windsurf/README.md) |
| OpenAI Codex | skills in `.agents/skills/<name>/` → `$name` | `.agents/skills/` | `AGENTS.md` managed block | [adapter](adapters/codex/README.md) |

Each adapter README lists the native format used, the documentation it follows, and its known limitations. Honest caveat: the generated files follow the documented formats but have **not been exercised inside the real IDEs** by the author of this release — please report mismatches.

## Commands

All commands are specialized (not copies of one template). Each defines purpose, expected input, project-context discovery, applicable standards, execution steps, output format, safety constraints and examples. *Read-only* commands never modify files unless you explicitly ask.

<!-- commands:start -->
#### Development

| Command | Mode | What it does |
|---|---|---|
| `/cleanup` | modifying | Find and remove dead code, unused dependencies and unnecessary complexity safely, with proof of non-use and approval for deletions. |
| `/debug` | modifying | Investigate a bug or failure methodically, find the root cause with evidence, and fix it with a regression test. |
| `/explain` | read-only | Explain code, dependencies and execution flows accurately at the reader's level, with traceable references to the source. |
| `/implement` | modifying | Implement a production-ready feature or change following project conventions with a plan, minimal diff, tests and validation. |
| `/modernize` | modifying | Update outdated language, framework and library usage to current supported patterns incrementally, preserving behaviour and compatibility. |
| `/optimize` | modifying | Improve performance and resource utilisation of code paths based on measurement, with before/after evidence and no behaviour change. |
| `/refactor` | modifying | Refactor code to improve structure and readability while strictly preserving observable behaviour, protected by tests. |
| `/review` | read-only | Perform a comprehensive, stack-aware code review that produces severity-ranked findings with file/line references and fixes. |

#### Architecture

| Command | Mode | What it does |
|---|---|---|
| `/architecture` | read-only | Evaluate the current system architecture, identify structural problems and recommend an incremental, evidence-based target architecture. |
| `/ddd` | read-only | Apply domain-driven design — model bounded contexts, ubiquitous language, aggregates and events — where the domain complexity warrants it. |
| `/design` | read-only | Design a feature or module before implementation, producing a concrete, convention-aligned technical design with options and risks. |
| `/patterns` | read-only | Recommend appropriate design patterns for a concrete problem or code smell, or flag misused patterns, with minimal idiomatic sketches. |
| `/scalability` | read-only | Identify scalability limits and single points of failure in a system or feature, with load-based evidence and ordered mitigations. |
| `/solid` | read-only | Evaluate SOLID compliance of code and report only violations that cause real design pain, with the smallest effective refactor. |
| `/tradeoffs` | read-only | Compare technical approaches with explicit criteria, pros and cons, risks and a conditional recommendation. |

#### Quality

| Command | Mode | What it does |
|---|---|---|
| `/accessibility` | read-only | Review UI code and pages for WCAG 2.2 AA accessibility issues, mapped to success criteria with concrete fixes. |
| `/production-check` | read-only | Assess production readiness across 15 areas — security, reliability, data, observability, deployment and rollback — and return a severity-ranked go/no-go report. |
| `/quality` | read-only | Evaluate overall code quality across maintainability, design, tests, tooling and risk hot-spots, with a scored, prioritised improvement plan. |

#### Security

| Command | Mode | What it does |
|---|---|---|
| `/dependencies` | read-only | Audit dependency risks — vulnerabilities, abandonment, licences, bloat and update strategy — with reachability-based triage and an upgrade plan. |
| `/security` | read-only | Perform a security assessment of code and configuration against OWASP Top 10 and secure-coding standards, with exploit-aware, evidence-backed findings. |

#### Testing

| Command | Mode | What it does |
|---|---|---|
| `/coverage` | read-only | Identify missing test scenarios by risk and assertion quality, not by percentage, and propose concrete tests to close the gaps. |
| `/test` | modifying | Generate meaningful unit and integration tests that follow the project's test framework, style and isolation rules, and run them. |

#### Api

| Command | Mode | What it does |
|---|---|---|
| `/api-design` | read-only | Design REST or GraphQL APIs — resources, contracts, errors, pagination, versioning, security and an OpenAPI/SDL draft — consistent with existing conventions. |
| `/api-review` | read-only | Review an existing API for consistency, standards compliance, security, compatibility and documentation accuracy, with ranked findings. |
| `/error-handling` | read-only | Review error-handling strategy end to end — error taxonomy, propagation, translation, retries, logging and client-facing errors. |
| `/integration` | read-only | Design a robust integration with an external system — boundaries, adapters, resilience, security, idempotency and testing — before implementing it. |

#### Database

| Command | Mode | What it does |
|---|---|---|
| `/db-design` | read-only | Design database schemas (relational or document) from domain and access patterns, with constraints, indexes, migration plan and trade-offs. |
| `/db-optimize` | modifying | Optimise slow queries and indexes using execution plans, with verified before/after evidence and safe, online index changes. |
| `/db-review` | read-only | Review schemas, relationships, constraints and queries for correctness, integrity and efficiency, with evidence from the code and query plans. |
| `/migration` | modifying | Review and create safe, backward-compatible database migrations with lock analysis, backfill strategy, rollback and deploy ordering. |

#### Devops

| Command | Mode | What it does |
|---|---|---|
| `/aws-review` | read-only | Review AWS infrastructure (IaC, configs, IAM, networking, data stores) against the Well-Architected pillars with prioritised, actionable findings. |
| `/cicd` | read-only | Review CI/CD pipelines for correctness, speed, security of the pipeline itself, quality gates, deployment safety and rollback. |
| `/docker` | read-only | Review Dockerfiles, compose files and image build practices for security, size, build speed and runtime correctness. |
| `/incident` | read-only | Analyse a production incident from logs, metrics and code to establish timeline, root cause, contributing factors and preventive actions. |
| `/logging` | modifying | Establish or improve structured logging — format, levels, correlation, redaction and what to log — consistent with the project's logger. |
| `/monitoring` | read-only | Review observability — metrics, tracing, health checks, SLOs, alerts and runbooks — and recommend gaps to close for reliable operation. |

#### Git

| Command | Mode | What it does |
|---|---|---|
| `/commit` | read-only | Generate a Conventional Commits message from the staged (or working) changes, matching the project's commit style. |
| `/pr` | read-only | Generate a complete pull request title and description from the branch diff using the project's PR template. |
| `/pr-review` | read-only | Review a pull request's changes in context — correctness, security, tests, compatibility — and produce blocking and non-blocking review comments with a verdict. |

#### Documentation

| Command | Mode | What it does |
|---|---|---|
| `/changelog` | modifying | Generate or update a Keep-a-Changelog formatted CHANGELOG from git history and merged PRs, with SemVer bump recommendation. |
| `/docs` | modifying | Generate accurate technical documentation (architecture, module, API, how-to, runbook, ADR) verified against the code. |
| `/readme` | modifying | Generate or update a README with verified setup, usage, configuration and contribution information drawn from the actual project. |

<!-- commands:end -->

## Skills

Skills are loaded by commands (or by the assistant) based on what the project actually uses — detected by [project discovery](standards/global/project-discovery.md).

<!-- skills:start -->
| Skill | Type | Use when |
|---|---|---|
| `clean-architecture` | core | Use when structuring or assessing application layers, dependency direction, ports/adapters and module boundaries — adapting to the project's existing architecture instead of imposing one. |
| `clean-code` | core | Use when writing, reviewing or refactoring code for readability and maintainability — naming, function size, duplication, abstraction and smells — while respecting existing project conventions. |
| `code-review` | core | Use when reviewing code, diffs or pull requests — a structured, low-false-positive method producing severity-ranked findings with evidence, impact and fixes. |
| `design-patterns` | core | Use when a recurring design problem (growing conditionals, vendor variance, cross-cutting behaviour, state, reliability) may call for a pattern — recommends one only with evidence, or none. |
| `domain-driven-design` | core | Use when modelling complex business domains — ubiquitous language, bounded contexts, aggregates, domain events and context integration — and when judging whether DDD is warranted at all. |
| `performance-engineering` | core | Use when diagnosing or preventing slow code, queries, APIs or UIs and when assessing scalability — measurement-first analysis of database, caching, concurrency, memory and rendering. |
| `secure-coding` | core | Use whenever code handles input, authentication, authorization, data access, secrets, files, outbound requests or dependencies — applies OWASP-aligned secure coding and review practices. |
| `solid-principles` | core | Use when designing or reviewing class/module structure to judge SRP, OCP, LSP, ISP and DIP pragmatically, recommending the smallest refactor that removes real design pain. |
| `stack-angular` | stack | Use in Angular projects (angular.json, @angular/*) to review and build components, services, RxJS, dependency injection, routing and lazy loading, state management, forms, change detection and accessibility. |
| `stack-aws` | stack | Use in projects deploying to or calling AWS (SDK, CDK/SAM, Lambda, ECS/EKS, RDS, S3, IAM) to review architecture and code against Well-Architected security, reliability, performance, cost and operations practices. |
| `stack-cicd` | stack | Use when a project has CI/CD pipeline definitions (GitHub Actions, GitLab CI, Jenkins, CircleCI, Azure Pipelines, CodeBuild) to review correctness, speed, pipeline security, quality gates and deployment safety. |
| `stack-cloudformation` | stack | Use in projects with AWS CloudFormation, SAM or CDK-synthesised templates to review parameters, resource policies, deletion/update behaviour, change sets, drift, nested stacks and security. |
| `stack-docker` | stack | Use when a project has Dockerfiles or docker-compose files to apply image build, security, caching, runtime and local-development best practices. |
| `stack-express` | stack | Use in Express.js projects (express dependency, app.use/router patterns) for middleware order, async error handling, validation, security hardening, structure and Supertest testing. |
| `stack-frontend-architecture` | stack | Use in frontend codebases to evaluate and design component architecture, state management, data flow, folder structure, design-system use and frontend performance/accessibility budgets across React, Angular and Next.js. |
| `stack-graphql` | stack | Use in GraphQL projects (graphql, Apollo, GraphQL Yoga, NestJS GraphQL, .graphql files) for schema design, resolver performance (N+1), authorization, query-cost protection and error handling. |
| `stack-kafka` | stack | Use in projects using Apache Kafka (kafkajs, confluent clients, Spring Kafka, MSK) to review producers, consumers, partitioning and ordering, delivery semantics, schemas, retries/DLQ and operations. |
| `stack-kubernetes` | stack | Use when a project has Kubernetes manifests, Helm charts or Kustomize overlays to review workload configuration, security context, resources, probes, networking, RBAC, rollout safety and GitOps practices. |
| `stack-microservices` | stack | Use when a system has multiple independently deployed services — to review service boundaries, communication, data ownership, consistency, resilience and observability, or to judge whether splitting is warranted. |
| `stack-mongodb` | stack | Use in projects using MongoDB or Mongoose to review and design schemas, indexes, aggregation pipelines, transactions, query performance, validation and injection safety. |
| `stack-mysql` | stack | Use in projects using MySQL or MariaDB (mysql2, ORMs with mysql provider) to review schemas, InnoDB indexing, query plans, transactions/locking, online DDL and connection handling. |
| `stack-nestjs` | stack | Use in NestJS projects (@nestjs/*, nest-cli.json) to review and build modules, providers, dependency injection, guards, interceptors, pipes, DTO validation, exception filters and tests the Nest way. |
| `stack-nextjs` | stack | Use in Next.js projects (next dependency, next.config.*, app/ or pages/) for routing model, server vs client components, data fetching and caching, route handlers, security, performance and testing. |
| `stack-nodejs` | stack | Use in Node.js projects (package.json, .nvmrc, server-side JS/TS) for runtime-specific review, implementation and testing guidance — event loop, async, streams, process lifecycle and config. |
| `stack-postgresql` | stack | Use in projects using PostgreSQL (pg, Prisma/TypeORM/Sequelize/Knex with postgres) to review schemas, indexes, query plans, transactions, locking, migrations and connection management. |
| `stack-rabbitmq` | stack | Use in projects using RabbitMQ (amqplib, amqp-connection-manager, Spring AMQP, NestJS RMQ) to review exchanges/queues topology, acknowledgements, prefetch, retries/DLX, durability and connection resilience. |
| `stack-react` | stack | Use in React projects (react dependency, .jsx/.tsx) for review and implementation of components, hooks, effects, state, rendering performance, accessibility and Testing Library tests. |
| `stack-redis` | stack | Use in projects using Redis (ioredis, redis, BullMQ, cache/session/rate-limit usage) to review key design, TTLs and eviction, caching correctness, data structures, atomicity, persistence, security and failure modes. |
| `stack-sqs` | stack | Use in projects using Amazon SQS (and SNS fan-out) to review queue configuration, visibility timeouts, redrive/DLQ, standard vs FIFO semantics, idempotent consumers, batching, IAM and monitoring. |
| `stack-terraform` | stack | Use in projects with Terraform/OpenTofu (*.tf, .terraform.lock.hcl) to review module structure, state management, provider/version pinning, IAM and network security, safe changes, drift and plan review. |
| `stack-typescript` | stack | Use in TypeScript projects (tsconfig.json, .ts/.tsx) for type-safety review, strictness, typing patterns, module config and compiler-aware implementation and testing. |
| `testing-strategy` | core | Use when planning, writing, reviewing or debugging tests — choosing test layers, isolation and mocking, deriving edge cases, and judging coverage by risk instead of percentage. |
<!-- skills:end -->

## Usage examples

```text
/review                      # review uncommitted changes, stack-aware
/review src/orders           # review a directory
/implement add refresh-token rotation to the auth module
/design a notification service with email + push
/security                    # read-only security audit of the repo
/migration add nullable "archived_at" to orders   # expand/contract plan
/production-check            # 15-area readiness report
/pr-review 123               # review a pull request
```

In Codex, invoke commands as skills: `$review`, `$implement`, `$production-check`.

## Architecture

```
commands/ skills/ rules/ standards/ checklists/ templates/     ← canonical, edited by humans
                       │
              scripts/build.mjs  +  adapters/<ide>/adapter.mjs
                       │
                dist/<ide>/…   (generated, git-ignored)
                       │
              scripts/install.mjs  →  your project
```

- Canonical files use relative links; the build rewrites them to `.engineering-standards/…` so they resolve inside any project.
- Adapters are small pure functions: `generate(ctx) → [{ path, content | block }]`.
- See [docs/architecture.md](docs/architecture.md) and [docs/conventions.md](docs/conventions.md).

## Customization

- **Edit a standard** under `standards/` — every command that links it picks it up on the next build.
- **Add a command, skill or rule** from the [templates](templates/) and follow [CONTRIBUTING.md](CONTRIBUTING.md). `npm run validate` enforces structure.
- **Project overrides**: put your conventions in your project's `CLAUDE.md`/`AGENTS.md`/docs. The toolkit's precedence is: explicit user instruction → project conventions → toolkit standards → general best practice.
- **Add an IDE**: create `adapters/<id>/adapter.mjs` exporting `meta` and `generate`, add the id to `IDES` in `scripts/lib.mjs`.

## Validation

```bash
npm run validate   # structure, metadata, links, adapters, generated output limits
npm test           # unit tests for the parser, link rewriter and block merge
npm run build      # generate dist/
npm run build:plugin  # regenerate plugins/engineering-standards/ and the marketplace file
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Roadmap

- Real-IDE verification matrix and fixes from user reports
- Optional per-project config (`.engineering-standards.json`) to enable/disable commands and skills
- More stack skills (Go, Python/Django, Spring, .NET, Flutter)
- Localised standards

## License

MIT — see [LICENSE](LICENSE).
