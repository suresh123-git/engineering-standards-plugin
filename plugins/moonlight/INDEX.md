# Engineering Standards — Index (v1.0.0)

## Commands

### development

| Command | Mode | Purpose |
|---|---|---|
| `/cleanup` | modifying | Find and remove dead code, unused dependencies and unnecessary complexity safely, with proof of non-use and approval for deletions. |
| `/debug` | modifying | Investigate a bug or failure methodically, find the root cause with evidence, and fix it with a regression test. |
| `/explain` | read-only | Explain code, dependencies and execution flows accurately at the reader's level, with traceable references to the source. |
| `/implement` | modifying | Implement a production-ready feature or change following project conventions with a plan, minimal diff, tests and validation. |
| `/modernize` | modifying | Update outdated language, framework and library usage to current supported patterns incrementally, preserving behaviour and compatibility. |
| `/optimize` | modifying | Improve performance and resource utilisation of code paths based on measurement, with before/after evidence and no behaviour change. |
| `/refactor` | modifying | Refactor code to improve structure and readability while strictly preserving observable behaviour, protected by tests. |
| `/review` | read-only | Perform a comprehensive, stack-aware code review that produces severity-ranked findings with file/line references and fixes. |

### architecture

| Command | Mode | Purpose |
|---|---|---|
| `/architecture` | read-only | Evaluate the current system architecture, identify structural problems and recommend an incremental, evidence-based target architecture. |
| `/ddd` | read-only | Apply domain-driven design — model bounded contexts, ubiquitous language, aggregates and events — where the domain complexity warrants it. |
| `/design` | read-only | Design a feature or module before implementation, producing a concrete, convention-aligned technical design with options and risks. |
| `/patterns` | read-only | Recommend appropriate design patterns for a concrete problem or code smell, or flag misused patterns, with minimal idiomatic sketches. |
| `/scalability` | read-only | Identify scalability limits and single points of failure in a system or feature, with load-based evidence and ordered mitigations. |
| `/solid` | read-only | Evaluate SOLID compliance of code and report only violations that cause real design pain, with the smallest effective refactor. |
| `/tradeoffs` | read-only | Compare technical approaches with explicit criteria, pros and cons, risks and a conditional recommendation. |

### quality

| Command | Mode | Purpose |
|---|---|---|
| `/accessibility` | read-only | Review UI code and pages for WCAG 2.2 AA accessibility issues, mapped to success criteria with concrete fixes. |
| `/production-check` | read-only | Assess production readiness across 15 areas — security, reliability, data, observability, deployment and rollback — and return a severity-ranked go/no-go report. |
| `/quality` | read-only | Evaluate overall code quality across maintainability, design, tests, tooling and risk hot-spots, with a scored, prioritised improvement plan. |

### security

| Command | Mode | Purpose |
|---|---|---|
| `/dependencies` | read-only | Audit dependency risks — vulnerabilities, abandonment, licences, bloat and update strategy — with reachability-based triage and an upgrade plan. |
| `/security` | read-only | Perform a security assessment of code and configuration against OWASP Top 10 and secure-coding standards, with exploit-aware, evidence-backed findings. |

### testing

| Command | Mode | Purpose |
|---|---|---|
| `/coverage` | read-only | Identify missing test scenarios by risk and assertion quality, not by percentage, and propose concrete tests to close the gaps. |
| `/test` | modifying | Generate meaningful unit and integration tests that follow the project's test framework, style and isolation rules, and run them. |

### api

| Command | Mode | Purpose |
|---|---|---|
| `/api-design` | read-only | Design REST or GraphQL APIs — resources, contracts, errors, pagination, versioning, security and an OpenAPI/SDL draft — consistent with existing conventions. |
| `/api-review` | read-only | Review an existing API for consistency, standards compliance, security, compatibility and documentation accuracy, with ranked findings. |
| `/error-handling` | read-only | Review error-handling strategy end to end — error taxonomy, propagation, translation, retries, logging and client-facing errors. |
| `/integration` | read-only | Design a robust integration with an external system — boundaries, adapters, resilience, security, idempotency and testing — before implementing it. |

### database

