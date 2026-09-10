const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(fetch) {
  const source = fs.readFileSync('src/lib/sitemap-pages.ts', 'utf8');
  const context = { exports: {}, fetch, process: { env: {} } };
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, context);
  return context.exports.fetchSitemapPages;
}
const page = (id) => ({ object: 'page', id, last_edited_time: '2026-09-09T00:00:00.000Z' });
const ok = (body) => ({ ok: true, json: async () => body });

test('includes page 101 and passes the next cursor', async () => {
  const bodies = [];
  const fetchPages = load(async (_, options) => {
    bodies.push(JSON.parse(options.body));
    return ok(bodies.length === 1
      ? { results: Array.from({ length: 100 }, (_, i) => page(String(i))), has_more: true, next_cursor: 'next' }
      : { results: [page('100'), { ...page('archived'), archived: true }], has_more: false });
  });
  const pages = await fetchPages('db');
  assert.equal(pages.length, 101);
  assert.equal(pages[100].id, '100');
  assert.deepEqual(bodies, [{ page_size: 100 }, { page_size: 100, start_cursor: 'next' }]);
});
test('upstream error does not silently publish an empty sitemap', async () => {
  await assert.rejects(load(async () => ({ ok: false, status: 503 }))('db'), /503/);
});
test('rejects a repeated cursor instead of looping indefinitely', async () => {
  await assert.rejects(load(async () => ok({ results: [], has_more: true, next_cursor: 'same' }))('db'), /pagination/);
});
