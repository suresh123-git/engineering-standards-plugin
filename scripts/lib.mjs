// Shared helpers for build, install and validation scripts. Zero dependencies.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const INSTALL_DIR = '.engineering-standards';
export const BLOCK_START = '<!-- engineering-standards:start -->';
export const BLOCK_END = '<!-- engineering-standards:end -->';
export const IDES = ['claude-code', 'cursor', 'copilot', 'windsurf', 'codex'];

export const COMMAND_SECTIONS = [
  'Purpose',
  'Expected Input',
  'Project Context Discovery',
  'Applicable Standards',
  'Execution Steps',
  'Output Format',
  'Safety Constraints',
  'Examples',
];
export const COMMAND_CATEGORIES = [
  'development', 'architecture', 'quality', 'security', 'testing',
  'api', 'database', 'devops', 'git', 'documentation',
];
export const COMMAND_MODES = ['read-only', 'modifying'];
export const RULE_SCOPES = ['always', 'glob', 'model'];
export const SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;
export const KEBAB = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

// Normalise line endings so Windows checkouts (core.autocrlf) build and validate identically.
export const read = (p) => fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
export const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');
export const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');

export function walk(dir, filter = () => true, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, filter, out);
    else if (filter(full)) out.push(full);
  }
  return out.sort();
}

// ---------- frontmatter ----------
function unquote(v) {
  v = v.trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    try { return v.startsWith('"') ? JSON.parse(v) : v.slice(1, -1); } catch { return v.slice(1, -1); }
  }
  return v;
}

function parseInlineArray(v) {
  const inner = v.trim().slice(1, -1).trim();
  if (!inner) return [];
  return inner.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map((s) => unquote(s));
}

/** Parses the small YAML subset used by this toolkit: scalars, inline arrays, block lists. */
export function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: null, body: text };
  const data = {};
  const lines = m[1].split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    const [, key, raw] = kv;
    if (raw === '') {
      const items = [];
      while (i + 1 < lines.length && /^\s+-\s+/.test(lines[i + 1])) {
        items.push(unquote(lines[++i].replace(/^\s+-\s+/, '')));
      }
      data[key] = items.length ? items : '';
    } else if (raw.startsWith('[') && raw.endsWith(']')) {
      data[key] = parseInlineArray(raw);
    } else {
      data[key] = unquote(raw);
    }
  }
  return { data, body: m[2] };
}

export const yamlStr = (s) => JSON.stringify(String(s));

export function frontmatter(obj) {
  const lines = ['---'];
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    lines.push(`${k}: ${typeof v === 'boolean' ? v : yamlStr(v)}`);
  }
  lines.push('---', '');
  return lines.join('\n');
}

// ---------- links ----------
const FENCE = /^(\s*)(```|~~~)/;

/** Applies fn to every line outside fenced code blocks. */
export function mapOutsideFences(text, fn) {
  let inFence = false;
  return text
    .split('\n')
    .map((line) => {
      if (FENCE.test(line)) { inFence = !inFence; return line; }
      return inFence ? line : fn(line);
    })
    .join('\n');
}

const LINK = /(\[[^\]]*\]\()([^)\s]+)(\))/g;
const isExternal = (t) => /^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i.test(t);

/** Extracts internal link targets (outside code fences) from markdown. */
export function extractLinks(text) {
  const links = [];
  mapOutsideFences(text, (line) => {
    // ignore inline code spans
    const stripped = line.replace(/`[^`]*`/g, '');
    for (const m of stripped.matchAll(LINK)) if (!isExternal(m[2])) links.push(m[2]);
    return line;
  });
  return links;
}

/** Rewrites relative links so they point into the installed `.engineering-standards/` folder. */
export function rewriteLinks(body, sourceFile) {
  return mapOutsideFences(body, (line) =>
    line.replace(LINK, (all, open, target, close) => {
      if (isExternal(target)) return all;
      const [file, anchor] = target.split('#');
      const abs = path.resolve(path.dirname(sourceFile), file);
      const r = path.relative(ROOT, abs).split(path.sep).join('/');
      if (r.startsWith('..')) return all;
      return `${open}${INSTALL_DIR}/${r}${anchor ? '#' + anchor : ''}${close}`;
    }),
  );
}

// ---------- loading ----------
function loadDir(dir, match) {
  return walk(path.join(ROOT, dir), match).map((file) => {
    const text = read(file);
    const { data, body } = parseFrontmatter(text);
    return { file, rel: rel(file), data: data || {}, hasFrontmatter: !!data, body, text };
  });
}

export const loadCommands = () => loadDir('commands', (f) => f.endsWith('.md'));
export const loadRules = () => loadDir('rules', (f) => f.endsWith('.md'));
export const loadSkills = () => loadDir('skills', (f) => path.basename(f) === 'SKILL.md');

export function listH2(body) {
  const out = [];
  mapOutsideFences(body, (line) => {
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (m) out.push(m[1]);
    return line;
  });
  return out;
}

