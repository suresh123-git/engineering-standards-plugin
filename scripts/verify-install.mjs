#!/usr/bin/env node
// Verifies an installed project: manifest present, files intact, blocks present, links resolve.
//   node scripts/verify-install.mjs --target /path/to/project
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { INSTALL_DIR, BLOCK_START, BLOCK_END, sha256, extractLinks } from './lib.mjs';

export function verifyInstall(target) {
  const problems = [];
  const mp = path.join(target, INSTALL_DIR, '.install.json');
  if (!fs.existsSync(mp)) return { ok: false, problems: [`missing ${INSTALL_DIR}/.install.json — nothing installed?`], checked: 0 };
  const m = JSON.parse(fs.readFileSync(mp, 'utf8'));
  let checked = 0;
  for (const [p, hash] of Object.entries(m.files)) {
    checked++;
    const full = path.join(target, p);
    if (!fs.existsSync(full)) { problems.push(`missing: ${p}`); continue; }
    if (sha256(fs.readFileSync(full, 'utf8')) !== hash) problems.push(`modified since install: ${p}`);
    if ((p.endsWith('.md') || p.endsWith('.mdc')) && !p.startsWith(`${INSTALL_DIR}/templates/`)) {
      for (const link of extractLinks(fs.readFileSync(full, 'utf8'))) {
        const file = link.split('#')[0];
        if (!file) continue;
        const resolved = file.startsWith(INSTALL_DIR) ? path.join(target, file) : path.resolve(path.dirname(full), file);
        if (!file.startsWith(INSTALL_DIR) && !resolved.startsWith(target)) continue;
        if (!fs.existsSync(resolved)) problems.push(`broken link in ${p}: ${link}`);
      }
    }
  }
  for (const p of m.blocks || []) {
    checked++;
    const full = path.join(target, p);
    if (!fs.existsSync(full)) { problems.push(`missing: ${p}`); continue; }
    const t = fs.readFileSync(full, 'utf8');
    if (!t.includes(BLOCK_START) || !t.includes(BLOCK_END)) problems.push(`managed block missing in ${p}`);
  }
  return { ok: problems.length === 0, problems, checked, version: m.version, ides: m.ides };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const i = process.argv.indexOf('--target');
  const target = path.resolve(i > -1 ? process.argv[i + 1] : process.cwd());
  const r = verifyInstall(target);
  if (r.ok) console.log(`OK — engineering-standards v${r.version} (${r.ides.join(', ')}); ${r.checked} entries verified in ${target}`);
  else { console.error(`FAILED (${r.problems.length} problem(s)):`); r.problems.forEach((p) => console.error(`  - ${p}`)); process.exit(1); }
}
