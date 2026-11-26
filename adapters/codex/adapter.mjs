// OpenAI Codex (CLI / IDE extension / app) adapter.
// Native mechanisms (per developers.openai.com/codex, Nov 2026):
//   AGENTS.md                              project instructions (hierarchical)
//   .agents/skills/<name>/SKILL.md         repo-scoped skills; invoked explicitly with $name or /skills, or implicitly by description
//   .agents/skills/<name>/agents/openai.yaml  optional metadata/policy
// Codex has no user-defined slash commands for repos (custom prompts in ~/.codex/prompts are deprecated),
// so each toolkit command is exposed as a skill that is explicitly invoked: $review, $implement, ...
import { frontmatter, renderCommandBody, renderSkillBody, renderBlock } from '../../scripts/lib.mjs';

export const meta = {
  id: 'codex',
  title: 'OpenAI Codex',
  docs: ['https://developers.openai.com/codex/skills', 'https://developers.openai.com/codex/guides/agents-md'],
};

export function generate({ commands, skills, rules, version }) {
  const files = [];
  for (const c of commands) {
    files.push({
      path: `.agents/skills/${c.data.name}/SKILL.md`,
      content:
        frontmatter({ name: c.data.name, description: `${c.data.description} (Toolkit command; invoke explicitly with $${c.data.name}.)` }) +
        renderCommandBody(c, { userInput: 'the text the user wrote when invoking this skill' }),
    });
    // Commands should run only when the user asks for them.
    files.push({
      path: `.agents/skills/${c.data.name}/agents/openai.yaml`,
      content: 'policy:\n  allow_implicit_invocation: false\n',
    });
  }
  for (const s of skills) {
    files.push({
      path: `.agents/skills/${s.data.name}/SKILL.md`,
      content: frontmatter({ name: s.data.name, description: s.data.description }) + renderSkillBody(s),
    });
  }
  files.push({
    path: 'AGENTS.md',
    block: renderBlock({
      ide: 'OpenAI Codex',
      version,
      rules,
      invocation: 'Toolkit commands are skills in `.agents/skills/`: invoke with `$review`, `$implement`, `$design`, … (or `/skills`).',
    }),
  });
  return files;
}