export function sectionText(body, title) {
  const lines = body.split('\n');
  let inFence = false;
  let capture = false;
  const out = [];
  for (const line of lines) {
    if (FENCE.test(line)) inFence = !inFence;
    const h = !inFence && line.match(/^##\s+(.+?)\s*$/);
    if (h) { capture = h[1] === title; continue; }
    if (capture) out.push(line);
  }
  return out.join('\n');
}

// ---------- rendering helpers shared by adapters ----------
export const READ_ONLY_NOTICE =
  '**Mode: read-only.** Do not create, modify or delete files unless the user explicitly asks you to apply the changes. Running side-effect-free inspection commands (git log/diff, tests, linters) is fine.';
export const MODIFYING_NOTICE =
  '**Mode: modifying.** Change only the files the task requires, explain what changed, and validate the result. Ask before any destructive or irreversible action.';

/**
 * Renders a canonical command body for an IDE.
 * @param {object} cmd loaded command
 * @param {{userInput:string}} opts
 */
export function renderCommandBody(cmd, { userInput }) {
  const body = rewriteLinks(cmd.body.trim(), cmd.file);
  const notice = cmd.data.mode === 'read-only' ? READ_ONLY_NOTICE : MODIFYING_NOTICE;
  const lines = body.split('\n');
  const h1 = lines.findIndex((l) => /^#\s+/.test(l));
  const head = [`> ${notice}`, '>', `> **User input:** ${userInput}`, ''];
  lines.splice(h1 + 1, 0, '', ...head);
  const footer = [
    '',
    '## Shared Requirements',
    '',
    `- Run [project context discovery](${INSTALL_DIR}/standards/global/project-discovery.md) first and load the matching \`stack-*\` skills.`,
    `- Follow the [safety rules](${INSTALL_DIR}/standards/global/safety-rules.md); audit-style output uses the [findings format](${INSTALL_DIR}/standards/global/review-findings.md).`,
    '- Project conventions override generic advice unless they cause a concrete problem; never force a framework or architecture the project does not use.',
    '',
  ];
  return lines.join('\n') + '\n' + footer.join('\n');
}

export function renderSkillBody(skill) {
  return rewriteLinks(skill.body.trim(), skill.file) + '\n';
}

export const skillName = (s) => s.data.name;

/** Managed block placed in CLAUDE.md / AGENTS.md / copilot-instructions.md. */
export function renderBlock({ ide, version, rules, invocation }) {
  const always = rules.filter((r) => r.data.scope === 'always');
  const scoped = rules.filter((r) => r.data.scope !== 'always');
  const parts = [
    BLOCK_START,
    `<!-- generated by engineering-standards v${version} for ${ide}; edit the toolkit, not this block -->`,
    '# Engineering Standards',
    '',
    `This project uses the **engineering-standards** toolkit (v${version}). ${invocation}`,
    `Shared standards, checklists and templates live in \`${INSTALL_DIR}/\` — start from \`${INSTALL_DIR}/INDEX.md\`.`,
    '',
    '**Precedence:** explicit user instruction → project conventions and docs → toolkit standards → general best practice.',
    '',
  ];
  for (const r of always) {
    const body = rewriteLinks(r.body.trim(), r.file).replace(/^#\s+.*\n+/, '');
    parts.push(`## ${r.data.name.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase())}`, '', body, '');
  }
  if (scoped.length) {
    parts.push('## Scoped rules', '', 'Read these rule files when working on matching files or topics:', '');
    for (const r of scoped) {
      const where = r.data.scope === 'glob' ? `files: ${r.data.globs.map((g) => `\`${g}\``).join(', ')}` : 'when relevant';
      parts.push(`- \`${INSTALL_DIR}/${r.rel}\` — ${r.data.description} (${where})`);
    }
    parts.push('');
  }
  parts.push(BLOCK_END, '');
  return parts.join('\n');
}

export function renderIndex({ version, commands, skills }) {
  const byCat = new Map();
  for (const c of commands) {
    const k = c.data.category;
    if (!byCat.has(k)) byCat.set(k, []);
    byCat.get(k).push(c);
  }
  const lines = [
    `# Engineering Standards — Index (v${version})`,
    '',
    '## Commands',
    '',
  ];
  for (const cat of COMMAND_CATEGORIES) {
    const list = byCat.get(cat);
    if (!list) continue;
    lines.push(`### ${cat}`, '', '| Command | Mode | Purpose |', '|---|---|---|');
    for (const c of list.sort((a, b) => a.data.name.localeCompare(b.data.name))) {
      lines.push(`| \`/${c.data.name}\` | ${c.data.mode} | ${c.data.description} |`);
    }
    lines.push('');
  }
  lines.push('## Skills', '', '| Skill | Use when |', '|---|---|');
  for (const s of skills) lines.push(`| \`${s.data.name}\` | ${s.data.description} |`);
  lines.push(
    '',
    '## Standards',
    '',
    'See the folders under `standards/`: `global`, `coding`, `architecture`, `api`, `database`, `security`, `testing`, `git`, `documentation`, `devops`, `frontend`.',
    '',
    'Checklists: `checklists/`. Templates: `templates/`. Rules: `rules/`.',
    '',
  );
  return lines.join('\n');
}
