import { notionClient } from '@/lib/notion';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const database_id = 'cf6dea8440b04e5c85cf9bc986f546b7';

export async function GET(request: NextRequest) {
  const cursor = request.nextUrl.searchParams.get('cursor');
  const page_size = +(request.nextUrl.searchParams.get('page_size') ?? '10');
  const sort = request.nextUrl.searchParams.get('sort') ?? 'descending';

  const guestBooks = await (
    await fetch(`https://api.notion.com/v1/databases/${database_id}/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        page_size,
        ...(!!cursor && { start_cursor: cursor }),
        sorts: [
          {
            property: 'createdAt',
            direction: sort === 'ascending' ? 'ascending' : 'descending',
          },
        ],
      }),
      next: { revalidate: 3600 },
    })
  ).json();

  const returnObj = guestBooks.results.map((result: any) => {
    const id = result.id;
    const icon = result?.icon?.emoji ?? '🥳';
    const createdAt = result?.created_time;
    const title = result?.properties?.title?.title?.[0]?.plain_text;
    const user = result.properties?.user?.rich_text?.[0]?.plain_text;
    const content = result.properties?.content?.rich_text?.[0]?.plain_text;

    return {
      id,
      icon,
      title,
      createdAt,
      content,
      user: JSON.parse(user),
    };
  });
  return NextResponse.json({
    next_cursor: guestBooks.next_cursor,
    has_more: guestBooks.has_more,
    results: returnObj,
  });
}

export async function POST(request: NextRequest) {
  const { title, content, user, icon } = await request.json();
  revalidatePath('/api/guestbook');
  notionClient.pages.create({
    parent: { database_id },
    icon: { emoji: icon },
    properties: {
      title: { title: [{ text: { content: title } }] },
      content: { rich_text: [{ text: { content } }] },
      user: { rich_text: [{ text: { content: JSON.stringify(user) } }] },
    },
  });
  return NextResponse.json({ ok: true });
}
