'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import type { IGuestBook } from '@/react-query/types';

const focusStyle = 'bg-base-100 text-base-content placeholder:text-base-content/60 focus:ring-2 focus:ring-primary';

export default function SubmitForm({ entry, onSaved, onCancel, floating = false }: { entry?: IGuestBook; onSaved: () => void; onCancel?: () => void; floating?: boolean }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => { setMounted(true); }, []);
  const close = () => {
    if (pending) return;
    (formRef.current?.querySelector(':focus') as HTMLElement | null)?.blur();
    setOpen(false);
  };
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form));
    setPending(true); setError('');
    try {
      const response = await fetch(entry ? `/api/guestbook/${entry.id}` : '/api/guestbook', {
        method: entry ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(fields),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? '저장하지 못했습니다.');
      form.reset(); setOpen(false); (document.activeElement as HTMLElement | null)?.blur(); onSaved();
    } catch (error) { setError(error instanceof Error ? error.message : '저장하지 못했습니다.'); }
    finally { setPending(false); }
  }
  const form = <motion.form ref={formRef} onSubmit={submit} aria-label={entry ? '방명록 수정' : '방명록 작성'}
    onFocus={() => { if (floating) setOpen(true); }}
    onKeyDown={event => { if (floating && event.key === 'Escape') close(); }}
    initial={false}
    animate={floating ? { y: open ? 0 : 'calc(100% - 80px)' } : undefined}
    transition={{ duration: 0.25, ease: 'easeOut' }}
    className={floating ? 'fixed bottom-0 inset-x-0 mx-auto z-50 max-w-screen-lg rounded-t-xl bg-base-200 p-4 shadow-xl max-h-[90dvh] overflow-y-auto' : 'flex flex-col gap-3'}>
    <fieldset disabled={pending} className='flex flex-col gap-3'>
      <label className='flex flex-col gap-1'><span className={floating ? 'sr-only' : ''}>제목</span><input name='title' placeholder={floating && !open ? '방명록을 남겨주세요' : '제목'} required maxLength={200} defaultValue={entry?.title} className={`input input-bordered w-full ${focusStyle}`}  /></label>
      <div className={`flex flex-col gap-3 ${floating && !open ? 'invisible' : ''}`}>
      <label className='flex flex-col gap-1'>내용<textarea name='content' required maxLength={4000} defaultValue={entry?.content} rows={4} className={`textarea textarea-bordered w-full text-base ${focusStyle}`}  /></label>
      <div className='flex flex-wrap gap-2'>
        <label className='flex flex-col gap-1'>아이콘<select name='icon' defaultValue={entry?.icon ?? '🥳'} className={`select select-bordered ${focusStyle}`} >
          {Array.from(new Set([entry?.icon ?? '🥳','🥳','🤪','⭐','🐝','👻','🐷','🐻'])).map(icon => <option key={icon}>{icon}</option>)}
        </select></label>
        <label className='flex flex-1 min-w-32 flex-col gap-1'>이름<input name='username' required maxLength={80} defaultValue={entry?.username} readOnly={!!entry} className={`input input-bordered w-full ${focusStyle}`}  /></label>
        <label className='flex flex-1 min-w-32 flex-col gap-1'>비밀번호<input name='password' type='password' required maxLength={72} autoComplete={entry ? 'current-password' : 'new-password'} className={`input input-bordered w-full ${focusStyle}`}  /></label>
      </div>
      <div className='flex gap-2 justify-end'>
        {floating && <button type='button' className='btn' onClick={close}>닫기</button>}
        {onCancel && <button type='button' className='btn' onClick={onCancel}>취소</button>}
        <button type='submit' className='btn btn-primary'>{pending ? '저장 중…' : entry ? '수정 저장' : '방명록 등록'}</button>
      </div>
      </div>
    </fieldset>
    {error && <p role='alert' className='text-error text-sm'>{error}</p>}
  </motion.form>;
  if (!floating) return form;
  return mounted ? createPortal(<>
    {open && <div className='fixed inset-0 z-40 bg-neutral/60' onClick={close} aria-hidden='true' />}
    {form}
  </>, document.body) : null;
}
