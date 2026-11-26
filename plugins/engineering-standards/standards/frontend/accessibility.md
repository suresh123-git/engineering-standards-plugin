---
title: Accessibility (WCAG)
version: 1.0.0
---

# Accessibility (WCAG 2.2 AA)

Target **WCAG 2.2 level AA** unless the project states otherwise. Automated tools (axe, Lighthouse, eslint-plugin-jsx-a11y, angular-eslint template-accessibility) catch ~30–40% of issues; manual review is required.

## POUR checklist

**Perceivable**
- Text alternatives for non-text content (`alt`; empty `alt=""` for decorative); captions/transcripts for media.
- Contrast ≥ 4.5:1 text (3:1 large text and UI components/focus indicators); don't rely on colour alone.
- Content reflows at 320px / 400% zoom; text resizable to 200%; respects `prefers-reduced-motion` and `prefers-color-scheme`.

**Operable**
- Everything works with keyboard only; logical tab order; no keyboard traps; visible, high-contrast **focus indicator**; skip links.
- Pointer targets ≥ 24×24 CSS px (WCAG 2.2); drag actions have alternatives; no time limits without controls.
- Avoid seizure risks (no flashing > 3/s).

**Understandable**
- `lang` attribute; clear labels and instructions; consistent navigation; error identification with suggestions; `aria-live`/`role="alert"` for dynamic errors; don't clear user input on error; accessible authentication (no cognitive-test-only login).

**Robust**
- Semantic HTML first (`button`, `a`, `nav`, `main`, `ul`, headings in order, `label for`); ARIA only to fill gaps — **no ARIA is better than bad ARIA**; correct roles/states/properties; names match visible labels.

## Components

- Custom widgets (modals, menus, tabs, comboboxes) follow WAI-ARIA Authoring Practices: focus management (move focus in, trap in modal, restore on close), `Esc` to close, arrow-key navigation, `aria-expanded/controls/selected`.
- Forms: associated labels, `autocomplete` tokens, `aria-describedby` for hints/errors, `fieldset/legend` for groups, `required` + visible indicator.
- Tables: `th` with `scope`, captions; don't use tables for layout.
- Images of text avoided; icons-only buttons have accessible names (`aria-label`).
- SPA: announce route changes, manage focus on navigation, update `document.title`.

## Testing

axe in CI and unit tests (jest-axe, `@axe-core/playwright`); keyboard walkthrough; screen reader smoke test (NVDA/VoiceOver); zoom and high-contrast mode; reduced motion.

## Reporting

Findings reference the WCAG success criterion (e.g., 1.4.3 Contrast, 2.4.7 Focus Visible, 4.1.2 Name/Role/Value), the affected element/file, user impact, and a fix. Severity: Critical = blocks task completion for a group; High = major barrier; Medium = difficult; Low = minor.
