#!/usr/bin/env node
// Installs the generated toolkit into a project.
//   node scripts/install.mjs --ide claude-code,cursor --target /path/to/project [--dry-run] [--force]
//   node scripts/install.mjs --ide all --target . --uninstall
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { pathToFileURL } from 'node:url';
import { buildAll } from './build.mjs';
import { IDES, INSTALL_DIR, BLOCK_START, BLOCK_END, sha256 } from './lib.mjs';

const MANIFEST = `${INSTALL_DIR}/.install.json`;

export function mergeBlock(existing, block) {
  const b = block.trimEnd() + '\n';
  if (!existing || !existing.trim()) return b;
  const s = existing.indexOf(BLOCK_START);
  const e = existing.indexOf(BLOCK_END);
  if (s !== -1 && e > s) {
    return existing.slice(0, s) + b.trimEnd() + existing.slice(e + BLOCK_END.length);
  }
  return existing.replace(/\s*$/, '\n\n') + b;
}

export function stripBlock(existing) {
  const s = existing.indexOf(BLOCK_START);
  const e = existing.indexOf(BLOCK_END);
  if (s === -1 || e < s) return existing;
  const out = (existing.slice(0, s).replace(/\s*$/, '') + '\n' + existing.slice(e + BLOCK_END.length).replace(/^\s*/, '')).trim();
  return out ? out + '\n' : '';
}

export function parseArgs(argv) {
  const a = { ide: null, target: process.cwd(), dryRun: false, force: false, uninstall: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--ide') a.ide = argv[++i];
    else if (k === '--target') a.target = path.resolve(argv[++i]);
    else if (k === '--dry-run') a.dryRun = true;
    else if (k === '--force') a.force = true;
    else if (k === '--uninstall') a.uninstall = true;
    else if (k === '-h' || k === '--help') a.help = true;
    else throw new Error(`Unknown argument: ${k}`);
  }
  return a;
}

const HELP = `engineering-standards installer

Usage: node scripts/install.mjs [--ide <list|all>] [--target <dir>] [--dry-run] [--force] [--uninstall]

  --ide        comma-separated: ${IDES.join(', ')} (or "all"). Prompts if omitted in a terminal.
  --target     project directory (default: current directory)
  --dry-run    show what would change, write nothing
  --force      overwrite files you modified / remove modified files on uninstall
  --uninstall  remove files installed by this toolkit (uses ${MANIFEST})
`;

async function chooseIdes(arg) {
  if (arg) {
    const list = arg === 'all' ? IDES : arg.split(',').map((s) => s.trim()).filter(Boolean);
    const bad = list.filter((x) => !IDES.includes(x));
    if (bad.length) throw new Error(`Unknown IDE(s): ${bad.join(', ')}. Valid: ${IDES.join(', ')}`);
    return list;
  }
  if (!process.stdin.isTTY) throw new Error('No --ide given and no terminal available. Use --ide <list|all>.');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  IDES.forEach((id, i) => console.log(`  ${i + 1}) ${id}`));
  const ans = await rl.question('Select IDEs (numbers separated by commas, or "all"): ');
  rl.close();
  if (ans.trim() === 'all') return IDES;
  const picked = ans.split(',').map((n) => IDES[Number(n.trim()) - 1]).filter(Boolean);
  if (!picked.length) throw new Error('No valid selection.');
  return picked;
}

function readManifest(target) {
  try { return JSON.parse(fs.readFileSync(path.join(target, MANIFEST), 'utf8')); } catch { return null; }
}

function removeEmptyDirs(dir, stop) {
  while (dir.startsWith(stop) && dir !== stop) {
    try { fs.rmdirSync(dir); } catch { return; }
    dir = path.dirname(dir);
  }
}

export async function install({ ides, target, dryRun = false, force = false, log = console.log }) {
  const built = await buildAll();
  const prev = readManifest(target);
  const owned = prev?.files || {};
  const manifest = {
    version: built.version,
    ides: [...new Set([...(prev?.ides || []), ...ides])],
    files: { ...owned },
    blocks: [...(prev?.blocks || [])],
  };
  const result = { written: [], unchanged: [], skipped: [], blocks: [] };
  const plan = [...built.shared];
  for (const id of ides) plan.push(...built.ides[id]);

  for (const f of plan) {
    const dest = path.join(target, f.path);
    const exists = fs.existsSync(dest);
    const current = exists ? fs.readFileSync(dest, 'utf8') : null;

    if (f.block) {
      const merged = mergeBlock(current, f.block);
      if (merged === current) result.unchanged.push(f.path);
      else {
        result.blocks.push(f.path);
        if (!dryRun) { fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, merged); }
      }
      if (!manifest.blocks.includes(f.path)) manifest.blocks.push(f.path);
      continue;
    }

    if (current === f.content) { result.unchanged.push(f.path); manifest.files[f.path] = sha256(f.content); continue; }
    const mine = exists && owned[f.path] && owned[f.path] === sha256(current);
    if (exists && !mine && !force) { result.skipped.push(f.path); continue; }
    if (!dryRun) { fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, f.content); }
    result.written.push(f.path);
    manifest.files[f.path] = sha256(f.content);
  }

  if (!dryRun) {
    const mp = path.join(target, MANIFEST);
    fs.mkdirSync(path.dirname(mp), { recursive: true });
    fs.writeFileSync(mp, JSON.stringify(manifest, null, 2) + '\n');
  }
  log(`${dryRun ? '[dry-run] ' : ''}engineering-standards v${built.version} → ${target}`);
  log(`  IDEs: ${ides.join(', ')}`);
  log(`  written: ${result.written.length}, merged blocks: ${result.blocks.length}, unchanged: ${result.unchanged.length}, skipped (yours): ${result.skipped.length}`);
  for (const s of result.skipped) log(`  skipped (exists, not installed by toolkit; use --force): ${s}`);
  return result;
}

export function uninstall({ target, dryRun = false, force = false, log = console.log }) {
  const m = readManifest(target);
  if (!m) throw new Error(`No ${MANIFEST} found in ${target}; nothing to uninstall.`);
  const removed = [], kept = [];
  for (const [p, hash] of Object.entries(m.files)) {
    const full = path.join(target, p);
    if (!fs.existsSync(full)) continue;
    if (!force && sha256(fs.readFileSync(full, 'utf8')) !== hash) { kept.push(p); continue; }
    if (!dryRun) { fs.rmSync(full); removeEmptyDirs(path.dirname(full), target); }
    removed.push(p);
  }
  for (const p of m.blocks || []) {
    const full = path.join(target, p);
    if (!fs.existsSync(full)) continue;
    const text = fs.readFileSync(full, 'utf8');
    const stripped = stripBlock(text);
    if (stripped === text) continue;
    if (!dryRun) {
      if (stripped.trim()) fs.writeFileSync(full, stripped);
      else { fs.rmSync(full); removeEmptyDirs(path.dirname(full), target); }
    }
    removed.push(`${p} (managed block)`);
  }
  if (!dryRun) {
    fs.rmSync(path.join(target, MANIFEST), { force: true });
    removeEmptyDirs(path.join(target, INSTALL_DIR), target);
  }
  log(`${dryRun ? '[dry-run] ' : ''}uninstalled: ${removed.length} removed, ${kept.length} kept (modified by you; use --force)`);
  for (const k of kept) log(`  kept: ${k}`);
  return { removed, kept };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) { console.log(HELP); process.exit(0); }
    if (!fs.existsSync(args.target)) throw new Error(`Target does not exist: ${args.target}`);
    if (args.uninstall) uninstall(args);
    else await install({ ...args, ides: await chooseIdes(args.ide) });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}
