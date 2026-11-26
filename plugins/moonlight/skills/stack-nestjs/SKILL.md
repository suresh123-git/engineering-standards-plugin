---
disable-model-invocation: true
name: "stack-nestjs"
description: "Use in NestJS projects (@nestjs/*, nest-cli.json) to review and build modules, providers, dependency injection, guards, interceptors, pipes, DTO validation, exception filters and tests the Nest way."
---
# NestJS

## Detect

`@nestjs/core`, `@nestjs/common`, `nest-cli.json`, `*.module.ts`, `*.controller.ts`, `*.service.ts`, decorators (`@Injectable`, `@Controller`). Check Nest major version, platform (Express/Fastify), and whether TypeORM/Prisma/Mongoose/MikroORM is used.

## Review focus

- **Modules**: feature modules own their providers; explicit `exports`; no giant `AppModule`; avoid circular imports (`forwardRef` is a smell); `@Global()` used sparingly; dynamic modules (`forRoot/forRootAsync`) configured via `ConfigModule`.
- **Dependency injection**: constructor injection; scopes (`REQUEST` scope bubbles up and hurts performance—use only when required); custom providers/tokens for ports; no `new Service()` or `ModuleRef.get` service-locator in business code; providers stateless unless intended.
- **Controllers**: thin — route, validate, delegate; correct HTTP codes (`@HttpCode`), versioning, Swagger decorators in sync with DTOs; no business logic or repository access.
- **Guards** (authN/authZ) on every non-public route—prefer a global auth guard with `@Public()` opt-out; role/permission guards plus **object-level checks in services**; `ExecutionContext` handling for HTTP/GraphQL/WS.
- **Pipes & DTOs**: global `ValidationPipe` with `whitelist: true`, `forbidNonWhitelisted`, `transform: true`; `class-validator` rules complete; separate create/update DTOs (`PartialType`, `PickType`); never return entities with sensitive fields (use `ClassSerializerInterceptor`/`@Exclude` or response DTOs); `ParseUUIDPipe` for params.
- **Interceptors**: cross-cutting (logging, timing, caching, response mapping); ensure they don't swallow errors or alter semantics unexpectedly; correct RxJS operators (`map`, `catchError`, `timeout`).
- **Exception filters**: central mapping from domain errors to HTTP; `HttpException` subclasses; no stack traces to clients; consistent error body ([REST design](${CLAUDE_PLUGIN_ROOT}/standards/api/rest-design.md)).
- **Persistence**: transactions via the ORM's unit of work (e.g., TypeORM `DataSource.transaction`/`QueryRunner`, Prisma `$transaction`); repositories injected, not static; no queries in controllers; N+1 on relations.
- **Config & lifecycle**: `ConfigService` with validation schema (Joi/zod); lifecycle hooks (`onModuleInit`, `onApplicationShutdown`, `enableShutdownHooks()`); health via `@nestjs/terminus`.
- **Async/messaging**: microservice transports and queues (`@nestjs/bull(mq)`) with idempotent processors, retries and DLQ.

## Implementation conventions

Mirror the existing module layout (`module/controller/service/dto/entities`); use the CLI's naming; keep domain logic in services or domain classes behind provider tokens; put cross-cutting concerns in guards/interceptors/pipes/filters rather than ad-hoc code; register global providers in `main.ts` or via `APP_*` tokens consistently.

## API conventions

Use `@nestjs/swagger` decorators so OpenAPI matches DTOs; pagination DTOs shared; consistent response/error shape; versioning via `app.enableVersioning` per project choice.

## Testing conventions

Unit: `Test.createTestingModule({ providers: [Service, { provide: Dep, useValue: fake }] })`; override providers/guards with `overrideProvider/overrideGuard`; e2e: `INestApplication` + Supertest with the **same global pipes/filters as production** (apply them in test setup); real DB via Testcontainers for repository tests; test guards and validation explicitly (401/403/400/422 cases).

## Pitfalls

Request-scoped providers everywhere; circular module dependencies; missing global `ValidationPipe` options (mass assignment); returning ORM entities; catching exceptions in services and returning `null`; forgetting `await` in lifecycle hooks; business logic in interceptors.
