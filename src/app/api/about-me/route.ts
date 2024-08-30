import { notionClient } from '@/lib/notion';
import { NextResponse } from 'next/server';

const database_id = '9eb29aceae7c4b24840412f7b1f23ed7';
export async function GET() {
  const aboutMeData = await (
    await fetch(`https://api.notion.com/v1/databases/${database_id}/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        filter: {
          property: 'detail',
          checkbox: {
            equals: true,
          },
        },
        sorts: [{ property: 'date', direction: 'ascending' }],
      }),
      next: { revalidate: 600 },
    })
  ).json();

  const returnObj = aboutMeData.results.map((result: any) => {
    const data = result?.properties;
    const id = result.id;
    const title = data?.title?.title?.[0]?.plain_text;
    const date = data?.date?.date;
    const tagType = data?.tag?.type;
    const tags = data?.tag?.[tagType];
    const content = data?.content?.rich_text?.[0]?.plain_text;

    return {
      id,
      title,
      date,
      tags,
      content,
    };
  });

  return NextResponse.json(returnObj);
}
