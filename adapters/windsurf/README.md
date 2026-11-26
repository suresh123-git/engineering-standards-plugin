# Windsurf adapter

Install: `node scripts/install.mjs --ide windsurf --target <project>`

| Canonical | Generated | Notes |
|---|---|---|
| `commands/**` | `.windsurf/workflows/<name>.md` | Workflows are Windsurf's slash commands (`/name`), manual-invocation only. |
| `rules/**` | `.windsurf/rules/<name>.md` | Frontmatter `trigger` = `always_on` / `glob` / `model_decision`, plus `description` and `globs`. |
| `skills/**` | `.windsurf/skills/<name>/SKILL.md` | Skills. |

Docs followed: <https://docs.windsurf.com/windsurf/cascade/workflows>, <https://docs.windsurf.com/windsurf/cascade/memories>.

## Limitations
- Workflow files are limited to **12,000 characters**. The build asserts this (`npm run validate`); the largest generated workflow is well below it.
- Rule files have a documented size limit (about 6,000 characters per file, from memory — not re-verified); the validator enforces 6,000 as a conservative cap.
- Workflows take no argument placeholder; text after `/name` is read as context.
