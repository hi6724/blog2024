import { NextResponse } from 'next/server';
import { parseAboutSections, type AboutBlock } from '@/lib/notion-about-sections';

export const revalidate = 3600;
// AboutMeDB > 자기소개 상세. Override only if moving to a different page.
const DEFAULT_PAGE_ID = '3d521d41-62d4-8045-8329-d3d624e1482a';
export async function GET() {
  try {
    if (!process.env.NOTION_API_KEY) throw new Error('Missing Notion configuration');
    const pageId = process.env.NOTION_ABOUT_SECTIONS_PAGE_ID || DEFAULT_PAGE_ID;
    const blocks: AboutBlock[] = [];
    let cursor: string | null = null;
    do {
      const params = new URLSearchParams({ page_size: '100' });
      if (cursor) params.set('start_cursor', cursor);
      const response = await fetch(`https://api.notion.com/v1/blocks/${encodeURIComponent(pageId)}/children?${params}`, {
        headers: { Authorization: `Bearer ${process.env.NOTION_API_KEY}`, 'Notion-Version': '2022-06-28' },
        next: { revalidate: 3600 }, signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) throw new Error(`Notion returned ${response.status}`);
      const result = await response.json();
      if (!Array.isArray(result.results)) throw new Error('Invalid Notion response');
      blocks.push(...result.results);
      cursor = result.has_more ? result.next_cursor : null;
    } while (cursor);
    return NextResponse.json(parseAboutSections(blocks));
  } catch {
    return NextResponse.json({ error: '자기소개 항목을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.' }, { status: 503 });
  }
}
