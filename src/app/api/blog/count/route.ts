import { NextResponse } from 'next/server';

const blogTotalPostCntId = '16121d41-62d4-8073-87d5-f518074a0150';
export async function GET() {
  const baseUrl = `https://api.notion.com/v1/pages/${blogTotalPostCntId}`;
  const db = await (
    await fetch(`${baseUrl}/properties/dKMK`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
      },
      next: { revalidate: 1000 * 3600 },
    })
  ).json();

  return NextResponse.json(db.number);
}
