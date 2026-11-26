// GitHub Copilot adapter (VS Code / Visual Studio / JetBrains prompt-file support varies).
// Native mechanisms (per docs.github.com + code.visualstudio.com, Nov 2026):
//   .github/prompts/<name>.prompt.md          reusable prompts; invoked as /<name> in Copilot Chat (VS Code)
//   .github/instructions/<n>.instructions.md  scoped instructions (frontmatter: applyTo, description)
//   .github/copilot-instructions.md           repository-wide instructions
//   .github/skills/<name>/SKILL.md            agent skills
import { frontmatter, renderCommandBody, renderSkillBody, renderBlock, rewriteLinks } from '../../scripts/lib.mjs';

export const meta = {
  id: 'copilot',
  title: 'GitHub Copilot',
  docs: [
    'https://docs.github.com/en/copilot/how-tos/custom-instructions/adding-repository-custom-instructions-for-github-copilot',
    'https://code.visualstudio.com/docs/copilot/customization/prompt-files',
  ],
};

export function generate({ commands, skills, rules, version }) {
  const files = [];
  for (const c of commands) {
    files.push({
      path: `.github/prompts/${c.data.name}.prompt.md`,
      content:
        frontmatter({ description: c.data.description, agent: 'agent' }) +
        renderCommandBody(c, { userInput: 'the text the user typed after the prompt name (or the current selection/open file if empty)' }),
    });
  }
  for (const r of rules.filter((x) => x.data.scope !== 'always')) {
    const fm = ['---', `description: ${JSON.stringify(r.data.description)}`];
    if (r.data.scope === 'glob') fm.push(`applyTo: ${JSON.stringify(r.data.globs.join(','))}`);
    fm.push('---', '');
    files.push({
      path: `.github/instructions/${r.data.name}.instructions.md`,
      content: fm.join('\n') + rewriteLinks(r.body.trim(), r.file) + '\n',
    });
  }
  for (const s of skills) {
    files.push({
      path: `.github/skills/${s.data.name}/SKILL.md`,
      content: frontmatter({ name: s.data.name, description: s.data.description }) + renderSkillBody(s),
    });
  }
  files.push({
    path: '.github/copilot-instructions.md',
    block: renderBlock({
      ide: 'GitHub Copilot',
      version,
      rules: rules.filter((r) => r.data.scope === 'always').concat([]),
      invocation: 'Prompt files (`/review`, `/implement`, …) are in `.github/prompts/`; scoped instructions in `.github/instructions/`.',
    }),
  });
  return files;
}
