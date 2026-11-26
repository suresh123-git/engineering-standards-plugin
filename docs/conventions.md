# Metadata conventions

All canonical Markdown uses a small YAML subset: scalars, inline arrays (`[a, b]`) and block lists. Enforced by `npm run validate`.

## Commands — `commands/<category>/<name>.md`
```yaml
name: review                 # kebab-case, unique across commands AND skills, equals file name
description: One sentence.   # shown in IDE command pickers
category: development        # equals parent folder
version: 1.0.0
mode: read-only              # read-only | modifying
argument-hint: "[file | directory | git ref]"
standards: [global/review-findings, coding/clean-code]   # paths under standards/, no .md
skills: [code-review]                                     # skill names
```
Required `##` sections: Purpose, Expected Input, Project Context Discovery, Applicable Standards, Execution Steps, Output Format, Safety Constraints, Examples.

## Skills — `skills/<name>/SKILL.md`, `skills/stacks/<x>/SKILL.md`
Frontmatter: `name`, `description`, `version`, `category` (`core` | `stack`). Stack skill names are `stack-<x>`.
- Core sections: When to apply, How to apply, Checklist, Common mistakes.
- Stack sections: Detect, Review focus (plus Implementation/Testing conventions as useful).
- Skills never link to other skills; mention them by name.

## Rules — `rules/<group>/<name>.md`
Frontmatter: `name`, `description`, `scope` (`always` | `glob` | `model`), `globs` (required for `glob`), `version`.
Keep always-on rules very short — they are inlined into project instruction files.

## Standards and checklists
Frontmatter `title` and `version`. Link between standards with relative links.

## Links
Use relative links to files inside the repo. Anchors are allowed (the validator checks the file only). `templates/` is excluded from link validation because it contains placeholders.
