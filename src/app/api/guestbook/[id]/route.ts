import { notionClient } from '@/lib/notion';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  const response = await notionClient.blocks.delete({
    block_id: id,
  });
  revalidatePath('/api/guestbook');

  const host = headers().get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

  fetch(`${protocol}://${host}/api/guestbook/count`, {
    method: 'POST',
    body: JSON.stringify({ type: 'delete' }),
  });
  return NextResponse.json(response);
}
