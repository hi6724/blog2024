// Opt-in: creates isolated test rows in the configured Supabase, then removes only those rows.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const { randomUUID } = require('node:crypto');
require('@next/env').loadEnvConfig(process.cwd());
const { createClient } = require('@supabase/supabase-js');

function load(path, overrides = {}) {
  const m = { exports: {} };
  const js = ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  new Function('require', 'exports', 'module', js)((name) => name in overrides ? overrides[name] : require(name), m.exports, m);
  return m.exports;
}

test('Supabase saves, isolates, reloads and protects page comments', { skip: process.env.RUN_SUPABASE_TESTS !== '1' }, async () => {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const testCache = require('./helpers/next-cache.cjs')();
  const uncachedActions = load('src/app/action.ts', {
    '@/lib/comments': load('src/lib/comments.ts'),
    '@/lib/supabase/admin': load('src/lib/supabase/admin.ts', { 'server-only': {} }),
    'next/cache': testCache.api,
    '@/lib/cache-policy': load('src/lib/cache-policy.ts'),
  });
  const actions = Object.fromEntries(Object.entries(uncachedActions).map(([name, fn]) => [name, (...args) => testCache.run(() => fn(...args))]));
  const counts = load('src/lib/comment-counts.ts', {
    'server-only': {}, 'next/cache': testCache.api,
    '@/lib/comments': load('src/lib/comments.ts'),
    '@/lib/cache-policy': load('src/lib/cache-policy.ts'),
    '@/lib/supabase/admin': load('src/lib/supabase/admin.ts', { 'server-only': {} }),
  });
  const pageA = randomUUID();
  const pageB = randomUUID();
  const credentials = { userName: `qa${randomUUID().slice(0, 8)}`, password: randomUUID(), avatar: '🥳' };
  const other = { ...credentials, userName: `qa${randomUUID().slice(0, 8)}` };
  try {
    assert.equal((await actions.getComment({ id: pageA })).length, 0);
    assert.equal((await testCache.run(() => counts.getCommentCounts([pageA, pageB])))[pageA], 0);
    const first = await actions.createComment({ ...credentials, postId: pageA.replaceAll('-', ''), body: 'isolated integration test A' });
    const second = await actions.createComment({ ...credentials, postId: pageB, body: 'isolated integration test B' });
    assert.equal((await testCache.run(() => counts.getCommentCounts([pageA, pageB])))[pageA], 1);
    assert.equal(first.post_id, pageA);
    assert.equal(first.user.user_name, credentials.userName);
    assert.ok(!JSON.stringify(first).includes('password'));
    assert.deepEqual((await actions.getComment({ id: pageA })).map(row => row.id), [first.id]);
    assert.deepEqual((await actions.getComment({ id: pageB })).map(row => row.id), [second.id]);
    const rawUpdate = await db.from('comment').update({ body: 'DB change outside the app' }).eq('id', first.id);
    assert.ifError(rawUpdate.error);
    assert.equal((await actions.getComment({ id: pageA }))[0].body, first.body, 'warm read comes from the real Next cache');
    await assert.rejects(actions.createComment({ ...credentials, password: 'wrong', postId: pageA, body: 'must not save' }));
    await assert.rejects(actions.createComment({ ...credentials, postId: pageA, body: '  ' }));
    assert.equal((await actions.createUser(other)).ok, true);
    await assert.rejects(actions.updateComment({ ...other, id: first.id, body: 'forbidden' }));
    await assert.rejects(actions.deleteComment({ ...other, id: first.id }));
    await assert.rejects(actions.updateComment({ ...credentials, password: 'wrong', id: first.id, body: 'forbidden' }));
    await assert.rejects(actions.deleteComment({ ...credentials, password: 'wrong', id: first.id }));
    assert.equal((await actions.getComment({ id: pageA }))[0].body, first.body);
    assert.equal((await actions.updateComment({ ...credentials, id: first.id, body: 'updated test' })).body, 'updated test');
    assert.equal((await actions.getComment({ id: pageA }))[0].body, 'updated test');
    await actions.deleteComment({ ...credentials, id: first.id });
    await assert.rejects(actions.deleteComment({ ...credentials, id: first.id }));
    assert.equal((await actions.getComment({ id: pageA })).length, 0);
    assert.equal((await testCache.run(() => counts.getCommentCounts([pageA, pageB])))[pageA], 0);
    assert.equal((await actions.getComment({ id: pageB })).length, 1);
  } finally {
    const comments = await db.from('comment').delete().in('post_id', [pageA, pageB]);
    assert.ifError(comments.error);
    const users = await db.from('user').delete().in('user_name', [credentials.userName, other.userName]);
    assert.ifError(users.error);
    testCache.cleanup();
  }
});
