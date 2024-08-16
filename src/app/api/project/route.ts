import { NextRequest, NextResponse } from 'next/server';

const database_id = '68009bd6df9640f9b09322eb70a3dee5';

export async function GET(request: NextRequest) {
  const cursor = request.nextUrl.searchParams.get('cursor');
  const page_size = +(request.nextUrl.searchParams.get('page_size') ?? '10');
  const sort = request.nextUrl.searchParams.get('sort') ?? 'descending';

  const projects = await (
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
            property: 'date',
            direction: sort === 'ascending' ? 'ascending' : 'descending',
          },
        ],
      }),
      next: { revalidate: 1200 },
    })
  ).json();

  const returnObj = projects.results.map((result: any) => {
    const id = result.id;
    const iconType = result?.icon?.type;
    const icon = result.icon[iconType];
    const startData = result?.properties?.date?.date?.start;
    const endDate = result?.properties?.date?.date?.end;
    const type = result?.properties?.type?.select?.name;
    const title = result?.properties?.name?.title?.[0]?.plain_text;
    const overview = result?.properties?.overview?.rich_text?.[0]?.plain_text;
    const coverType = result?.cover?.type;
    const thumbImageUri = result?.cover?.[coverType]?.url;
    const skills = result?.properties?.skills?.multi_select?.map((skill: any) => skill.name);
    const overview2 = result?.properties?.overview2?.rich_text?.[0]?.plain_text;
    const overviewImg = result?.properties?.overviewImg?.files?.[0]?.file?.url;
    const link = result?.properties?.link?.url;
    return {
      id,
      icon,
      thumbImageUri,
      startData,
      endDate,
      type,
      title,
      skills,
      overview,
      overview2,
      overviewImg,
      link,
    };
  });

  // return NextResponse.json(tt);
  return NextResponse.json({
    next_cursor: projects.next_cursor,
    has_more: projects.has_more,
    results: returnObj,
  });
}
