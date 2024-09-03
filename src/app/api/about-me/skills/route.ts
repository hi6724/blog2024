import { REVALIDATE_TIME } from '@/constants';
import { NextResponse } from 'next/server';

const database_id = '442f1f227bac43aea4dd256866a32445';
export async function GET() {
  const skillsData = await (
    await fetch(`https://api.notion.com/v1/databases/${database_id}/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      next: { revalidate: REVALIDATE_TIME },
    })
  ).json();
  console.log(skillsData);
  return NextResponse.json(skillsData);
}
