// Claude Code plugin adapter (also installable via claude.ai / Cowork plugin support).
// Produces a self-contained plugin directory, committed at plugins/engineering-standards/ and
// listed by the repo-root marketplace (.claude-plugin/marketplace.json).
//
// Plugin rules (code.claude.com/docs/en/plugins/components):
//   - manifest at .claude-plugin/plugin.json
//   - commands/<file>.md   → /<plugin>:<file>   (flat: subfolders add namespace segments)
//   - skills/<dir>/SKILL.md (one level)
//   - a CLAUDE.md at the plugin root is NOT loaded → always-on rules ship as a skill
//   - ${CLAUDE_PLUGIN_ROOT} is substituted in skill/command content → used for links
import path from 'node:path';
import {
  ROOT, INSTALL_DIR, read, rel, walk, frontmatter, rewriteLinks, renderIndex,
} from '../../scripts/lib.mjs';
import { generate as generateClaudeCode } from '../claude-code/adapter.mjs';

export const meta = {
  id: 'claude-plugin',
  title: 'Claude Code plugin',
  pluginName: 'engineering-standards',
  outDir: 'plugins/engineering-standards',
  docs: [
    'https://code.claude.com/docs/en/plugins/components',
    'https://code.claude.com/docs/en/plugins/create-marketplace',
  ],
};

const ROOT_VAR = '${CLAUDE_PLUGIN_ROOT}/';
const toPluginLinks = (text) => text.split(`${INSTALL_DIR}/`).join(ROOT_VAR);

export const REPO_URL = 'https://github.com/suresh123-git/engineering-standards-plugin';

export function rulesSkill(rules) {
  const body = [];
  body.push(
    '# Engineering rules',
    '',
    'Baseline rules for any coding task in this project. Project conventions and explicit user instructions win over these rules.',
    '',
  );
  for (const r of rules.filter((x) => x.data.scope === 'always')) {
    const title = r.data.name.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase());
    body.push(`## ${title}`, '', rewriteLinks(r.body.trim(), r.file).replace(/^#\s+.*\n+/, ''), '');
  }
  body.push('## Scoped rules', '', 'Read these when working on matching files or topics:', '');
  for (const r of rules.filter((x) => x.data.scope !== 'always')) {
    const where = r.data.scope === 'glob' ? `files: ${r.data.globs.map((g) => `\`${g}\``).join(', ')}` : 'when relevant';
    body.push(`- [${r.data.name}](${INSTALL_DIR}/${r.rel}) — ${r.data.description} (${where})`);
  }
  body.push('');
  return (
    frontmatter({
      name: 'engineering-rules',
      description:
        'Baseline engineering rules (safe changes, project awareness, secure defaults, clean code). Apply whenever writing, modifying, reviewing or designing code.',
    }) + body.join('\n')
  );
}

export function generate(ctx) {
  const { version, rules, commands, skills } = ctx;
  const files = [];

  for (const f of generateClaudeCode(ctx)) {
    if (f.block) continue; // CLAUDE.md is not loaded from plugins
    const p = f.path.replace(/^\.claude\//, '');
    files.push({ path: p, content: toPluginLinks(f.content) });
  }
  files.push({ path: 'skills/engineering-rules/SKILL.md', content: toPluginLinks(rulesSkill(rules)) });

  for (const dir of ['standards', 'checklists', 'templates', 'rules']) {
    for (const f of walk(path.join(ROOT, dir), (p) => p.endsWith('.md'))) {
      files.push({ path: rel(f), content: read(f) });
    }
  }
  files.push({ path: 'INDEX.md', content: renderIndex({ version, commands, skills }) });

  files.push({
    path: '.claude-plugin/plugin.json',
    content:
      JSON.stringify(
        {
          name: meta.pluginName,
          version,
          description:
            `${commands.length} stack-aware engineering commands, ${skills.length + 1} skills and shared standards for code review, implementation, architecture, security, testing, API, database, DevOps and documentation.`,
          author: { name: 'engineering-standards contributors' },
          homepage: REPO_URL,
          repository: REPO_URL,
          license: 'MIT',
          keywords: ['code-review', 'standards', 'architecture', 'security', 'testing', 'clean-code'],
        },
        null,
        2,
      ) + '\n',
  });
  files.push({
    path: 'README.md',
    content: `# engineering-standards (Claude Code plugin)

Generated from the canonical sources in the repository root — **do not edit by hand**; run \`npm run build:plugin\`.

Commands are namespaced by the plugin: \`/${meta.pluginName}:review\`, \`/${meta.pluginName}:implement\`, \`/${meta.pluginName}:production-check\`, … See [INDEX.md](INDEX.md) for all ${commands.length} commands and ${skills.length + 1} skills.

Install: \`/plugin marketplace add suresh123-git/engineering-standards-plugin\` then \`/plugin install engineering-standards@engineering-standards\`.
`,
  });
  return files;
}

export function marketplace(version) {
  return (
    JSON.stringify(
      {
        name: 'engineering-standards',
        description: 'Engineering standards toolkit: commands, skills and standards for everyday development.',
        owner: { name: 'engineering-standards contributors' },
        plugins: [
          {
            name: meta.pluginName,
            source: `./${meta.outDir}`,
            description: 'Stack-aware slash commands, skills and standards for review, design, implementation, security, testing and production readiness.',
            version,
          },
        ],
      },
      null,
      2,
    ) + '\n'
  );
}
