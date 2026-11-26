# GitHub Copilot adapter

Install: `node scripts/install.mjs --ide copilot --target <project>`

| Canonical | Generated | Notes |
|---|---|---|
| `commands/**` | `.github/prompts/<name>.prompt.md` | Frontmatter `description`, `agent: agent`. Invoked as `/name` in Copilot Chat. |
| `rules/**` (glob/model) | `.github/instructions/<name>.instructions.md` | Frontmatter `description`, `applyTo` (comma-separated globs). |
| `rules/**` (always) | `.github/copilot-instructions.md` managed block | Repository-wide instructions. |
| `skills/**` | `.github/skills/<name>/SKILL.md` | Agent skills. |

Docs followed: <https://docs.github.com/en/copilot/how-tos/custom-instructions/adding-repository-custom-instructions-for-github-copilot>, <https://code.visualstudio.com/docs/copilot/customization/prompt-files>.

## Limitations
- Prompt files are supported in VS Code, Visual Studio (17.10+) and JetBrains (preview); they are **not** available on github.com chat.
- `agent:` replaces the older `mode:` frontmatter key. Very old Copilot versions may need `mode: agent`; unverified in a live editor for this release.
- Model-selected rules have no direct Copilot equivalent: they are emitted as instruction files without `applyTo`, so Copilot may not attach them automatically.
