// Windsurf (Cascade) adapter.
// Native mechanisms (per docs.windsurf.com, Nov 2026):
//   .windsurf/workflows/<name>.md   workflows = slash commands (/<name>); max 12,000 characters per file
//   .windsurf/rules/<name>.md       rules (frontmatter: trigger = always_on | model_decision | glob | manual)
//   .windsurf/skills/<name>/SKILL.md skills
import { frontmatter, renderCommandBody, renderSkillBody, rewriteLinks } from '../../scripts/lib.mjs';

export const meta = {
  id: 'windsurf',
  title: 'Windsurf',
  docs: ['https://docs.windsurf.com/windsurf/cascade/workflows', 'https://docs.windsurf.com/windsurf/cascade/memories'],
  limits: { workflowChars: 12000, ruleChars: 6000 },
};

export function generate({ commands, skills, rules }) {
  const files = [];
  for (const c of commands) {
    files.push({
      path: `.windsurf/workflows/${c.data.name}.md`,
      content:
        frontmatter({ description: c.data.description }) +
        renderCommandBody(c, { userInput: 'the text the user typed after the workflow name (or the current selection/open file if empty)' }),
      limit: meta.limits.workflowChars,
    });
  }
  for (const r of rules) {
    const trigger = { always: 'always_on', glob: 'glob', model: 'model_decision' }[r.data.scope];
    const fm = ['---', `trigger: ${trigger}`, `description: ${JSON.stringify(r.data.description)}`];
    if (r.data.scope === 'glob') fm.push(`globs: ${r.data.globs.join(',')}`);
    fm.push('---', '');
    files.push({
      path: `.windsurf/rules/${r.data.name}.md`,
      content: fm.join('\n') + rewriteLinks(r.body.trim(), r.file) + '\n',
      limit: meta.limits.ruleChars,
    });
  }
  for (const s of skills) {
    files.push({
      path: `.windsurf/skills/${s.data.name}/SKILL.md`,
      content: frontmatter({ name: s.data.name, description: s.data.description }) + renderSkillBody(s),
    });
  }
  return files;
}
