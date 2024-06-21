import { notionClient, notionClientAPI } from '@/lib/notion';
import { NextRequest, NextResponse } from 'next/server';
import { NotionToMarkdown } from 'notion-to-md';

export async function GET(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  return NextResponse.json(await notionClientAPI.getPage(id));
}
