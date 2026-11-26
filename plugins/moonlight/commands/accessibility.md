---
description: "Review UI code and pages for WCAG 2.2 AA accessibility issues, mapped to success criteria with concrete fixes."
argument-hint: "<component | page | directory | URL of a running app>"
allowed-tools: "Read, Grep, Glob, Bash(git diff:*), Bash(git log:*), Bash(git status:*), Bash(git show:*), Bash(git blame:*)"
---
# /accessibility

> **Mode: read-only.** Do not create, modify or delete files unless the user explicitly asks you to apply the changes. Running side-effect-free inspection commands (git log/diff, tests, linters) is fine.
>
> **User input:** $ARGUMENTS


## Purpose

Find accessibility barriers in web UI code (React, Angular, Next.js, plain HTML/CSS) and recommend fixes that meet **WCAG 2.2 AA**. Combines static review of markup/ARIA/focus/forms with guidance for automated and manual verification.

## Expected Input

Component(s), template(s), a route/page, or a directory. If a local dev server URL is provided and a browser tool is available, also inspect the rendered DOM and accessibility tree.

## Project Context Discovery

Run [project discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md). Additionally:

- Identify the UI framework/library (Material, Bootstrap, Radix, Headless UI, PrimeNG) — many components bring built-in a11y that must not be defeated.
- Look for existing a11y tooling: `eslint-plugin-jsx-a11y`, `angular-eslint` template rules, `jest-axe`, `@axe-core/playwright`, Storybook a11y addon, Lighthouse CI.
- Load `stack-react`, `stack-angular` or `stack-nextjs` **Accessibility notes** if present.

## Applicable Standards

- [Accessibility (WCAG)](${CLAUDE_PLUGIN_ROOT}/standards/frontend/accessibility.md) — POUR checklist and component patterns
- [Findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md)

## Execution Steps

1. Enumerate the UI surface in scope: pages, components, forms, modals/menus/tabs, media, tables.
2. **Static review** per element type:
   - Semantics: native elements first, heading order, landmarks, lists, tables with `th`/scope.
   - Names/roles/states: accessible names for buttons/links/inputs/icons; correct ARIA (flag redundant or invalid ARIA); `aria-live` for dynamic updates.
   - Keyboard: reachable, logical tab order, no traps, focus management in dialogs and route changes, visible focus style, `Esc` handling.
   - Forms: labels, `autocomplete`, error association (`aria-describedby`), required indicators, validation messaging.
   - Visual: contrast (compute from design tokens when possible), colour-only cues, text resize/reflow, `prefers-reduced-motion`, target size.
   - Media: alt text, captions, autoplay controls.
3. If a running app and browser tools are available, run axe-style checks and inspect the accessibility tree; otherwise provide the exact commands/tests to run.
4. Map each finding to the **WCAG success criterion** and assign severity by user impact (Critical = blocks a task for a group of users).
5. Provide fixes as minimal code changes in the project's framework idioms.
6. Recommend preventive tooling (lint rules, axe in CI, component-level tests).

## Output Format

Shared findings format, with extra field **WCAG criterion** (e.g., `1.4.3`, `2.4.7`, `4.1.2`) and **Who is affected**. Summary table by criterion. Include a "needs manual verification" list (screen reader, zoom, contrast in context).

## Safety Constraints

- Read-only unless asked to fix. Do not alter visual design/branding while fixing a11y without noting it.
- Automated checks cover only part of WCAG; never claim full compliance.
- Do not suggest ARIA where native HTML solves it.

## Examples

```
/accessibility src/components/Modal.tsx
/accessibility src/app/checkout
/accessibility http://localhost:4200/login
```

## Shared Requirements

- Run [project context discovery](${CLAUDE_PLUGIN_ROOT}/standards/global/project-discovery.md) first and load the matching `stack-*` skills.
- Follow the [safety rules](${CLAUDE_PLUGIN_ROOT}/standards/global/safety-rules.md); audit-style output uses the [findings format](${CLAUDE_PLUGIN_ROOT}/standards/global/review-findings.md).
- Project conventions override generic advice unless they cause a concrete problem; never force a framework or architecture the project does not use.
