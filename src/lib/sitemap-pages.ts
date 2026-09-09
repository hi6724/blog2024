type SitemapPage = { id: string; lastEditedTime: string };

// Follow every cursor: Notion returns at most 100 pages per response.
export async function fetchSitemapPages(databaseId: string): Promise<SitemapPage[]> {
  const pages: SitemapPage[] = [];
  let cursor: string | undefined;
  const seenCursors = new Set<string>();

  do {
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({ page_size: 100, ...(cursor ? { start_cursor: cursor } : {}) }),
      next: { revalidate: 3600 },
    });
    if (!response.ok) throw new Error(`Sitemap query failed (${response.status})`);
    const data = await response.json();
    if (!Array.isArray(data.results)) throw new Error('Invalid sitemap query response');
    for (const page of data.results) {
      if (page.object === 'page' && !page.archived && !page.in_trash) {
        pages.push({ id: page.id, lastEditedTime: page.last_edited_time });
      }
    }
    if (!data.has_more) break;
    const nextCursor: unknown = data.next_cursor;
    if (typeof nextCursor !== 'string' || !nextCursor || seenCursors.has(nextCursor)) {
      throw new Error('Invalid sitemap pagination cursor');
    }
    cursor = nextCursor;
    seenCursors.add(nextCursor);
  } while (cursor);

  return pages;
}
