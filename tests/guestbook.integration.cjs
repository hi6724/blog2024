// Opt in with RUN_SUPABASE_TESTS=1. Requires the Next.js dev server on localhost:3000.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
require('@next/env').loadEnvConfig(process.cwd());
const { createClient } = require('@supabase/supabase-js');
const base = process.env.TEST_BASE_URL ?? 'http://localhost:3000';
async function call(path, method = 'GET', body) {
  const response = await fetch(`${base}/api/guestbook${path}`, { method, headers: { 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) });
  return { status: response.status, body: await response.json() };
}
test('guestbook API CRUD, password protection, count and cursor pagination', { skip: process.env.RUN_SUPABASE_TESTS !== '1' }, async () => {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const marker = `qa-guestbook-${randomUUID()}`;
  let id;
  try {
    const before = await call('/count');
    assert.equal(before.status, 200);
    const fields = { username: '이름 보존 테스트', title: marker, content: '본문\n줄바꿈', icon: '🥳', password: 'password' };
    const created = await call('', 'POST', fields);
    assert.equal(created.status, 201);
    id = created.body.id;
    assert.equal(created.body.result.username, fields.username);
    assert.ok(!JSON.stringify(created.body).includes('password'));
    assert.equal((await call('/count')).body, before.body + 1);
    const warmList = await call('?page_size=100');
    assert.equal(warmList.body.results.find(row => row.id === id).content, fields.content);
    const externalChange = await db.from('guestbook').update({ content: 'external test update' }).eq('id', id);
    assert.ifError(externalChange.error);
    assert.equal((await call('?page_size=100')).body.results.find(row => row.id === id).content, fields.content, 'warm list is served from the Next cache');
    assert.equal((await call(`/${id}`, 'PATCH', { ...fields, password: 'wrong', content: 'forbidden' })).status, 403);
    assert.equal((await call(`/${id}`, 'DELETE', { password: 'wrong' })).status, 403);
    assert.equal((await call(`/${id}`, 'DELETE', {})).status, 400);
    const updated = await call(`/${id}`, 'PATCH', { ...fields, username: '다른 이름', content: '수정 완료' });
    assert.equal(updated.status, 200);
    assert.equal(updated.body.result.username, fields.username);
    assert.equal(updated.body.result.content, '수정 완료');
    assert.equal((await call('?page_size=100')).body.results.find(row => row.id === id).content, '수정 완료');
    assert.equal((await call('/edit', 'POST', { ...fields, id, content: 'legacy edit refresh' })).status, 200);
    assert.equal((await call('?page_size=100')).body.results.find(row => row.id === id).content, 'legacy edit refresh');
    for (const sort of ['ascending', 'descending']) {
      let cursor; const ids = [];
      do {
        const page = await call(`?page_size=7&sort=${sort}${cursor ? `&cursor=${cursor}` : ''}`);
        assert.equal(page.status, 200);
        assert.ok(!JSON.stringify(page.body).includes('password_hash'));
        ids.push(...page.body.results.map(row => row.id));
        cursor = page.body.next_cursor;
      } while (cursor);
      assert.equal(new Set(ids).size, ids.length);
      assert.equal(ids.length, before.body + 1);
      assert.ok(ids.includes(id));
    }
    assert.equal((await call('?cursor=invalid')).status, 400);
    assert.equal((await call('?page_size=1000')).status, 400);
    assert.equal((await call(`/${id}`, 'DELETE', { password: 'password' })).status, 200);
    assert.equal((await call(`/${id}`, 'DELETE', { password: 'password' })).status, 404);
    assert.equal((await call('/count')).body, before.body);
    assert.ok(!(await call('?page_size=100')).body.results.some(row => row.id === id));
    const anon = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { auth: { persistSession: false } });
    const result = await anon.from('guestbook').select('password_hash').limit(1);
    assert.ok(result.error || !result.data?.length);
  } finally {
    const result = await db.from('guestbook').delete().eq('title', marker);
    assert.ifError(result.error);
  }
});
