import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const blogTotalViewId = '16121d41-62d4-80c4-954f-f4e07e61b9f4';
export async function GET() {
  const baseUrl = `https://api.notion.com/v1/pages/${blogTotalViewId}`;
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
        views: { number: db.number + 1 },
      },
    }),
  });

  const host = headers().get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  fetch(`${protocol}://${host}/api/views/total`);

  return NextResponse.json(db.number + 1);
}
