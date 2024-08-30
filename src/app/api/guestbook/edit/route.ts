import { notionClient } from '@/lib/notion';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { content, id, title, icon, username } = await request.json();
  notionClient.pages.update({
    page_id: id,
    icon: { emoji: icon },
    properties: {
      title: { title: [{ text: { content: title } }] },
      username: { rich_text: [{ text: { content: username } }] },
      content: {
        rich_text: [{ text: { content: content } }],
      },
    },
  });
  revalidatePath('/api/guestbook');
  return NextResponse.json({ ok: true });
}