| Command | Mode | Purpose |
|---|---|---|
| `/db-design` | read-only | Design database schemas (relational or document) from domain and access patterns, with constraints, indexes, migration plan and trade-offs. |
| `/db-optimize` | modifying | Optimise slow queries and indexes using execution plans, with verified before/after evidence and safe, online index changes. |
| `/db-review` | read-only | Review schemas, relationships, constraints and queries for correctness, integrity and efficiency, with evidence from the code and query plans. |
| `/migration` | modifying | Review and create safe, backward-compatible database migrations with lock analysis, backfill strategy, rollback and deploy ordering. |

### devops

| Command | Mode | Purpose |
|---|---|---|
| `/aws-review` | read-only | Review AWS infrastructure (IaC, configs, IAM, networking, data stores) against the Well-Architected pillars with prioritised, actionable findings. |
| `/cicd` | read-only | Review CI/CD pipelines for correctness, speed, security of the pipeline itself, quality gates, deployment safety and rollback. |
| `/docker` | read-only | Review Dockerfiles, compose files and image build practices for security, size, build speed and runtime correctness. |
| `/incident` | read-only | Analyse a production incident from logs, metrics and code to establish timeline, root cause, contributing factors and preventive actions. |
| `/logging` | modifying | Establish or improve structured logging — format, levels, correlation, redaction and what to log — consistent with the project's logger. |
| `/monitoring` | read-only | Review observability — metrics, tracing, health checks, SLOs, alerts and runbooks — and recommend gaps to close for reliable operation. |

### git

| Command | Mode | Purpose |
|---|---|---|
| `/commit` | read-only | Generate a Conventional Commits message from the staged (or working) changes, matching the project's commit style. |
| `/pr` | read-only | Generate a complete pull request title and description from the branch diff using the project's PR template. |
| `/pr-review` | read-only | Review a pull request's changes in context — correctness, security, tests, compatibility — and produce blocking and non-blocking review comments with a verdict. |

### documentation

| Command | Mode | Purpose |
|---|---|---|
| `/changelog` | modifying | Generate or update a Keep-a-Changelog formatted CHANGELOG from git history and merged PRs, with SemVer bump recommendation. |
| `/docs` | modifying | Generate accurate technical documentation (architecture, module, API, how-to, runbook, ADR) verified against the code. |
| `/readme` | modifying | Generate or update a README with verified setup, usage, configuration and contribution information drawn from the actual project. |

## Skills

