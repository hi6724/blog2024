import { myNotionClient, notionClientAPI } from '@/lib/notion';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  return NextResponse.json(
    await myNotionClient.getPage(id, {
      gotOptions: {
        next: { revalidate: 1200 },
      },
    })
  );
}
