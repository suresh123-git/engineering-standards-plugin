# OpenAI Codex adapter

Install: `node scripts/install.mjs --ide codex --target <project>`

| Canonical | Generated | Notes |
|---|---|---|
| `commands/**` | `.agents/skills/<name>/SKILL.md` | Codex has no repo-defined slash commands (custom prompts in `~/.codex/prompts` are deprecated), so each command is a skill invoked explicitly as `$name` or via `/skills`. |
| `skills/**` | `.agents/skills/<name>/SKILL.md` | Same format. |
| command skills | `.agents/skills/<name>/agents/openai.yaml` | Sets `allow_implicit_invocation: false` so commands run only when asked. |
| `rules/**` | `AGENTS.md` managed block | Always-on rules inlined; others referenced. |

Docs followed: <https://developers.openai.com/codex/skills>, <https://developers.openai.com/codex/guides/agents-md>.

## Limitations
- Commands appear as `$review`, not `/review`.
- The exact schema of `agents/openai.yaml` (`policy.allow_implicit_invocation`) is **unverified** for this release; if Codex rejects it, delete the file — commands still work and will merely be eligible for implicit invocation.
- `AGENTS.md` is size-limited by Codex (default ~32 KiB combined); the managed block is intentionally short.
