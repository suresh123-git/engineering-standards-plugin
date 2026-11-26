# Contributing

Thanks for improving the toolkit. The golden rule: **edit canonical sources only** (`commands/`, `skills/`, `rules/`, `standards/`, `checklists/`, `templates/`). Never edit `dist/` or generated files in a project.

## Setup

Node.js ≥ 18. No dependencies to install.

```bash
npm run validate && npm test
```

## Adding a command

1. Copy [templates/command.md](templates/command.md) to `commands/<category>/<name>.md`.
2. Fill the frontmatter (`name`, `description`, `category` = parent folder, `version`, `mode`, `argument-hint`, `standards`, `skills`).
3. Keep every required section: Purpose, Expected Input, Project Context Discovery, Applicable Standards, Execution Steps, Output Format, Safety Constraints, Examples.
4. Make it specific to its job — stack-aware steps, concrete outputs, no boilerplate copied from another command.
5. `mode: read-only` commands must say they do not modify files. Anything destructive must require approval.
6. Keep it under ~9,000 characters (Windsurf workflows are limited to 12,000 after the shared footer is added).
7. Run `npm run build:plugin` (the plugin output is committed and CI fails if stale), then `npm run docs` to refresh the README tables, then `npm run validate`.

## Adding a skill, rule or standard

- Skills: [templates/skill.md](templates/skill.md). Core skills need *When to apply / How to apply / Checklist / Common mistakes*; stack skills (`skills/stacks/<x>`, name `stack-<x>`) need *Detect / Review focus*. Skills must not link to other skills — refer to them by name.
- Rules: [templates/rule.md](templates/rule.md). Choose `scope: always | glob | model` deliberately; always-on rules are inlined into every project, so keep them tiny.
- Standards: add frontmatter `title` and `version`; link them from commands via `standards:`.

## Adding or changing an IDE adapter

Follow the IDE's **official documentation**, cite it in `meta.docs`, document limitations in `adapters/<id>/README.md`, and never duplicate command logic — adapters only transform canonical content.

## Pull requests

- Conventional Commits (`feat(commands): add /foo`), small focused PRs.
- `npm run validate` and `npm test` must pass (CI runs both).
- Update `CHANGELOG.md` for user-visible changes.
