import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import ts from 'typescript';
import * as notionUtils from 'notion-utils';
import pMap from 'p-map';

// Load the TypeScript client without adding a test runner dependency.
const compiled = ts.transpileModule(fs.readFileSync('src/notion-api.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
}).outputText;
const clientModule = { exports: {} };
new Function('require', 'module', 'exports', compiled)((name) => ({ 'notion-utils': notionUtils, 'p-map': pMap })[name], clientModule, clientModule.exports);
const { MyNotionAPI } = clientModule.exports;
const pageId = '19221d41-62d4-8047-b7b8-c17741580150';
const childId = '26121d41-62d4-8029-91d4-f3d04f419ed1';
const page = { id: pageId, type: 'page', content: [childId], properties: { title: [['Title']] } };
const wrapped = (value) => ({ spaceId: 'space', value: { value, role: 'reader' } });

test('normalizes new records from initial and missing-block responses', async (t) => {
  const endpoints = [];
  t.mock.method(global, 'fetch', async (url) => {
    endpoints.push(url);
    return Response.json(url.endsWith('loadPageChunk') ? {
      recordMap: { block: { [pageId]: wrapped(page) }, collection: { collection: wrapped({ schema: {} }) } },
    } : { recordMap: { block: { [childId]: wrapped({ id: childId, type: 'text', properties: { title: [['Body']] } }) } } });
  });
  const result = await new MyNotionAPI().getPage(pageId);
  assert.equal(result.block[pageId].value.type, 'page');
  assert.equal(result.block[pageId].role, 'reader');
  assert.equal(result.block[childId].value.type, 'text');
  assert.deepEqual(result.collection.collection.value.schema, {});
  assert.deepEqual(endpoints, ['https://app.notion.com/api/v3/loadPageChunk', 'https://app.notion.com/api/v3/syncRecordValues']);
});

test('preserves legacy records and stops retrying inaccessible child blocks', async (t) => {
  let calls = 0;
  t.mock.method(global, 'fetch', async () => {
    calls++;
    assert.ok(calls <= 2, 'missing blocks must not cause an infinite loop');
    return Response.json({ recordMap: { block: calls === 1 ? { [pageId]: { value: page, role: 'reader' } } : {} } });
  });
  const result = await new MyNotionAPI().getPage(pageId);
  assert.deepEqual(result.block[pageId].value, page);
  assert.equal(calls, 2);
});

test('reports HTTP failures before attempting to parse HTML', async (t) => {
  t.mock.method(global, 'fetch', async () => new Response('<html>Forbidden</html>', { status: 403 }));
  await assert.rejects(new MyNotionAPI().getPage(pageId), /Notion API loadPageChunk failed \(403\)/);
});
