import 'server-only';
import { unstable_cache, revalidateTag } from 'next/cache';
import { GUESTBOOK_CACHE_TAG, INTERACTION_CACHE_SECONDS } from '@/lib/cache-policy';
import bcrypt from 'bcryptjs';
import { createSupabaseAdmin } from '@/lib/supabase/admin';
import type { IGuestBook, IListResponse } from '@/react-query/types';

const PUBLIC_COLUMNS = 'id,username,title,content,icon,source_user_id,created_at';
export class GuestbookError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
function publicEntry(row: any): IGuestBook {
  return { id: row.id, username: row.username, title: row.title, content: row.content,
    icon: row.icon, userId: row.source_user_id ?? '', createdAt: row.created_at };
}
function field(value: unknown, name: string, max: number) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) throw new GuestbookError(`${name}을(를) 1~${max}자로 입력해주세요.`);
  return value.trim();
}
function password(value: unknown) {
  if (typeof value !== 'string' || !value || Buffer.byteLength(value, 'utf8') > 72) throw new GuestbookError('비밀번호를 입력해주세요. (최대 72바이트)');
  return value;
}
function uuid(id: string) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) throw new GuestbookError('올바른 방명록 ID가 아닙니다.');
  return id;
}
async function readGuestbook({ cursor, pageSize = 20, sort = 'descending' }: { cursor?: string | null; pageSize?: number; sort?: string }): Promise<IListResponse<IGuestBook>> {
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) throw new GuestbookError('조회 개수는 1~100이어야 합니다.');
  if (!['ascending', 'descending'].includes(sort)) throw new GuestbookError('정렬 방식이 올바르지 않습니다.');
  const ascending = sort === 'ascending';
  let query = createSupabaseAdmin().from('guestbook').select(PUBLIC_COLUMNS)
    .order('created_at', { ascending }).order('id', { ascending: true }).limit(pageSize + 1);
  if (cursor) {
    try {
      const parsed = JSON.parse(Buffer.from(cursor, 'base64url').toString());
      const id = uuid(parsed.id);
      if (typeof parsed.date !== 'string' || !/^\d{4}-\d{2}-\d{2}T[0-9:.]+(?:Z|[+-]\d{2}:\d{2})$/.test(parsed.date) || !Number.isFinite(Date.parse(parsed.date))) throw new Error('Invalid date');
      const date = parsed.date;
      query = query.or(`created_at.${ascending ? 'gt' : 'lt'}.${date},and(created_at.eq.${date},id.gt.${id})`);
    } catch { throw new GuestbookError('조회 위치가 올바르지 않습니다.'); }
  }
  const { data, error } = await query;
  if (error) throw new GuestbookError('방명록을 불러오지 못했습니다.', 500);
  const hasMore = data.length > pageSize;
  const rows = data.slice(0, pageSize);
  const last = rows[rows.length - 1];
  return { results: rows.map(publicEntry), has_more: hasMore,
    next_cursor: hasMore ? Buffer.from(JSON.stringify({ date: last.created_at, id: last.id })).toString('base64url') : undefined };
}
async function readGuestbookCount() {
  const { count, error } = await createSupabaseAdmin().from('guestbook').select('id', { head: true, count: 'exact' });
  if (error) throw new GuestbookError('방명록 개수를 불러오지 못했습니다.', 500);
  return count ?? 0;
}
export async function createGuestbook(input: Record<string, unknown>) {
  const row = { username: field(input.username, '이름', 80), title: field(input.title, '제목', 200),
    content: field(input.content, '내용', 4000), icon: field(input.icon ?? '🥳', '아이콘', 16),
    password_hash: await bcrypt.hash(password(input.password), 12) };
  const { data, error } = await createSupabaseAdmin().from('guestbook').insert(row).select(PUBLIC_COLUMNS).single();
  if (error) throw new GuestbookError('방명록을 등록하지 못했습니다.', 500);
  revalidateTag(GUESTBOOK_CACHE_TAG);
  return publicEntry(data);
}
async function verify(id: string, suppliedPassword: unknown) {
  const value = password(suppliedPassword);
  const { data, error } = await createSupabaseAdmin().from('guestbook').select('id,password_hash').eq('id', uuid(id)).maybeSingle();
  if (error) throw new GuestbookError('방명록을 확인하지 못했습니다.', 500);
  if (!data) throw new GuestbookError('방명록을 찾을 수 없습니다.', 404);
  if (!await bcrypt.compare(value, data.password_hash)) throw new GuestbookError('비밀번호가 올바르지 않습니다.', 403);
  return data;
}
export async function updateGuestbook(id: string, input: Record<string, unknown>) {
  const changes = { title: field(input.title, '제목', 200), content: field(input.content, '내용', 4000),
    icon: field(input.icon ?? '🥳', '아이콘', 16), updated_at: new Date().toISOString() };
  const owner = await verify(id, input.password);
  const { data, error } = await createSupabaseAdmin().from('guestbook').update(changes)
    .eq('id', owner.id).eq('password_hash', owner.password_hash).select(PUBLIC_COLUMNS).single();
  if (error) throw new GuestbookError('방명록을 수정하지 못했습니다.', 500);
  revalidateTag(GUESTBOOK_CACHE_TAG);
  return publicEntry(data);
}
export async function deleteGuestbook(id: string, suppliedPassword: unknown) {
  const owner = await verify(id, suppliedPassword);
  const { data, error } = await createSupabaseAdmin().from('guestbook').delete()
    .eq('id', owner.id).eq('password_hash', owner.password_hash).select('id').single();
  if (error || !data) throw new GuestbookError('방명록을 삭제하지 못했습니다.', 500);
  revalidateTag(GUESTBOOK_CACHE_TAG);
  return { ok: true };
}

export const listGuestbook = unstable_cache(readGuestbook, ['guestbook-list-v1'], {
  revalidate: INTERACTION_CACHE_SECONDS, tags: [GUESTBOOK_CACHE_TAG],
});
export const guestbookCount = unstable_cache(readGuestbookCount, ['guestbook-count-v1'], {
  revalidate: INTERACTION_CACHE_SECONDS, tags: [GUESTBOOK_CACHE_TAG],
});
