import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseFrontmatter, rewriteLinks, extractLinks, ROOT, BLOCK_START, BLOCK_END } from '../scripts/lib.mjs';
import { mergeBlock, stripBlock, install, uninstall } from '../scripts/install.mjs';
import { verifyInstall } from '../scripts/verify-install.mjs';
import { validate } from '../scripts/validate.mjs';

test('parseFrontmatter handles scalars, inline arrays and block lists', () => {
  const { data, body } = parseFrontmatter('---\nname: x\nglobs: ["a/*.ts", "b"]\nstandards:\n  - one\n  - two\ndescription: "Hi: there"\n---\n# Body\n');
  assert.equal(data.name, 'x');
  assert.deepEqual(data.globs, ['a/*.ts', 'b']);
  assert.deepEqual(data.standards, ['one', 'two']);
  assert.equal(data.description, 'Hi: there');
  assert.match(body, /# Body/);
});

test('parseFrontmatter returns null data without frontmatter', () => {
  assert.equal(parseFrontmatter('# nope').data, null);
});

test('rewriteLinks rewrites internal links but not fenced code, external links or anchors-only', () => {
  const src = path.join(ROOT, 'commands/development/review.md');
  const out = rewriteLinks('[a](../../standards/coding/clean-code.md#x)\n```\n[b](../../standards/coding/clean-code.md)\n```\n[c](https://example.com) [d](#top)', src);
  assert.match(out, /\[a\]\(\.engineering-standards\/standards\/coding\/clean-code\.md#x\)/);
  assert.match(out, /\[b\]\(\.\.\/\.\.\/standards/);
  assert.match(out, /\(https:\/\/example\.com\)/);
  assert.match(out, /\(#top\)/);
});

test('extractLinks ignores fences, inline code and external links', () => {
  const links = extractLinks('[a](x.md)\n`[b](y.md)`\n```\n[c](z.md)\n```\n[d](http://e.com)');
  assert.deepEqual(links, ['x.md']);
});

test('mergeBlock appends, replaces and preserves user content; stripBlock reverses', () => {
  const block = `${BLOCK_START}\nA\n${BLOCK_END}\n`;
  const first = mergeBlock('# Mine\n', block);
  assert.ok(first.startsWith('# Mine'));
  assert.ok(first.includes('A'));
  const second = mergeBlock(first, `${BLOCK_START}\nB\n${BLOCK_END}\n`);
  assert.ok(second.includes('B') && !second.includes('\nA\n'));
  assert.equal(second.split(BLOCK_START).length, 2);
  assert.equal(stripBlock(second).trim(), '# Mine');
  assert.equal(stripBlock(mergeBlock('', block)), '');
});

test('install → verify → modify-skip → uninstall round trip', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'es-'));
  const quiet = () => {};
  try {
    fs.writeFileSync(path.join(dir, 'AGENTS.md'), '# Mine\n');
    await install({ ides: ['codex', 'cursor'], target: dir, log: quiet });
    assert.ok(fs.existsSync(path.join(dir, '.agents/skills/review/SKILL.md')));
    assert.ok(fs.existsSync(path.join(dir, '.cursor/commands/review.md')));
    assert.ok(fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8').startsWith('# Mine'));
    assert.equal(verifyInstall(dir).ok, true);

    const edited = path.join(dir, '.cursor/commands/review.md');
    fs.appendFileSync(edited, '\nmy edit\n');
    const again = await install({ ides: ['cursor'], target: dir, log: quiet });
    assert.ok(again.skipped.includes('.cursor/commands/review.md'));
    assert.ok(fs.readFileSync(edited, 'utf8').includes('my edit'));

    uninstall({ target: dir, log: quiet });
    assert.ok(fs.existsSync(edited), 'modified file is kept');
    assert.equal(fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8').trim(), '# Mine');
    assert.ok(!fs.existsSync(path.join(dir, '.agents')));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('dry run writes nothing', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'es-'));
  try {
    await install({ ides: ['claude-code'], target: dir, dryRun: true, log: () => {} });
    assert.deepEqual(fs.readdirSync(dir), []);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('the repository itself validates cleanly', async () => {
  const { errors } = await validate();
  assert.deepEqual(errors, []);
});
