---
disable-model-invocation: true
name: "stack-angular"
description: "Use in Angular projects (angular.json, @angular/*) to review and build components, services, RxJS, dependency injection, routing and lazy loading, state management, forms, change detection and accessibility."
---
# Angular

## Detect

`angular.json`, `@angular/core`, `*.component.ts`, `*.service.ts`, `app.routes.ts`/`*-routing.module.ts`. Determine the Angular version and style: **standalone components vs NgModules**, signals adoption, control flow (`@if/@for`) vs `*ngIf/*ngFor`, zone-based vs zoneless, state library (NgRx/NGXS/Akita/signals store).

## Review focus

- **Components**: smart (container) vs dumb (presentational) split; `ChangeDetectionStrategy.OnPush`; typed `@Input/@Output` (or `input()/output()` signals); no logic-heavy templates; avoid function calls and getters in templates (use pipes/computed/signals); `trackBy`/`track` on lists; small components.
- **Services & DI**: `providedIn: 'root'` vs feature-scoped providers deliberately; `inject()` or constructor injection; services stateless or intentionally stateful; no `new Service()`; injection tokens for config/ports; HTTP in services/API clients, not components.
- **RxJS**: no nested subscribes (use `switchMap/mergeMap/concatMap/exhaustMap` correctly); **unsubscribe** (`async` pipe, `takeUntilDestroyed`, `DestroyRef`) to prevent leaks; `shareReplay({bufferSize:1, refCount:true})` for shared streams; error handling with `catchError` inside inner observables; avoid `subscribe` for derived data; `firstValueFrom` for one-shots; correct higher-order operator choice for races/ordering.
- **Routing**: lazy-loaded feature routes (`loadComponent/loadChildren`); functional guards/resolvers (`canActivate`, `canMatch`); route-level data and titles; preloading strategy; avoid route-param subscriptions without cleanup.
- **State management**: right tool for scope — component state/signals → services → NgRx for complex shared state; selectors memoised; actions describe events not setters; effects handle side effects with error handling; avoid duplicating server state in many places.
- **Forms**: typed reactive forms; validators (sync/async) and error messaging; avoid `ngModel` mixing; `updateOn` for heavy validation; accessibility of errors.
- **HTTP**: interceptors for auth/error/loading with correct ordering; retries only for idempotent; cancellation via `switchMap`; typed responses with runtime validation at boundaries when untrusted.
- **Performance**: OnPush/signals, `@defer` blocks, lazy routes, `NgOptimizedImage`, bundle budgets in `angular.json`, avoid large synchronous work in change detection ([frontend performance](${CLAUDE_PLUGIN_ROOT}/standards/frontend/frontend-performance.md)).
- **Security**: Angular sanitises by default — flag `bypassSecurityTrust*`, `innerHTML` bindings with untrusted data, `DomSanitizer` misuse; XSRF config for cookie auth; no tokens in `localStorage` without a risk decision.
- **Accessibility**: Angular CDK a11y utilities (focus trap, live announcer), `angular-eslint` template-accessibility rules, labelled controls, keyboard support in custom components ([accessibility](${CLAUDE_PLUGIN_ROOT}/standards/frontend/accessibility.md)).

## Implementation conventions

Follow the project's module/standalone style and folder structure (feature folders, `shared`, `core`); use the Angular CLI schematics naming; strict mode (`strict: true`, strict templates); keep one responsibility per service.

## Testing conventions

`TestBed` with minimal declarations/imports; component harnesses (`@angular/cdk/testing`); `HttpTestingController` for HTTP; `fakeAsync/tick`/`waitForAsync` or marble testing for RxJS; test OnPush components by updating inputs via `fixture.componentRef.setInput`; Jest/Karma/Vitest as configured; Cypress/Playwright for E2E.

## Pitfalls

Memory leaks from unmanaged subscriptions; nested subscribes; default change detection everywhere; heavy logic in templates; shared mutable singleton services; eager-loading everything; mixing NgModule and standalone conventions inconsistently.
