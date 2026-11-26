#!/usr/bin/env node
// Generates plugins/moonlight/ and .claude-plugin/marketplace.json (committed outputs).
//   node scripts/build-plugin.mjs           write
//   node scripts/build-plugin.mjs --check   exit 1 if committed output is out of date
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, walk, loadCommands, loadRules, loadSkills } from './lib.mjs';
import { readVersion } from './build.mjs';
import { generate, marketplace, meta } from '../adapters/claude-plugin/adapter.mjs';

export function planPlugin() {
  const version = readVersion();
  const files = generate({ commands: loadCommands(), skills: loadSkills(), rules: loadRules(), version });
  const plan = files.map((f) => ({ path: `${meta.outDir}/${f.path}`, content: f.content }));
  plan.push({ path: '.claude-plugin/marketplace.json', content: marketplace(version) });
  return plan;
}

export function checkPlugin() {
  const plan = planPlugin();
  const problems = [];
  const expected = new Set(plan.map((f) => f.path));
  for (const f of plan) {
    const full = path.join(ROOT, f.path);
    if (!fs.existsSync(full)) problems.push(`missing: ${f.path}`);
    else if (fs.readFileSync(full, 'utf8') !== f.content) problems.push(`out of date: ${f.path}`);
  }
  for (const f of walk(path.join(ROOT, meta.outDir))) {
    const r = path.relative(ROOT, f).split(path.sep).join('/');
    if (!expected.has(r)) problems.push(`stale file: ${r}`);
  }
  return problems;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv.includes('--check')) {
    const problems = checkPlugin();
    if (problems.length) {
      console.error(`Plugin output is out of date (run "npm run build:plugin"):`);
      problems.slice(0, 20).forEach((p) => console.error(`  - ${p}`));
      process.exit(1);
    }
    console.log('Plugin output is up to date.');
  } else {
    fs.rmSync(path.join(ROOT, meta.outDir), { recursive: true, force: true });
    const plan = planPlugin();
    for (const f of plan) {
      const full = path.join(ROOT, f.path);
      fs.mkdirSync(path.dirname(full), { recursive: true });
      fs.writeFileSync(full, f.content);
    }
    console.log(`Plugin built: ${plan.length} files → ${meta.outDir}/ (+ .claude-plugin/marketplace.json)`);
  }
}
