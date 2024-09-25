import { ONE_WEEK_TIME } from '@/constants';
import { NextRequest, NextResponse } from 'next/server';

const database_id = '68009bd6df9640f9b09322eb70a3dee5';

export async function GET(request: NextRequest) {
  const projects = await (
    await fetch(`https://api.notion.com/v1/databases/${database_id}/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        page_size: 100,
      }),
      next: { revalidate: ONE_WEEK_TIME },
    })
  ).json();

  return NextResponse.json(
    projects.results.map((result: any) => ({ id: result.id, lastEditedTime: result.last_edited_time }))
  );
}
