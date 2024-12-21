import { getYearMonthDifference } from '@/lib/date';
import { NextResponse } from 'next/server';

// const database_id = '15521d4162d480d38e35ea7a3b9a8207';
const totalViewsId = '15521d41-62d4-80a8-bcf9-cbd0da33af03';
const blogTotalViewId = '16121d41-62d4-80c4-954f-f4e07e61b9f4';

const guestbookTotalCntId = '16121d4162d4806b959bc3c4c55d1ebd';
const projectTotalViewId = '16121d41-62d4-80c1-b693-e9a2079ca3ca';

const blogTotalPostCntId = '16121d41-62d4-8073-87d5-f518074a0150';

export async function GET() {
  const baseUrl = `https://api.notion.com/v1/pages/${totalViewsId}`;
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

  return NextResponse.json(db.number + 1);
}
