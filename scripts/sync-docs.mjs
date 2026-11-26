#!/usr/bin/env node
// Regenerates the command and skill tables in README.md between the marker comments.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, COMMAND_CATEGORIES, loadCommands, loadSkills } from './lib.mjs';

const file = path.join(ROOT, 'README.md');
let text = fs.readFileSync(file, 'utf8');
const commands = loadCommands();
const skills = loadSkills();

const cmdLines = [];
for (const cat of COMMAND_CATEGORIES) {
  const list = commands.filter((c) => c.data.category === cat).sort((a, b) => a.data.name.localeCompare(b.data.name));
  if (!list.length) continue;
  cmdLines.push(`#### ${cat[0].toUpperCase()}${cat.slice(1)}`, '', '| Command | Mode | What it does |', '|---|---|---|');
  for (const c of list) cmdLines.push(`| \`/${c.data.name}\` | ${c.data.mode} | ${c.data.description} |`);
  cmdLines.push('');
}
const skillLines = ['| Skill | Type | Use when |', '|---|---|---|'];
for (const s of skills) skillLines.push(`| \`${s.data.name}\` | ${s.data.category} | ${s.data.description} |`);

const swap = (t, tag, body) =>
  t.replace(new RegExp(`(<!-- ${tag}:start -->)[\\s\\S]*?(<!-- ${tag}:end -->)`), `$1\n${body}\n$2`);
text = swap(text, 'commands', cmdLines.join('\n'));
text = swap(text, 'skills', skillLines.join('\n'));
fs.writeFileSync(file, text);
console.log(`README tables synced: ${commands.length} commands, ${skills.length} skills`);
