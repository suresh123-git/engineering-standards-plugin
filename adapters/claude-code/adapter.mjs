// Claude Code adapter.
// Native mechanisms (verified against code.claude.com/docs, Nov 2026):
//   .claude/commands/<name>.md      slash commands (frontmatter: description, argument-hint, allowed-tools)
//   .claude/skills/<name>/SKILL.md  skills (frontmatter: name, description)
//   CLAUDE.md                       project memory/instructions
import { frontmatter, renderCommandBody, renderSkillBody, renderBlock } from '../../scripts/lib.mjs';

export const meta = {
  id: 'claude-code',
  title: 'Claude Code',
  docs: [
    'https://code.claude.com/docs/en/skills',
    'https://code.claude.com/docs/en/slash-commands',
  ],
};

const READ_ONLY_TOOLS =
  'Read, Grep, Glob, Bash(git diff:*), Bash(git log:*), Bash(git status:*), Bash(git show:*), Bash(git blame:*)';

export function generate({ commands, skills, rules, version }) {
  const files = [];
  for (const c of commands) {
    const fm = {
      description: c.data.description,
      'argument-hint': c.data['argument-hint'],
    };
    if (c.data.mode === 'read-only') fm['allowed-tools'] = READ_ONLY_TOOLS;
    files.push({
      path: `.claude/commands/${c.data.name}.md`,
      content: frontmatter(fm) + renderCommandBody(c, { userInput: '$ARGUMENTS' }),
    });
  }
  for (const s of skills) {
    files.push({
      path: `.claude/skills/${s.data.name}/SKILL.md`,
      content: frontmatter({ name: s.data.name, description: s.data.description }) + renderSkillBody(s),
    });
  }
  files.push({
    path: 'CLAUDE.md',
    block: renderBlock({
      ide: 'Claude Code',
      version,
      rules,
      invocation: 'Slash commands (`/review`, `/implement`, …) are in `.claude/commands/`; skills are in `.claude/skills/`.',
    }),
  });
  return files;
}
