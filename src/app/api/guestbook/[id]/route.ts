import { notionClient } from '@/lib/notion';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  revalidatePath('/api/guestbook');
  const response = await notionClient.blocks.delete({
    block_id: id,
  });
  return NextResponse.json(response);
}
