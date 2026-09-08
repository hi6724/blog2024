import { NextRequest, NextResponse } from 'next/server';
import { updateGuestbook } from '@/lib/guestbook';
import { guestbookError } from '@/lib/guestbook-response';
import { revalidatePath } from 'next/cache';
export async function POST(request: NextRequest) {
  try {
    const input = await request.json();
    const result = await updateGuestbook(input.id, input);
    revalidatePath('/'); revalidatePath('/guestbook');
    return NextResponse.json({ ok: true, result });
  } catch (error) { return guestbookError(error); }
}
