import { myNotionClient, notionClient } from '@/lib/notion';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  return NextResponse.json(
    await myNotionClient.getPage(id, {
      gotOptions: {
        next: { revalidate: 600 },
      },
    })
  );
}

export async function POST(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  const { content, icon, username, userId } = await req.json();
  const value = `${icon}:${username}:${userId}:${content}`;
  revalidatePath(`/api/project/${id}`);
  notionClient.comments.create({
    parent: { page_id: id },
    rich_text: [
      {
        text: {
          content: value,
        },
      },
    ],
  });

  return NextResponse.json({ ok: true });
}
