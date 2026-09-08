'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { createComment } from '@/app/action';
import { MAX_COMMENT_LENGTH } from '@/lib/comments';
import type { ISupabaseComment } from '@/react-query/types';

export default function SubmitForm({ id, onCreated }: { id: string; onCreated: (comment: ISupabaseComment) => void }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const reducedMotion = useReducedMotion();
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (open) bodyRef.current?.focus({ preventScroll: true });
  }, [open]);
  function close() {
    if (pending) return;
    (document.activeElement as HTMLElement | null)?.blur();
    setOpen(false);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    setPending(true);
    setError('');
    setSuccess(false);
    try {
      const comment = await createComment({
        postId: id, body: String(fields.get('body') ?? ''),
        userName: String(fields.get('userName') ?? ''), password: String(fields.get('password') ?? ''),
        avatar: String(fields.get('avatar') ?? '🥳'),
      });
      onCreated(comment);
      form.reset();
      setSuccess(true);
      (document.activeElement as HTMLElement | null)?.blur();
      setOpen(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : '댓글 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setPending(false);
    }
  }

  return <>
    <button type='button' onFocus={() => setOpen(true)} onClick={() => setOpen(true)}
      aria-expanded={open} aria-controls={`comment-form-${id}`}
      className='input input-bordered h-14 w-full text-left text-base-content/60 focus:ring-2 focus:ring-primary'>댓글을 남겨주세요</button>
    {success && <p role='status' className='text-success text-sm'>댓글이 등록되었습니다.</p>}
    {mounted && createPortal(<>
    {open && <div className='fixed inset-0 z-40 bg-neutral/60' onClick={close} aria-hidden='true' />}
    <motion.form id={`comment-form-${id}`} onSubmit={submit}
      onKeyDown={event => { if (event.key === 'Escape') close(); }}
      initial={false} animate={{ y: open ? 0 : '100%' }}
      transition={{ duration: reducedMotion ? 0 : 0.25, ease: 'easeOut' }}
      style={{ visibility: open ? 'visible' : 'hidden' }}
      className='fixed bottom-0 inset-x-0 mx-auto z-50 max-w-screen-lg max-h-[90dvh] overflow-y-auto rounded-t-2xl bg-base-200 p-5 sm:p-6 shadow-xl flex flex-col gap-4' aria-label='댓글 작성'>
      <h3 className='text-lg font-semibold'>댓글 작성</h3>
      <fieldset disabled={pending} className='flex flex-col gap-3'>
        <label className='flex flex-col gap-1'>
          <span className='text-sm'>댓글 내용</span>
          <textarea ref={bodyRef} name='body' required maxLength={MAX_COMMENT_LENGTH} rows={4}
            className='textarea textarea-bordered w-full text-base focus:ring-2 focus:ring-primary' placeholder='댓글을 남겨주세요' />
        </label>
        <div className='flex flex-wrap gap-2'>
          <label className='flex flex-col gap-1'>
            <span className='text-sm'>아이콘</span>
            <select name='avatar' className='select select-bordered focus:ring-2 focus:ring-primary' defaultValue='🥳'>
              {['🥳', '🤪', '⭐', '🐝', '👻', '🐷', '🐻'].map((emoji) => <option key={emoji}>{emoji}</option>)}
            </select>
          </label>
          <label className='flex flex-1 min-w-32 flex-col gap-1'>
            <span className='text-sm'>이름</span>
            <input name='userName' required maxLength={10} autoComplete='username' className='input input-bordered w-full focus:ring-2 focus:ring-primary' />
          </label>
          <label className='flex flex-1 min-w-32 flex-col gap-1'>
            <span className='text-sm'>비밀번호</span>
            <input name='password' type='password' required maxLength={72} autoComplete='current-password' className='input input-bordered w-full focus:ring-2 focus:ring-primary' />
          </label>
        </div>
        <p className='text-xs opacity-70'>처음 사용하는 이름은 자동 등록됩니다. 같은 이름으로 작성하려면 기존 비밀번호를 입력해주세요.</p>
        <div className='flex justify-end gap-2'>
          <button type='button' onClick={close} className='btn focus:ring-2 focus:ring-primary'>닫기</button>
          <button type='submit' className='btn btn-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-base-100'>{pending ? '등록 중…' : '댓글 등록'}</button>
        </div>
      </fieldset>
      {error && <p role='alert' className='text-error text-sm'>{error}</p>}
    </motion.form>
    </>, document.body)}
  </>;
}
