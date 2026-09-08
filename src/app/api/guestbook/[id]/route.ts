import { NextRequest, NextResponse } from 'next/server';
import { deleteGuestbook, updateGuestbook } from '@/lib/guestbook';
import { guestbookError } from '@/lib/guestbook-response';
import { revalidatePath } from 'next/cache';
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { password } = await request.json();
    const result = await deleteGuestbook(params.id, password);
    revalidatePath('/'); revalidatePath('/guestbook');
    return NextResponse.json(result);
  } catch (error) { return guestbookError(error); }
}
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await updateGuestbook(params.id, await request.json());
    revalidatePath('/'); revalidatePath('/guestbook');
    return NextResponse.json({ ok: true, result });
  } catch (error) { return guestbookError(error); }
}
