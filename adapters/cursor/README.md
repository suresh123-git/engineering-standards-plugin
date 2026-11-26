# Cursor adapter

Install: `node scripts/install.mjs --ide cursor --target <project>`

| Canonical | Generated | Notes |
|---|---|---|
| `commands/**` | `.cursor/commands/<name>.md` | Plain Markdown, invoked with `/name`. Cursor commands take no frontmatter and no `$ARGUMENTS`; text typed after the command is passed as context. |
| `rules/**` | `.cursor/rules/<name>.mdc` | Frontmatter `description`, `globs` (comma-separated), `alwaysApply`. Plain `.md` files in this folder are ignored by Cursor, hence `.mdc`. |
| `skills/**` | `.cursor/skills/<name>/SKILL.md` | Agent Skills format. |
| standards etc. | `.engineering-standards/` | Shared. |

Docs followed: <https://cursor.com/docs/rules>, <https://cursor.com/docs/context/commands>.

## Limitations
- Cursor has signalled that commands are being folded into skills; commands still work today.
- The `globs` value format (comma-separated string) follows Cursor's documented examples but is **unverified in a live editor** for this release.
- Read-only mode is enforced by instruction text only; Cursor has no per-command tool allow-list.
