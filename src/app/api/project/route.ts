import { Client } from '@notionhq/client';
import { NextRequest, NextResponse } from 'next/server';

const database_id = '68009bd6df9640f9b09322eb70a3dee5';

export async function GET(request: NextRequest) {
  const notion = new Client({
    auth: process.env.NOTION_API_KEY,
  });

  const projects = await notion.databases.query({
    database_id,
    auth: process.env.NOTION_API_KEY,
    sorts: [
      {
        property: 'date',
        direction: 'descending',
      },
    ],
  });

  const returnObj = projects.results.map((result: any) => {
    const id = result.id;
    const icon = result?.icon;
    const startData = result?.properties?.date?.date?.start;
    const endDate = result?.properties?.date?.date?.end;
    const type = result?.properties?.type?.select?.name;
    const title = result?.properties?.name?.title?.[0]?.plain_text;
    const overview = result?.properties?.overview?.rich_text?.[0]?.plain_text;
    const coverType = result?.cover?.type;
    const thumbImageUri = result?.cover?.[coverType]?.url;
    const skills = result?.properties?.skills?.multi_select?.map((skill: any) => skill.name);
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
    };
  });

  return NextResponse.json(returnObj);
}
