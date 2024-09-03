import { NextResponse } from 'next/server';

const database_id = '8a3bdeb10ce94834a5ba6a8476f4d43c';
export async function GET() {
  const db = await (
    await fetch(`https://api.notion.com/v1/databases/${database_id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },

      next: { revalidate: 3600 * 24 * 7 },
    })
  ).json();

  const tags = db?.properties?.types?.multi_select?.options.map((el: any) => ({ name: el.name, color: el.color }));
  return NextResponse.json(tags);
}
