#!/usr/bin/env node
// Validates canonical sources and generated output. Exit code 1 on any error.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  ROOT, IDES, INSTALL_DIR, COMMAND_SECTIONS, COMMAND_CATEGORIES, COMMAND_MODES, RULE_SCOPES, SEMVER, KEBAB,
  read, rel, walk, parseFrontmatter, extractLinks, listH2, loadCommands, loadRules, loadSkills,
} from './lib.mjs';
import { buildAll, readVersion } from './build.mjs';

const CORE_SKILL_SECTIONS = ['When to apply', 'How to apply', 'Checklist', 'Common mistakes'];
const STACK_SKILL_SECTIONS = ['Detect', 'Review focus'];

export async function validate() {
  const errors = [];
  const warnings = [];
  const err = (m) => errors.push(m);
  const warn = (m) => warnings.push(m);
  const stats = {};

  const commands = loadCommands();
  const skills = loadSkills();
  const rules = loadRules();
  const standardsDir = path.join(ROOT, 'standards');
  const skillNames = new Set(skills.map((s) => s.data.name));

  // ---- commands
  const names = new Map();
  for (const c of commands) {
    const d = c.data;
    const at = c.rel;
    if (!c.hasFrontmatter) { err(`${at}: missing frontmatter`); continue; }
    for (const k of ['name', 'description', 'category', 'version', 'mode', 'argument-hint']) {
      if (!d[k]) err(`${at}: missing frontmatter field "${k}"`);
    }
    if (d.name && !KEBAB.test(d.name)) err(`${at}: name "${d.name}" is not kebab-case`);
    if (d.name && path.basename(c.file, '.md') !== d.name) err(`${at}: file name does not match name "${d.name}"`);
    if (d.category && !COMMAND_CATEGORIES.includes(d.category)) err(`${at}: unknown category "${d.category}"`);
    if (d.category && path.basename(path.dirname(c.file)) !== d.category) err(`${at}: category "${d.category}" does not match parent folder`);
    if (d.mode && !COMMAND_MODES.includes(d.mode)) err(`${at}: mode must be one of ${COMMAND_MODES.join('|')}`);
    if (d.version && !SEMVER.test(d.version)) err(`${at}: invalid version "${d.version}"`);
    if (d.description && d.description.length > 300) warn(`${at}: description longer than 300 chars`);
    if (d.name) {
      if (names.has(d.name)) err(`${at}: duplicate command name "${d.name}" (also ${names.get(d.name)})`);
      names.set(d.name, at);
    }
    const h2 = listH2(c.body);
    for (const s of COMMAND_SECTIONS) if (!h2.includes(s)) err(`${at}: missing section "## ${s}"`);
    if (!/^#\s+\/\S+/m.test(c.body)) err(`${at}: missing "# /<name>" heading`);
    for (const st of d.standards || []) {
      if (!fs.existsSync(path.join(standardsDir, `${st}.md`))) err(`${at}: standards entry "${st}" does not exist`);
    }
    for (const sk of d.skills || []) {
      if (!skillNames.has(sk)) err(`${at}: skills entry "${sk}" does not exist`);
    }
    if (!Array.isArray(d.standards) || d.standards.length === 0) err(`${at}: "standards" must list at least one standard`);
  }
  stats.commands = commands.length;

  // ---- skills
  const skillSeen = new Set();
  for (const s of skills) {
    const d = s.data;
    const at = s.rel;
    if (!s.hasFrontmatter) { err(`${at}: missing frontmatter`); continue; }
    for (const k of ['name', 'description', 'version', 'category']) if (!d[k]) err(`${at}: missing frontmatter field "${k}"`);
    if (d.name && !KEBAB.test(d.name)) err(`${at}: name "${d.name}" is not kebab-case`);
    if (d.name && skillSeen.has(d.name)) err(`${at}: duplicate skill name "${d.name}"`);
    skillSeen.add(d.name);
    if (d.name && names.has(d.name)) err(`${at}: skill name "${d.name}" collides with a command name`);
    if (d.name && path.basename(path.dirname(s.file)) !== d.name.replace(/^stack-/, '') && path.basename(path.dirname(s.file)) !== d.name) {
      err(`${at}: folder name does not match skill name "${d.name}"`);
    }
    if (d.category && !['core', 'stack'].includes(d.category)) err(`${at}: category must be core|stack`);
    if (d.version && !SEMVER.test(d.version)) err(`${at}: invalid version`);
    if (d.description && d.description.length > 1024) err(`${at}: description exceeds 1024 chars`);
    const stack = at.startsWith('skills/stacks/');
    if (stack && d.category !== 'stack') err(`${at}: stack skill must have category "stack"`);
    if (stack && d.name && !d.name.startsWith('stack-')) err(`${at}: stack skill names must start with "stack-"`);
    const h2 = listH2(s.body);
    for (const sec of stack ? STACK_SKILL_SECTIONS : CORE_SKILL_SECTIONS) {
      if (!h2.includes(sec)) err(`${at}: missing section "## ${sec}"`);
    }
    if (/\]\([^)]*SKILL\.md/.test(s.body)) err(`${at}: skills must not link to other skills (use the skill name)`);
  }
  stats.skills = skills.length;

  // ---- rules
  const ruleSeen = new Set();
  for (const r of rules) {
    const d = r.data;
    const at = r.rel;
    if (!r.hasFrontmatter) { err(`${at}: missing frontmatter`); continue; }
    for (const k of ['name', 'description', 'scope', 'version']) if (!d[k]) err(`${at}: missing frontmatter field "${k}"`);
    if (d.scope && !RULE_SCOPES.includes(d.scope)) err(`${at}: scope must be one of ${RULE_SCOPES.join('|')}`);
    if (d.scope === 'glob' && (!Array.isArray(d.globs) || !d.globs.length)) err(`${at}: glob rules need a non-empty globs array`);
    if (d.name && ruleSeen.has(d.name)) err(`${at}: duplicate rule name "${d.name}"`);
    ruleSeen.add(d.name);
    if (d.name && path.basename(r.file, '.md') !== d.name) err(`${at}: file name does not match name`);
  }
  stats.rules = rules.length;

  // ---- standards / checklists metadata
  for (const dir of ['standards', 'checklists']) {
    for (const f of walk(path.join(ROOT, dir), (p) => p.endsWith('.md'))) {
      const { data } = parseFrontmatter(read(f));
      if (!data || !data.title) err(`${rel(f)}: missing frontmatter "title"`);
      else if (!data.version || !SEMVER.test(data.version)) err(`${rel(f)}: missing/invalid "version"`);
    }
  }

  // ---- internal links (templates are placeholders → skipped; anchors ignored)
  let linkCount = 0;
  const mdFiles = walk(ROOT, (p) => p.endsWith('.md')).filter((p) => !rel(p).startsWith('templates/'));
  for (const f of mdFiles) {
    for (const link of extractLinks(read(f))) {
      const file = link.split('#')[0];
      if (!file) continue;
      linkCount++;
      const target = path.resolve(path.dirname(f), decodeURI(file));
      if (!fs.existsSync(target)) err(`${rel(f)}: broken link "${link}"`);
    }
  }
  stats.links = linkCount;

  // ---- adapters
  for (const id of IDES) {
    const dir = path.join(ROOT, 'adapters', id);
    if (!fs.existsSync(path.join(dir, 'adapter.mjs'))) err(`adapters/${id}/adapter.mjs missing`);
    if (!fs.existsSync(path.join(dir, 'README.md'))) err(`adapters/${id}/README.md missing`);
    try {
      const mod = await import(pathToFileURL(path.join(dir, 'adapter.mjs')).href);
      if (typeof mod.generate !== 'function') err(`adapters/${id}: no generate() export`);
      if (!mod.meta || mod.meta.id !== id) err(`adapters/${id}: meta.id must be "${id}"`);
    } catch (e) { err(`adapters/${id}: failed to import (${e.message})`); }
  }

  // ---- docs consistency
  const readme = fs.existsSync(path.join(ROOT, 'README.md')) ? read(path.join(ROOT, 'README.md')) : '';
  if (!readme) err('README.md missing');
  for (const c of commands) if (readme && c.data.name && !readme.includes(`/${c.data.name}\``)) err(`README.md does not list /${c.data.name}`);
  for (const f of ['LICENSE', 'CONTRIBUTING.md', 'CHANGELOG.md']) if (!fs.existsSync(path.join(ROOT, f))) err(`${f} missing`);
  const version = readVersion();
  if (fs.existsSync(path.join(ROOT, 'CHANGELOG.md')) && !read(path.join(ROOT, 'CHANGELOG.md')).includes(`## [${version}]`)) {
    err(`CHANGELOG.md has no "## [${version}]" entry`);
  }

  // ---- generated output
  try {
    const built = await buildAll();
    const installed = new Set(built.shared.map((f) => f.path));
    for (const [id, files] of Object.entries(built.ides)) {
      const seen = new Set();
      for (const f of files) {
        if (seen.has(f.path)) err(`[${id}] duplicate output path ${f.path}`);
        seen.add(f.path);
        const text = f.content ?? f.block;
        if (f.limit && text.length > f.limit) err(`[${id}] ${f.path}: ${text.length} chars exceeds limit ${f.limit}`);
        if (/\]\((?:\.\.\/)+(?:standards|checklists|rules|templates)\//.test(text)) err(`[${id}] ${f.path}: unrewritten relative link`);
        for (const link of extractLinks(text)) {
          const file = link.split('#')[0];
          if (file.startsWith(INSTALL_DIR) && !installed.has(file)) err(`[${id}] ${f.path}: link to missing installed file ${file}`);
        }
      }
      stats[`output:${id}`] = files.length;
      const cmdOut = files.filter((f) => /commands\/|prompts\/|workflows\/|\.agents\/skills\/[^/]+\/SKILL\.md$/.test(f.path));
      const expected = commands.length + (id === 'codex' ? skills.length : 0);
      if (id !== 'cursor' || true) {
        const have = files.filter((f) => commands.some((c) => f.path.includes(`/${c.data.name}.`) || f.path.includes(`/${c.data.name}/SKILL.md`))).length;
        if (have < commands.length) err(`[${id}] expected ${commands.length} command files, found ${have} (${cmdOut.length}/${expected})`);
      }
    }
  } catch (e) { err(`build failed: ${e.message}`); }

  return { errors, warnings, stats };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { errors, warnings, stats } = await validate();
  console.log('Validation summary:', JSON.stringify(stats));
  warnings.forEach((w) => console.warn(`  warn: ${w}`));
  if (errors.length) {
    console.error(`\n${errors.length} error(s):`);
    errors.forEach((e) => console.error(`  ✗ ${e}`));
    process.exit(1);
  }
  console.log(`\n✓ All checks passed (${warnings.length} warning(s)).`);
}
