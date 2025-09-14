'use server';

import { createSupabaseServer } from '@/lib/supabase/serverClient';
import { ISupabaseComment } from '@/react-query/types';

/** 앱 세션에서 현재 로그인 사용자 ID를 가져오는 헬퍼 (예시) */
async function getCurrentUserIdFromLocalStorage(): Promise<string> {
  // 👉 구현 예: 쿠키/세션 디코드 → 내부 user_id 반환
  // throw new Error('로그인이 필요합니다.');
  return '<CURRENT_USER_ID_FROM_SESSION>';
}

const pickUser = (row: any) => ({
  ...row,
  user: row.user,
});

/** READ: 특정 post의 댓글 목록 (+ 단일 user 객체로 정규화) */
export async function getComment({ id }: { id: string }): Promise<ISupabaseComment[]> {
  const supabase = createSupabaseServer();

  const { data, error } = await supabase
    .from('comment')
    .select(
      `
      id,
      created_at,
      body,
      post_id,
      user_notion_id,
      user ( user_notion_id, user_name, avatar, password )
      `
    )
    .eq('post_id', id)
    .order('created_at', { ascending: true });
  console.log('여기 디버깅::::', data);
  if (error) throw error;
  return (data ?? []).map(pickUser) as ISupabaseComment[];
}

/** CREATE: 앱 세션의 현재 사용자로 댓글 생성 */
export async function createComment(input: { post_id: string; body: string }): Promise<ISupabaseComment> {
  const supabase = createSupabaseServer();
  const currentUserId = await getCurrentUserIdFromLocalStorage();
  if (!currentUserId) throw new Error('로그인이 필요합니다.');

  const { data, error } = await supabase
    .from('comment')
    .insert({
      post_id: input.post_id,
      body: input.body,
      user_id: currentUserId, // ✅ 앱 세션에서 주입
    })
    .select(
      `
      id,
      created_at,
      body,
      post_id,
      user_notion_id,
      user ( user_name, avatar, password )
      `
    )
    .single();

  if (error) throw error;
  return pickUser(data) as ISupabaseComment;
}

/** UPDATE: 본인 댓글만 수정 (앱 레벨 소유자 검증) */
export async function updateComment(input: { id: string; body: string }): Promise<ISupabaseComment> {
  const supabase = createSupabaseServer();
  const currentUserId = await getCurrentUserIdFromLocalStorage();
  if (!currentUserId) throw new Error('로그인이 필요합니다.');

  // 1) 소유자 검증 (간단/안전하게 WHERE 절에서 함께 제한)
  const { data, error } = await supabase
    .from('comment')
    .update({ body: input.body })
    .eq('id', input.id)
    .eq('user_id', currentUserId) // ✅ 소유자만 갱신
    .select(
      `
      id,
      created_at,
      body,
      post_id,
      user_notion_id,
      user ( user_name, avatar, password )
      `
    )
    .single();

  if (error) throw error;
  if (!data) throw new Error('수정 가능한 댓글이 없습니다.');
  return pickUser(data) as ISupabaseComment;
}

/** DELETE: 본인 댓글만 삭제 (앱 레벨 소유자 검증) */
export async function deleteComment(input: { id: string }): Promise<{ success: true }> {
  const supabase = createSupabaseServer();
  const currentUserId = await getCurrentUserIdFromLocalStorage();
  if (!currentUserId) throw new Error('로그인이 필요합니다.');

  const { error } = await supabase.from('comment').delete().eq('id', input.id).eq('user_id', currentUserId); // ✅ 소유자만 삭제

  if (error) throw error;
  return { success: true };
}
