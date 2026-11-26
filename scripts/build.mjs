#!/usr/bin/env node
// Generates dist/<ide>/ trees plus dist/shared/.engineering-standards/ from the canonical sources.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  ROOT, IDES, INSTALL_DIR, read, loadCommands, loadRules, loadSkills,
  renderIndex, walk, rel,
} from './lib.mjs';

export async function loadAdapter(id) {
  return import(pathToFileURL(path.join(ROOT, 'adapters', id, 'adapter.mjs')).href);
}

export function readVersion() {
  return JSON.parse(read(path.join(ROOT, 'package.json'))).version;
}

/** Returns { shared: [{path, content}], ides: { id: [{path, content?, block?, limit?}] } } without touching disk. */
export async function buildAll() {
  const version = readVersion();
  const commands = loadCommands();
  const skills = loadSkills();
  const rules = loadRules();
  const ctx = { commands, skills, rules, version };

  const shared = [];
  for (const dir of ['standards', 'checklists', 'templates', 'rules']) {
    for (const f of walk(path.join(ROOT, dir), (p) => p.endsWith('.md'))) {
      shared.push({ path: `${INSTALL_DIR}/${rel(f)}`, content: read(f) });
    }
  }
  shared.push({ path: `${INSTALL_DIR}/INDEX.md`, content: renderIndex({ version, commands, skills }) });
  shared.push({ path: `${INSTALL_DIR}/VERSION`, content: version + '\n' });

  const ides = {};
  for (const id of IDES) {
    const adapter = await loadAdapter(id);
    ides[id] = adapter.generate(ctx);
  }
  return { version, shared, ides };
}

function writeFile(base, p, content) {
  const full = path.join(base, p);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

export async function writeDist(outDir = path.join(ROOT, 'dist')) {
  const built = await buildAll();
  fs.rmSync(outDir, { recursive: true, force: true });
  for (const f of built.shared) writeFile(path.join(outDir, 'shared'), f.path, f.content);
  for (const [id, files] of Object.entries(built.ides)) {
    for (const f of files) writeFile(path.join(outDir, id), f.path, f.content ?? f.block);
  }
  return built;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const built = await writeDist();
  const counts = Object.entries(built.ides).map(([id, f]) => `${id}: ${f.length} files`).join(', ');
  console.log(`Built engineering-standards v${built.version}`);
  console.log(`  shared: ${built.shared.length} files`);
  console.log(`  ${counts}`);
}
