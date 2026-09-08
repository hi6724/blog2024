'use server';

import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { COMMENT_SELECT, normalizeComment, normalizePostId, validateComment } from '@/lib/comments';
import type { ISupabaseComment } from '@/react-query/types';
import bcrypt from 'bcrypt';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { commentCacheTag, COMMENT_COUNTS_CACHE_TAG, INTERACTION_CACHE_SECONDS } from '@/lib/cache-policy';

interface Credentials { userName: string; password: string }
const publicUser = (user: any) => ({
  user_name: user.user_name, avatar: user.avatar, user_notion_id: user.user_notion_id,
});

function validateCredentials({ userName, password }: Credentials) {
  if (typeof userName !== 'string' || !userName.trim() || userName.trim().length > 10 ||
      typeof password !== 'string' || !password || Buffer.byteLength(password, 'utf8') > 72) {
    throw new Error('이름(1~10자)과 비밀번호(최대 72바이트)를 확인해주세요.');
  }
}

export async function getUser(input: Credentials) {
  validateCredentials(input);
  const { data, error } = await createSupabaseAdmin().from('user')
    .select('user_name,password,avatar,user_notion_id').eq('user_name', input.userName.trim()).maybeSingle();
  if (error) throw new Error('사용자 정보를 불러오지 못했습니다.');
  if (!data) return { ok: false, code: 'NO_USER_NAME' };
  if (!await bcrypt.compare(input.password, data.password)) return { ok: false, code: 'WRONG_PASSWORD' };
  return { ok: true, code: 'OK', user: publicUser(data) };
}

export async function createUser(input: Credentials & { avatar: string }) {
  validateCredentials(input);
  const db = createSupabaseAdmin();
  const { data: existing, error: readError } = await db.from('user').select('user_notion_id')
    .eq('user_name', input.userName.trim()).maybeSingle();
  if (readError) throw new Error('사용자 정보를 불러오지 못했습니다.');
  if (existing) return { ok: false, code: 'DUPLICATE', error: '이미 사용 중인 이름입니다.' };
  const { data, error } = await db.from('user').insert({
    user_name: input.userName.trim(), password: await bcrypt.hash(input.password, 12),
    avatar: typeof input.avatar === 'string' ? input.avatar.slice(0, 16) : '🥳',
  }).select('user_name,avatar,user_notion_id').single();
  if (error?.code === '23505') return { ok: false, code: 'DUPLICATE', error: '이미 사용 중인 이름입니다.' };
  if (error || !data) return { ok: false, code: 'CREATE_FAILED', error: '사용자를 등록하지 못했습니다.' };
  return { ok: true, data: publicUser(data) };
}

async function authenticate(input: Credentials) {
  const result = await getUser(input);
  if (!result.ok || !result.user) throw new Error('이름 또는 비밀번호가 올바르지 않습니다.');
  return result.user;
}

export async function getComment({ id }: { id: string }): Promise<ISupabaseComment[]> {
  const postId = normalizePostId(id);
  return unstable_cache(() => readComments(postId), ['page-comments-v1', postId], {
    revalidate: INTERACTION_CACHE_SECONDS, tags: [commentCacheTag(postId)],
  })();
}

async function readComments(postId: string): Promise<ISupabaseComment[]> {
  // Support older rows saved with Notion's compact (32 character) IDs too.
  const db = createSupabaseAdmin();
  const comments: ISupabaseComment[] = [];
  const batchSize = 100;
  for (let offset = 0; ; offset += batchSize) {
    const { data, error } = await db.from('comment').select(COMMENT_SELECT)
      .in('post_id', [postId, postId.replace(/-/g, '')])
      .order('created_at', { ascending: false }).order('id')
      .range(offset, offset + batchSize - 1);
    if (error) throw new Error('댓글을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
    comments.push(...(data ?? []).map(normalizeComment));
    if (!data || data.length < batchSize) break;
  }
  return comments;
}

export async function createComment(input: Credentials & { postId: string; body: string; avatar: string }): Promise<ISupabaseComment> {
  const postId = normalizePostId(input.postId);
  const body = validateComment(input.body);
  let result = await getUser(input);
  if (result.code === 'NO_USER_NAME') {
    const created = await createUser(input);
    // Re-authenticate after a possible concurrent signup instead of trusting a supplied ID.
    if (!created.ok && created.code !== 'DUPLICATE') throw new Error(created.error);
    result = await getUser(input);
  }
  if (!result.ok || !result.user) throw new Error('이미 사용 중인 이름이거나 비밀번호가 올바르지 않습니다.');
  const { data, error } = await createSupabaseAdmin().from('comment').insert({
    post_id: postId, body, user_notion_id: result.user.user_notion_id,
  }).select(COMMENT_SELECT).single();
  if (error || !data) throw new Error('댓글을 저장하지 못했습니다. 잠시 후 다시 시도해주세요.');
  invalidateComments(postId);
  return normalizeComment(data);
}

export async function updateComment(input: Credentials & { id: string; body: string }): Promise<ISupabaseComment> {
  const body = validateComment(input.body);
  const user = await authenticate(input);
  const { data, error } = await createSupabaseAdmin().from('comment').update({ body })
    .eq('id', input.id).eq('user_notion_id', user.user_notion_id).select(COMMENT_SELECT).single();
  if (error || !data) throw new Error('수정 가능한 댓글이 없습니다.');
  invalidateComments(data.post_id);
  return normalizeComment(data);
}

export async function deleteComment(input: Credentials & { id: string }): Promise<{ success: true }> {
  const user = await authenticate(input);
  const { data, error } = await createSupabaseAdmin().from('comment').delete()
    .eq('id', input.id).eq('user_notion_id', user.user_notion_id).select('post_id').single();
  if (error || !data) throw new Error('삭제 가능한 댓글이 없습니다.');
  invalidateComments(data.post_id);
  return { success: true };
}

function invalidateComments(rawPostId: string) {
  const postId = normalizePostId(rawPostId);
  revalidateTag(commentCacheTag(postId));
  revalidateTag(COMMENT_COUNTS_CACHE_TAG);
  for (const id of Array.from(new Set([postId, postId.replace(/-/g, '')]))) {
    revalidatePath(`/blog/${id}`);
    revalidatePath(`/project/${id}`);
  }
}
