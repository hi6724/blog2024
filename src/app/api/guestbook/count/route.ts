import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

const guestbookTotalCntId = '16121d4162d4806b959bc3c4c55d1ebd';
export async function GET() {
  const baseUrl = `https://api.notion.com/v1/pages/${guestbookTotalCntId}`;
  const db = await (
    await fetch(`${baseUrl}/properties/dKMK`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
      },
      next: { revalidate: 0 },
    })
  ).json();

  return NextResponse.json(db.number);
}

export async function POST(request: NextRequest) {
  const { type } = await request.json();
  const baseUrl = `https://api.notion.com/v1/pages/${guestbookTotalCntId}`;

  const db = await (
    await fetch(`${baseUrl}/properties/dKMK`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
      },
      next: { revalidate: 0 },
    })
  ).json();

  fetch(baseUrl, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      properties: {
        views: { number: type === 'create' ? db.number + 1 : db.number - 1 },
      },
    }),
  });
}
