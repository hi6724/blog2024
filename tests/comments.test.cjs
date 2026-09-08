const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const loaded = { exports: {} };
new Function('exports', ts.transpileModule(fs.readFileSync('src/lib/comments.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText)(loaded.exports);
const { normalizePostId, validateComment, normalizeComment, COMMENT_SELECT } = loaded.exports;

test('canonicalizes compact and dashed Notion page IDs to the same key', () => {
  const id = '19221d41-62d4-8047-b7b8-c17741580150';
  assert.equal(normalizePostId(id), id);
  assert.equal(normalizePostId(id.replaceAll('-', '').toUpperCase()), id);
  assert.throws(() => normalizePostId('invalid'));
});
test('rejects blank and oversized comments without discarding valid newlines', () => {
  assert.throws(() => validateComment('  \n'));
  assert.throws(() => validateComment('a'.repeat(2001)));
  assert.equal(validateComment(' hello\nworld '), 'hello\nworld');
});
test('public comment data never includes password fields, including joined arrays', () => {
  assert.ok(!COMMENT_SELECT.includes('password'));
  for (const user of [{ user_name: 'test', avatar: '🥳', password: 'secret' }, [{ user_name: 'test', avatar: '🥳', password: 'secret' }], null]) {
    const row = normalizeComment({ id: 'id', body: 'body', user, password: 'secret' });
    assert.ok(!JSON.stringify(row).includes('secret'));
    assert.equal(row.user?.user_name ?? null, user ? 'test' : null);
  }
});
