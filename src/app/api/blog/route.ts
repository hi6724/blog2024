import { Client } from '@notionhq/client';
import { NextRequest, NextResponse } from 'next/server';

const database_id = '8a3bdeb10ce94834a5ba6a8476f4d43c';

export async function GET(request: NextRequest) {
  const notion = new Client({
    auth: process.env.NOTION_API_KEY,
  });

  const cursor = request.nextUrl.searchParams.get('cursor');
  const page_size = +(request.nextUrl.searchParams.get('page_size') ?? '10');
  const sort = request.nextUrl.searchParams.get('sort') ?? 'descending';
  const filter = request.nextUrl.searchParams.get('filter') ?? 'all';

  const page = await notion.databases.query({
    auth: process.env.NOTION_API_KEY,
    database_id,
    page_size,
    sorts: [
      {
        property: 'createdAt',
        direction: sort === 'ascending' ? 'ascending' : 'descending',
      },
    ],
    ...(!!cursor && { start_cursor: cursor }),
    ...(filter !== 'all' && {
      filter: {
        and: [
          {
            property: 'type',
            select: { equals: filter },
          },
        ],
      },
    }),
  });

  const returnObj = page.results.map((result: any) => {
    const id = result.id;
    const createdAt = result.properties?.createdAt?.created_time;
    const iconType = result.icon?.type;
    const icon = result.icon[iconType] ?? '🥳';
    const tags = result.properties?.type['multi_select'].map((el: any) => el.name);
    const title = result.properties?.name?.title?.[0]?.plain_text;
    const coverType = result.cover?.type;
    const thumbImageUri = result.cover?.[coverType]?.url;
    const overview = result.properties?.overview?.['rich_text']?.[0]?.['plain_text'];

    return { id, createdAt, icon, tags, title, thumbImageUri, overview };
  });

  return NextResponse.json({
    next_cursor: page.next_cursor,
    has_more: page.has_more,
    results: returnObj,
  });
}
