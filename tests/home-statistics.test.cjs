const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const loaded = { exports: {} };
new Function('exports', ts.transpileModule(fs.readFileSync('src/lib/fetch-statistic.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText)(loaded.exports);
const { fetchStatistic } = loaded.exports;

test('home statistics preserve valid zero and isolate upstream failures', async (t) => {
  t.mock.method(console, 'error', () => {});
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.ok(options.signal instanceof AbortSignal);
    switch (new URL(url).pathname) {
      case '/zero': return Response.json(0);
      case '/count': return Response.json(23);
      case '/error': return new Response('<!DOCTYPE html>Error', { status: 500 });
      case '/html': return new Response('<!DOCTYPE html>Login', { headers: { 'content-type': 'text/html' } });
      case '/malformed': return new Response('{', { headers: { 'content-type': 'application/json' } });
      case '/object': return Response.json({ error: 'upstream failure' });
      case '/null': return Response.json(null);
      case '/negative': return Response.json(-1);
      case '/timeout': throw new DOMException('Timed out', 'TimeoutError');
      default: throw new Error('Network failure');
    }
  });
  const paths = ['zero', 'count', 'error', 'html', 'malformed', 'object', 'null', 'negative', 'timeout', 'network'];
  assert.deepEqual(await Promise.all(paths.map(p => fetchStatistic(`https://example.test/${p}`))),
    [0, 23, null, null, null, null, null, null, null, null]);
});
