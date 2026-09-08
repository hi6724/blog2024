import type { ISupabaseComment } from '@/react-query/types';

export const COMMENT_SELECT = 'id,created_at,body,post_id,user_notion_id,user(user_name,avatar)';
export const MAX_COMMENT_LENGTH = 2000;

export function normalizePostId(id: string) {
  const compact = typeof id === 'string' ? id.replace(/-/g, '').toLowerCase() : '';
  if (!/^[0-9a-f]{32}$/.test(compact)) throw new Error('올바른 페이지 ID가 아닙니다.');
  return compact.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');
}

export function validateComment(body: string) {
  const value = typeof body === 'string' ? body.trim() : '';
  if (!value || value.length > MAX_COMMENT_LENGTH) throw new Error('댓글은 1~2,000자로 입력해주세요.');
  return value;
}

export function normalizeComment(row: any): ISupabaseComment {
  const user = Array.isArray(row.user) ? row.user[0] : row.user;
  return {
    id: row.id, created_at: row.created_at, body: row.body,
    post_id: row.post_id, user_notion_id: row.user_notion_id,
    user: user ? { user_name: user.user_name, avatar: user.avatar } : null,
  };
}
