import { notionClient } from '@/lib/notion';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  const response = await notionClient.blocks.delete({
    block_id: id,
  });
  revalidatePath('/api/guestbook');
  return NextResponse.json(response);
}
