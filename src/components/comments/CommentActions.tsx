'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { updateComment, deleteComment } from '@/app/action';
import { MAX_COMMENT_LENGTH } from '@/lib/comments';
import type { ISupabaseComment } from '@/react-query/types';

export default function CommentActions({ comment, onUpdated, onDeleted, children }: {
  comment: ISupabaseComment;
  onUpdated: (comment: ISupabaseComment) => void;
  onDeleted: (id: string) => void;
  children: (actions: ReactNode) => ReactNode;
}) {
  const [mode, setMode] = useState<'edit' | 'delete' | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  if (!comment.user) return <>{children(null)}</>;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || !comment.user) return;
    const fields = new FormData(event.currentTarget);
    const input = { id: comment.id, userName: comment.user.user_name, password: String(fields.get('password') ?? '') };
    setPending(true);
    setError('');
    try {
      if (mode === 'edit') {
        onUpdated(await updateComment({ ...input, body: String(fields.get('body') ?? '') }));
      } else {
        await deleteComment(input);
        onDeleted(comment.id);
      }
      setMode(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : '처리하지 못했습니다. 다시 시도해주세요.');
    } finally {
      setPending(false);
    }
  }

  const buttons = <div className='flex shrink-0 items-center gap-1'>
    <button className='btn btn-ghost btn-sm font-normal text-base-content/60 focus:ring-2 focus:ring-primary' onClick={() => { setMode('edit'); setError(''); }}>수정</button>
    <button className='btn btn-ghost btn-sm font-normal text-base-content/60 hover:text-error focus:ring-2 focus:ring-primary' onClick={() => { setMode('delete'); setError(''); }}>삭제</button>
  </div>;

  return <>{children(!mode ? buttons : null)}
    {mode && <form key={mode} onSubmit={submit} aria-label={mode === 'edit' ? '댓글 수정' : '댓글 삭제'} className='mt-5 border-t border-base-content/10 pt-5 flex flex-col gap-3'>
    <fieldset disabled={pending} className='flex flex-col gap-3'>
      {mode === 'edit' ? <label className='flex flex-col gap-1'>
        수정할 내용
        <textarea name='body' defaultValue={comment.body} required maxLength={MAX_COMMENT_LENGTH} rows={3} className='textarea textarea-bordered w-full focus:ring-2 focus:ring-primary' />
      </label> : <p className='text-sm'>이 댓글을 삭제하려면 작성할 때 사용한 비밀번호를 입력해주세요.</p>}
      <label className='flex flex-col gap-1'>
        작성자 비밀번호
        <input name='password' type='password' required maxLength={72} autoComplete='current-password' className='input input-bordered w-full focus:ring-2 focus:ring-primary' />
      </label>
      <div className='flex gap-2 justify-end'>
        <button type='button' className='btn btn-sm' onClick={() => setMode(null)}>취소</button>
        <button type='submit' className={`btn btn-sm ${mode === 'delete' ? 'btn-error' : 'btn-primary'}`}>
          {pending ? '처리 중…' : mode === 'edit' ? '수정 저장' : '삭제 확인'}
        </button>
      </div>
    </fieldset>
    {error && <p role='alert' className='text-error text-sm'>{error}</p>}
  </form>}</>;
}
