'use client';

import { INTERACTION_STALE_MS } from '@/lib/cache-policy';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getComment } from '@/app/action';
import { normalizePostId } from '@/lib/comments';
import type { ISupabaseComment } from '@/react-query/types';
import SubmitForm from '@/components/blog/SubmitForm';
import CommentActions from './CommentActions';
import BlogCommentItem from '@/components/blog/BlogComment';

export default function CommentSection({ pageId }: { pageId: string }) {
  const id = normalizePostId(pageId);
  const queryKey = ['comments', id];
  const cache = useQueryClient();
  const { data: comments = [], isPending, isError, refetch } = useQuery({
    queryKey, queryFn: () => getComment({ id }), retry: false, staleTime: INTERACTION_STALE_MS,
  });

  async function onCreated(comment: ISupabaseComment) {
    await cache.cancelQueries({ queryKey });
    cache.setQueryData<ISupabaseComment[]>(queryKey, (previous = []) => [comment, ...previous.filter((item) => item.id !== comment.id)]);
    void cache.invalidateQueries({ queryKey });
    void cache.invalidateQueries({ queryKey: ['blog-ovreview-list'] });
    void cache.invalidateQueries({ queryKey: ['project-ovreview-list'] });
    void cache.invalidateQueries({ queryKey: ['next-prev-blog'] });
  }

  async function onUpdated(comment: ISupabaseComment) {
    await cache.cancelQueries({ queryKey });
    cache.setQueryData<ISupabaseComment[]>(queryKey, (previous = []) => previous.map((item) => item.id === comment.id ? comment : item));
    void cache.invalidateQueries({ queryKey });
    void cache.invalidateQueries({ queryKey: ['blog-ovreview-list'] });
    void cache.invalidateQueries({ queryKey: ['project-ovreview-list'] });
    void cache.invalidateQueries({ queryKey: ['next-prev-blog'] });
  }

  async function onDeleted(commentId: string) {
    await cache.cancelQueries({ queryKey });
    cache.setQueryData<ISupabaseComment[]>(queryKey, (previous = []) => previous.filter((item) => item.id !== commentId));
    void cache.invalidateQueries({ queryKey });
    void cache.invalidateQueries({ queryKey: ['blog-ovreview-list'] });
    void cache.invalidateQueries({ queryKey: ['project-ovreview-list'] });
    void cache.invalidateQueries({ queryKey: ['next-prev-blog'] });
  }

  return (
    <section aria-label='댓글' className='w-full min-w-0 border-t border-base-content/10 px-4 py-8 sm:px-6 sm:py-10 flex flex-col gap-6'>
      <h2 className='flex items-center gap-2 text-xl font-bold'>댓글{!isPending && !isError && <span className='rounded-full bg-base-200 px-2.5 py-1 text-sm font-medium text-base-content/70'>{comments.length}</span>}</h2>
      {isPending && <p role='status'>댓글을 불러오는 중입니다.</p>}
      {isError && <div role='alert'>댓글을 불러오지 못했습니다. <button className='btn btn-sm' onClick={() => void refetch()}>다시 시도</button></div>}
      {!isPending && !isError && comments.length === 0 && <p className='py-6 text-center text-sm text-base-content/60'>첫 댓글을 남겨주세요.</p>}
      <div className='flex flex-col gap-4'>
      {comments.map((comment) => <article key={comment.id} aria-label={`${comment.user?.user_name ?? '탈퇴한 사용자'}의 댓글`} className='min-w-0 rounded-2xl border border-base-content/10 bg-base-100 p-5 sm:p-6'>
        <CommentActions comment={comment} onUpdated={onUpdated} onDeleted={onDeleted}>
        {(actions) => <BlogCommentItem actions={actions} comment={{
        id: comment.id, content: comment.body, createdAt: comment.created_at,
        userId: comment.user_notion_id, username: comment.user?.user_name ?? '탈퇴한 사용자', icon: comment.user?.avatar ?? '👤',
      }} />}
        </CommentActions>
      </article>)}
      </div>
      <div>
        <SubmitForm key={id} id={id} onCreated={onCreated} />
      </div>
    </section>
  );
}
