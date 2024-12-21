import { myNotionClient, notionClient } from '@/lib/notion';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  const notionData = await myNotionClient.getPage(id, {
    gotOptions: {
      next: { revalidate: 600 },
    },
  });

  const notionApiUrl = `https://api.notion.com/v1/pages/${id}`;
  const res = await (
    await fetch(notionApiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
      },
      next: { revalidate: 0 },
    })
  ).json();

  fetch(notionApiUrl, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      properties: {
        views: { number: (res.properties.views.number ?? 0) + 1 },
      },
    }),
  });

  return NextResponse.json(notionData);
}

export async function POST(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  const { content, icon, username, userId, commentsLength } = await req.json();
  const value = `${icon}:${username}:${userId}:${content}`;
  revalidatePath(`/api/project/${id}`);
  const res = await notionClient.comments.create({
    parent: { page_id: id },
    rich_text: [
      {
        text: {
          content: value,
        },
      },
    ],
  });
  notionClient.pages.update({
    page_id: id,
    properties: {
      comments: {
        number: commentsLength,
      },
    },
  });

  return NextResponse.json({ ok: true, res });
}

export async function DELETE(
  req: NextRequest,
  { params: { id, commentId } }: { params: { id: string; commentId: string } }
) {
  revalidatePath(`/api/project/${id}`);
  const response = await notionClient.blocks.delete({
    block_id: commentId,
  });
  notionClient.pages.update({
    page_id: id,
    properties: {
      comments: {
        number: 100,
      },
    },
  });
  return NextResponse.json(response);
}
