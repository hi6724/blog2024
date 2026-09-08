import { NextResponse } from 'next/server';
import { guestbookCount } from '@/lib/guestbook';
import { guestbookError } from '@/lib/guestbook-response';
export const dynamic = 'force-dynamic';
export async function GET() {
  try { return NextResponse.json(await guestbookCount()); }
  catch (error) { return guestbookError(error); }
}