| Skill | Use when |
|---|---|
| `clean-architecture` | Use when structuring or assessing application layers, dependency direction, ports/adapters and module boundaries — adapting to the project's existing architecture instead of imposing one. |
| `clean-code` | Use when writing, reviewing or refactoring code for readability and maintainability — naming, function size, duplication, abstraction and smells — while respecting existing project conventions. |
| `code-review` | Use when reviewing code, diffs or pull requests — a structured, low-false-positive method producing severity-ranked findings with evidence, impact and fixes. |
| `design-patterns` | Use when a recurring design problem (growing conditionals, vendor variance, cross-cutting behaviour, state, reliability) may call for a pattern — recommends one only with evidence, or none. |
| `domain-driven-design` | Use when modelling complex business domains — ubiquitous language, bounded contexts, aggregates, domain events and context integration — and when judging whether DDD is warranted at all. |
| `performance-engineering` | Use when diagnosing or preventing slow code, queries, APIs or UIs and when assessing scalability — measurement-first analysis of database, caching, concurrency, memory and rendering. |
| `secure-coding` | Use whenever code handles input, authentication, authorization, data access, secrets, files, outbound requests or dependencies — applies OWASP-aligned secure coding and review practices. |
| `solid-principles` | Use when designing or reviewing class/module structure to judge SRP, OCP, LSP, ISP and DIP pragmatically, recommending the smallest refactor that removes real design pain. |
| `stack-angular` | Use in Angular projects (angular.json, @angular/*) to review and build components, services, RxJS, dependency injection, routing and lazy loading, state management, forms, change detection and accessibility. |
| `stack-aws` | Use in projects deploying to or calling AWS (SDK, CDK/SAM, Lambda, ECS/EKS, RDS, S3, IAM) to review architecture and code against Well-Architected security, reliability, performance, cost and operations practices. |
| `stack-cicd` | Use when a project has CI/CD pipeline definitions (GitHub Actions, GitLab CI, Jenkins, CircleCI, Azure Pipelines, CodeBuild) to review correctness, speed, pipeline security, quality gates and deployment safety. |
| `stack-cloudformation` | Use in projects with AWS CloudFormation, SAM or CDK-synthesised templates to review parameters, resource policies, deletion/update behaviour, change sets, drift, nested stacks and security. |
| `stack-docker` | Use when a project has Dockerfiles or docker-compose files to apply image build, security, caching, runtime and local-development best practices. |
| `stack-express` | Use in Express.js projects (express dependency, app.use/router patterns) for middleware order, async error handling, validation, security hardening, structure and Supertest testing. |
| `stack-frontend-architecture` | Use in frontend codebases to evaluate and design component architecture, state management, data flow, folder structure, design-system use and frontend performance/accessibility budgets across React, Angular and Next.js. |
| `stack-graphql` | Use in GraphQL projects (graphql, Apollo, GraphQL Yoga, NestJS GraphQL, .graphql files) for schema design, resolver performance (N+1), authorization, query-cost protection and error handling. |
| `stack-kafka` | Use in projects using Apache Kafka (kafkajs, confluent clients, Spring Kafka, MSK) to review producers, consumers, partitioning and ordering, delivery semantics, schemas, retries/DLQ and operations. |
| `stack-kubernetes` | Use when a project has Kubernetes manifests, Helm charts or Kustomize overlays to review workload configuration, security context, resources, probes, networking, RBAC, rollout safety and GitOps practices. |
| `stack-microservices` | Use when a system has multiple independently deployed services — to review service boundaries, communication, data ownership, consistency, resilience and observability, or to judge whether splitting is warranted. |
| `stack-mongodb` | Use in projects using MongoDB or Mongoose to review and design schemas, indexes, aggregation pipelines, transactions, query performance, validation and injection safety. |
| `stack-mysql` | Use in projects using MySQL or MariaDB (mysql2, ORMs with mysql provider) to review schemas, InnoDB indexing, query plans, transactions/locking, online DDL and connection handling. |
| `stack-nestjs` | Use in NestJS projects (@nestjs/*, nest-cli.json) to review and build modules, providers, dependency injection, guards, interceptors, pipes, DTO validation, exception filters and tests the Nest way. |
| `stack-nextjs` | Use in Next.js projects (next dependency, next.config.*, app/ or pages/) for routing model, server vs client components, data fetching and caching, route handlers, security, performance and testing. |
| `stack-nodejs` | Use in Node.js projects (package.json, .nvmrc, server-side JS/TS) for runtime-specific review, implementation and testing guidance — event loop, async, streams, process lifecycle and config. |
| `stack-postgresql` | Use in projects using PostgreSQL (pg, Prisma/TypeORM/Sequelize/Knex with postgres) to review schemas, indexes, query plans, transactions, locking, migrations and connection management. |
| `stack-rabbitmq` | Use in projects using RabbitMQ (amqplib, amqp-connection-manager, Spring AMQP, NestJS RMQ) to review exchanges/queues topology, acknowledgements, prefetch, retries/DLX, durability and connection resilience. |
| `stack-react` | Use in React projects (react dependency, .jsx/.tsx) for review and implementation of components, hooks, effects, state, rendering performance, accessibility and Testing Library tests. |
| `stack-redis` | Use in projects using Redis (ioredis, redis, BullMQ, cache/session/rate-limit usage) to review key design, TTLs and eviction, caching correctness, data structures, atomicity, persistence, security and failure modes. |
| `stack-sqs` | Use in projects using Amazon SQS (and SNS fan-out) to review queue configuration, visibility timeouts, redrive/DLQ, standard vs FIFO semantics, idempotent consumers, batching, IAM and monitoring. |
| `stack-terraform` | Use in projects with Terraform/OpenTofu (*.tf, .terraform.lock.hcl) to review module structure, state management, provider/version pinning, IAM and network security, safe changes, drift and plan review. |
| `stack-typescript` | Use in TypeScript projects (tsconfig.json, .ts/.tsx) for type-safety review, strictness, typing patterns, module config and compiler-aware implementation and testing. |
| `testing-strategy` | Use when planning, writing, reviewing or debugging tests — choosing test layers, isolation and mocking, deriving edge cases, and judging coverage by risk instead of percentage. |

## Standards

See the folders under `standards/`: `global`, `coding`, `architecture`, `api`, `database`, `security`, `testing`, `git`, `documentation`, `devops`, `frontend`.

Checklists: `checklists/`. Templates: `templates/`. Rules: `rules/`.
