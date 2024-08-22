import { notionClient } from '@/lib/notion';
import { NextResponse } from 'next/server';
const database_id = '8a3bdeb10ce94834a5ba6a8476f4d43c';
export async function GET() {
  const db = await notionClient.databases.retrieve({ database_id });
  const tags = db?.properties?.types?.multi_select?.options.map((el: any) => ({ name: el.name, color: el.color }));

  return NextResponse.json(tags);
}
