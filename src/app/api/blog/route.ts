import { REVALIDATE_TIME } from '@/constants';
import { NextRequest, NextResponse } from 'next/server';

const database_id = '8a3bdeb10ce94834a5ba6a8476f4d43c';

export async function GET(request: NextRequest) {
  const filter = request.nextUrl.searchParams.get('filter');
  const cursor = request.nextUrl.searchParams.get('cursor');
  const page_size = +(request.nextUrl.searchParams.get('page_size') ?? '10');
  const sort = request.nextUrl.searchParams.get('sort') ?? 'descending';
  const filterList = filter?.split(',').map((el) => ({
    property: 'types',
    multi_select: {
      contains: el.trim(),
    },
  }));
  const page = await(
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
            property: 'publishedAt',
            direction: sort === 'ascending' ? 'ascending' : 'descending',
          },
        ],
        ...(filterList && {
          filter: {
            or: filterList,
          },
        }),
      }),
      next: { revalidate: REVALIDATE_TIME },
    })
  ).json();

  const returnObj = page.results.map((result: any) => {
    const id = result.id;
    const createdAt = result.properties?.publishedAt?.date?.start;
    const iconType = result.icon?.type;
    const icon = result.icon[iconType] ?? '🥳';
    const tags = result.properties?.types['multi_select'].map((el: any) => el.name);
    const title = result.properties?.name?.title?.[0]?.plain_text;
    const coverType = result.cover?.type;
    const thumbImageUri = result.cover?.[coverType]?.url;
    const overview = result.properties?.overview?.['rich_text']?.[0]?.['plain_text'];
    const comments = result.properties?.comments?.['number'];

    return { id, createdAt, icon, tags, title, thumbImageUri, overview, comments };
  });

  return NextResponse.json({
    next_cursor: page.next_cursor,
    has_more: page.has_more,
    results: returnObj,
  });
}
