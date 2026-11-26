# Claude Code adapter

Install: `node scripts/install.mjs --ide claude-code --target <project>`

| Canonical | Generated | Notes |
|---|---|---|
| `commands/**` | `.claude/commands/<name>.md` | Frontmatter: `description`, `argument-hint`, and for read-only commands `allowed-tools` limited to Read/Grep/Glob and read-only `git` calls. User input is passed with `$ARGUMENTS`. |
| `skills/**` | `.claude/skills/<name>/SKILL.md` | Frontmatter `name` + `description`. |
| `rules/**` | `CLAUDE.md` managed block | Always-on rules are inlined; glob/model rules are listed with pointers into `.engineering-standards/rules/`. |
| standards, checklists, templates | `.engineering-standards/` | Shared with the other IDEs. |

Docs followed: <https://code.claude.com/docs/en/skills>, <https://code.claude.com/docs/en/slash-commands>.

## Limitations
- Claude Code has merged commands into skills; `.claude/commands/` is still supported. If a future release drops it, switch the adapter to emit `.claude/skills/<name>/SKILL.md` for commands too.
- `allowed-tools` restricts which tools run without a prompt; it is a convenience, not a security boundary. Read-only behaviour is also stated in the command text.
- Glob-scoped rules are not auto-loaded by file pattern in Claude Code; they are referenced from `CLAUDE.md` and read on demand.
