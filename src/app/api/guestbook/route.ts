import { Client } from '@notionhq/client';
import { NextRequest, NextResponse } from 'next/server';

const database_id = 'cf6dea8440b04e5c85cf9bc986f546b7';

export async function GET(request: NextRequest) {
  const notion = new Client({
    auth: process.env.NOTION_API_KEY,
  });

  const cursor = request.nextUrl.searchParams.get('cursor');
  const page_size = +(request.nextUrl.searchParams.get('page_size') ?? '10');
  const sort = request.nextUrl.searchParams.get('sort') ?? 'descending';

  const guestBooks = await notion.databases.query({
    database_id,
    auth: process.env.NOTION_API_KEY,
    page_size,
    ...(!!cursor && { start_cursor: cursor }),
    sorts: [
      {
        property: 'createdAt',
        direction: sort === 'ascending' ? 'ascending' : 'descending',
      },
    ],
  });

  const returnObj = guestBooks.results.map((result: any) => {
    const id = result.id;
    const icon = result?.icon?.emoji ?? '🥳';
    const createdAt = result?.created_time;
    const title = result.properties.title.title[0].plain_text;
    const user = result.properties.user.rich_text[0].plain_text;
    const content = result.properties.content.rich_text[0].plain_text;

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
