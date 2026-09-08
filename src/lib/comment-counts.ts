import 'server-only';
import { unstable_cache } from 'next/cache';
import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { normalizePostId } from '@/lib/comments';
import { COMMENT_COUNTS_CACHE_TAG, INTERACTION_CACHE_SECONDS } from '@/lib/cache-policy';

const readCounts = unstable_cache(async (ids: string[]) => {
  const counts: Record<string, number> = Object.fromEntries(ids.map(id => [id, 0]));
  if (!ids.length) return counts;
  const db = createSupabaseAdmin();
  const variants = ids.flatMap(id => [id, id.replace(/-/g, '')]);
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await db.from('comment').select('id,post_id').in('post_id', variants).order('id').range(offset, offset + 999);
    if (error) throw new Error('댓글 개수를 불러오지 못했습니다.');
    for (const row of data) counts[normalizePostId(row.post_id)]++;
    if (data.length < 1000) break;
  }
  return counts;
}, ['comment-counts-v1'], { revalidate: INTERACTION_CACHE_SECONDS, tags: [COMMENT_COUNTS_CACHE_TAG] });

export function getCommentCounts(ids: string[]) {
  return readCounts(Array.from(new Set(ids.map(normalizePostId))).sort());
}
