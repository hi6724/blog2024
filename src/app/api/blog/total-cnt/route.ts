import { REVALIDATE_TIME } from '@/constants';
import { NextRequest, NextResponse } from 'next/server';

const database_id = '8a3bdeb10ce94834a5ba6a8476f4d43c';

export async function GET() {
  const page = await (
    await fetch(`https://api.notion.com/v1/databases/${database_id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      next: { revalidate: REVALIDATE_TIME },
    })
  ).json();

  return NextResponse.json(page);
}
