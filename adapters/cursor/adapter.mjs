// Cursor adapter.
// Native mechanisms (per cursor.com/docs, Nov 2026):
//   .cursor/commands/<name>.md       custom commands (plain Markdown; invoked with "/" in Agent)
//   .cursor/rules/<name>.mdc         project rules (frontmatter: description, globs, alwaysApply)
//   .cursor/skills/<name>/SKILL.md   agent skills
// Note: plain .md files inside .cursor/rules are ignored by Cursor, so rules MUST be .mdc.
import { frontmatter, renderCommandBody, renderSkillBody, rewriteLinks } from '../../scripts/lib.mjs';

export const meta = {
  id: 'cursor',
  title: 'Cursor',
  docs: ['https://cursor.com/docs/rules', 'https://cursor.com/docs/context/commands'],
};

function ruleFrontmatter(r) {
  const lines = ['---', `description: ${JSON.stringify(r.data.description)}`];
  if (r.data.scope === 'glob') lines.push(`globs: ${r.data.globs.join(',')}`);
  lines.push(`alwaysApply: ${r.data.scope === 'always'}`, '---', '');
  return lines.join('\n');
}

export function generate({ commands, skills, rules }) {
  const files = [];
  for (const c of commands) {
    files.push({
      path: `.cursor/commands/${c.data.name}.md`,
      content: renderCommandBody(c, { userInput: 'the text the user typed after the command (or the current selection/open file if empty)' }),
    });
  }
  for (const r of rules) {
    files.push({
      path: `.cursor/rules/${r.data.name}.mdc`,
      content: ruleFrontmatter(r) + rewriteLinks(r.body.trim(), r.file) + '\n',
    });
  }
  for (const s of skills) {
    files.push({
      path: `.cursor/skills/${s.data.name}/SKILL.md`,
      content: frontmatter({ name: s.data.name, description: s.data.description }) + renderSkillBody(s),
    });
  }
  return files;
}
