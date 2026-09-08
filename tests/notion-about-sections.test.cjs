const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const source = fs.readFileSync('src/lib/notion-about-sections.ts', 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } });
const context = { exports: {}, URL }; vm.runInNewContext(compiled.outputText, context);
const parse = context.exports.parseAboutSections;
const rich = text => ({ plain_text: text });
const block = (id, type, rich_text) => ({ id, type, [type]: { rich_text } });

test('Notion headings, rich text links, list items and unrelated content', () => {
  const result = JSON.parse(JSON.stringify(parse([
    block('ignored', 'paragraph', [rich('설명')]),
    block('h', 'heading_2', [rich('프로'), rich('젝트')]),
    block('p', 'paragraph', [rich('소개 '), { ...rich('프로젝트'), href: 'https://hunmogu.com/project/test?q=1#x' }, { ...rich('악성 링크'), href: 'javascript:alert(1)' }]),
    block('li', 'bulleted_list_item', [{ ...rich('굵은 글씨'), annotations: { bold: true } }]),
    block('other', 'heading_2', [rich('관리 메모')]), block('private', 'paragraph', [rich('사이트에 표시하지 않음')]),
    block('h2', 'heading_2', [rich('자격증')]), { ...block('deleted', 'paragraph', [rich('삭제됨')]), archived: true },
  ])));
  assert.equal(result.length, 2); assert.equal(result[0].paragraphs.length, 2);
  assert.equal(result[0].paragraphs[0].parts[1].href, '/project/test?q=1#x');
  assert.equal(result[0].paragraphs[0].parts[2].href, undefined);
  assert.equal(result[0].paragraphs[1].bulleted, true); assert.equal(result[0].paragraphs[1].parts[0].bold, true);
  assert.equal(result[1].paragraphs.length, 0);
});

test('live Notion API returns all migrated sections, text and links', { skip: process.env.RUN_NOTION_TESTS !== '1' }, async () => {
  const response = await fetch((process.env.TEST_BASE_URL || 'http://localhost:3000') + '/api/about-me/sections');
  assert.equal(response.status, 200);
  const data = await response.json();
  const seed = require('../scripts/data/about-notion-sections.json');
  assert.deepEqual(data.map(s => s.title), seed.map(s => s.title));
  data.forEach((section, i) => {
    assert.equal(section.paragraphs.length, seed[i].paragraphs.length);
    section.paragraphs.forEach((paragraph, j) => {
      assert.equal(paragraph.parts.map(p => p.text).join(''), seed[i].paragraphs[j].map(p => p.text).join(''));
      assert.deepEqual(paragraph.parts.filter(p => p.href).map(p => p.href), seed[i].paragraphs[j].filter(p => p.href).map(p => p.href));
    });
  });
});
