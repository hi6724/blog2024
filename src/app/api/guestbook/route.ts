import { NextRequest, NextResponse } from 'next/server';
import { createGuestbook, listGuestbook } from '@/lib/guestbook';
import { guestbookError } from '@/lib/guestbook-response';
import { revalidatePath } from 'next/cache';
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(await listGuestbook({ cursor: request.nextUrl.searchParams.get('cursor'),
      pageSize: Number(request.nextUrl.searchParams.get('page_size') ?? 20), sort: request.nextUrl.searchParams.get('sort') ?? 'descending' }));
  } catch (error) { return guestbookError(error); }
}
export async function POST(request: NextRequest) {
  try {
    const result = await createGuestbook(await request.json());
    revalidatePath('/'); revalidatePath('/guestbook');
    return NextResponse.json({ ok: true, id: result.id, result }, { status: 201 });
  } catch (error) { return guestbookError(error); }
}
