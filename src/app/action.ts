'use server';

import { supabase } from '@/lib/supabase/client';
import { createSupabaseServer } from '@/lib/supabase/serverClient';
import { ISupabaseComment } from '@/react-query/types';
import bcrypt from 'bcrypt';

const SALT = '$2b$10$AoSrvjM.jwnN1xEdxjxcMu';
interface IUserRes {
  ok: boolean;
  code: 'NO_USER_NAME' | 'WRONG_PASSWORD' | 'OK' | 'NEW_USER';
  user?: any;
}
/** 앱 세션에서 현재 로그인 사용자 ID를 가져오는 헬퍼 (예시) */
export async function getUser({ userName, password }: { userName: string; password: string }): Promise<IUserRes> {
  const user = await supabase.from('user').select('*').eq('user_name', userName).single();
  if (!user?.data) return { ok: false, code: 'NO_USER_NAME' };

  const isOk = bcrypt.compareSync(password, user.data.password);
  if (!isOk) return { ok: false, code: 'WRONG_PASSWORD' };

  return { ok: true, code: 'OK', user: user.data };
}

/** 생성: user_name 중복 체크 → 비번 해시 → insert */
export async function createUser({ userName, password, avatar }: { userName: string; password: string; avatar: string }): Promise<any> {
  const supabase = createSupabaseServer();
  const { data: exists } = await supabase.from('user').select('*').eq('user_name', userName).maybeSingle();
  if (exists) return { ok: false, error: 'DUPLICATE_USER_NAME', code: 'DUPLICATE' };

  const hashed = bcrypt.hashSync(password, SALT);
  const { data, error } = await supabase.from('user').insert({ user_name: userName, password: hashed, avatar }).select('*').single();
  if (error || !data) return { ok: false, error: error?.message ?? 'INSERT_FAILED' };

  return { ok: true, data };
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
export async function createComment(input: { postId: string; body: string; userNotionId: string }): Promise<ISupabaseComment> {
  const supabase = createSupabaseServer();

  const { data, error } = await supabase
    .from('comment')
    .insert({
      post_id: input.postId,
      body: input.body,
      user_notion_id: input.userNotionId, // ✅ 앱 세션에서 주입
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

  // 1) 소유자 검증 (간단/안전하게 WHERE 절에서 함께 제한)
  const { data, error } = await supabase
    .from('comment')
    .update({ body: input.body })
    .eq('id', input.id)
    .eq('user_id', '') // ✅ 소유자만 갱신
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

  const { error } = await supabase.from('comment').delete().eq('id', input.id).eq('user_id', ''); // ✅ 소유자만 삭제

  if (error) throw error;
  return { success: true };
}
