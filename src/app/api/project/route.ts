import { Client } from '@notionhq/client';
import { NextRequest, NextResponse } from 'next/server';

const database_id = '68009bd6df9640f9b09322eb70a3dee5';

export async function GET(request: NextRequest) {
  const notion = new Client({
    auth: process.env.NOTION_API_KEY,
  });

  const cursor = request.nextUrl.searchParams.get('cursor');
  const page_size = +(request.nextUrl.searchParams.get('page_size') ?? '10');
  const sort = request.nextUrl.searchParams.get('sort') ?? 'descending';

  const projects = await notion.databases.query({
    database_id,
    auth: process.env.NOTION_API_KEY,
    page_size,
    sorts: [
      {
        property: 'date',
        direction: sort === 'ascending' ? 'ascending' : 'descending',
      },
    ],
    ...(!!cursor && { start_cursor: cursor }),
  });

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
    };
  });

  return NextResponse.json({
    next_cursor: projects.next_cursor,
    has_more: projects.has_more,
    results: returnObj,
  });
}
