// Copies active Notion guestbook pages. Existing migrated rows are never overwritten.
require('@next/env').loadEnvConfig(process.cwd());
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const text = (items = []) => items.map(item => item.plain_text ?? item.text?.content ?? '').join('');
async function main() {
  let cursor;
  const pages = [];
  do {
    const response = await fetch('https://api.notion.com/v1/databases/cf6dea8440b04e5c85cf9bc986f546b7/query', {
      method: 'POST', headers: { Authorization: `Bearer ${process.env.NOTION_API_KEY}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_size: 100, ...(cursor ? { start_cursor: cursor } : {}) }),
    });
    if (!response.ok) throw new Error(`Notion query failed: ${response.status}`);
    const result = await response.json();
    pages.push(...result.results);
    cursor = result.has_more ? result.next_cursor : null;
  } while (cursor);
  // Local private snapshot, never committed.
  const snapshot = `/tmp/blog2024-guestbook-${Date.now()}.json`;
  fs.writeFileSync(snapshot, JSON.stringify(pages), { mode: 0o600 });
  const rows = [];
  for (const page of pages) rows.push({
    id: page.id, notion_page_id: page.id,
    username: text(page.properties.username?.rich_text),
    title: text(page.properties.title?.title), content: text(page.properties.content?.rich_text),
    icon: page.icon?.emoji ?? '🥳', source_user_id: text(page.properties.userId?.rich_text),
    password_hash: await bcrypt.hash('password', 12),
    created_at: page.created_time, updated_at: page.last_edited_time,
  });
  let imported = 0;
  for (let start = 0; start < rows.length; start += 100) {
    const batch = rows.slice(start, start + 100);
    const { data, error } = await db.from('guestbook').upsert(batch, { onConflict: 'notion_page_id', ignoreDuplicates: true }).select('id');
    if (error) throw error;
    imported += data.length;
    const check = await db.from('guestbook').select('*').in('notion_page_id', batch.map(row => row.notion_page_id));
    if (check.error) throw check.error;
    assert.equal(check.data.length, batch.length);
    for (const expected of batch) {
      const actual = check.data.find(row => row.notion_page_id === expected.notion_page_id);
      for (const field of ['id', 'username', 'title', 'content', 'icon', 'source_user_id']) assert.equal(actual[field], expected[field], `${expected.id}: ${field}`);
      assert.equal(Date.parse(actual.created_at), Date.parse(expected.created_at));
      assert.equal(Date.parse(actual.updated_at), Date.parse(expected.updated_at));
      assert.ok(await bcrypt.compare('password', actual.password_hash), 'Imported password mismatch');
    }
  }
  console.log(JSON.stringify({ sourceCount: rows.length, inserted: imported, verified: rows.length, snapshot }));
}
main().catch(error => { console.error(error.message ?? 'Migration failed'); process.exitCode = 1; });
