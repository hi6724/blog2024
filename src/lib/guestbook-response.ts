import { NextResponse } from 'next/server';
import { GuestbookError } from '@/lib/guestbook';
export function guestbookError(error: unknown) {
  return NextResponse.json({ ok: false, error: error instanceof GuestbookError ? error.message : '요청을 처리하지 못했습니다.' },
    { status: error instanceof GuestbookError ? error.status : error instanceof SyntaxError ? 400 : 500 });
}
