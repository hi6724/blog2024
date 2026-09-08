'use client';
import type { IGuestBook } from '@/react-query/types';
import dayjs from 'dayjs';
import { useState, type FormEvent } from 'react';
import SubmitForm from './SubmitForm';

export default function ChatItem({ data, onChanged }: { data: IGuestBook; onChanged?: () => void }) {
  const [mode, setMode] = useState<'edit' | 'delete' | null>(null);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [expanded, setExpanded] = useState(false);
  async function remove(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const password = new FormData(event.currentTarget).get('password');
    setPending(true); setError('');
    try {
      const response = await fetch(`/api/guestbook/${data.id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? '삭제하지 못했습니다.');
      setMode(null); onChanged?.();
    } catch (error) { setError(error instanceof Error ? error.message : '삭제하지 못했습니다.'); }
    finally { setPending(false); }
  }
  return <article aria-label={`${data.username}의 방명록`} className='min-w-0 break-words'>
    <div className='flex items-center gap-2 mb-2'><span className='text-2xl'>{data.icon}</span><span>{data.username}</span><time className='text-xs opacity-60'>{dayjs(data.createdAt).format('YY.MM.DD')}</time></div>
    <div className='p-4 bg-base-200 shadow-md rounded-xl'>
      <h2 className='font-semibold mb-2'>{data.title}</h2>
      <p className={`whitespace-pre-wrap ${!expanded && data.content.length > 120 ? 'line-clamp-4' : ''}`}>{data.content}</p>
      {data.content.length > 120 && <button className='text-primary text-sm mt-1' onClick={() => setExpanded(!expanded)}>{expanded ? '접기' : '더보기'}</button>}
      {onChanged && !mode && <div className='flex gap-2 mt-3'>
        <button className='btn btn-ghost btn-xs' onClick={() => { setMode('edit'); setError(''); }}>수정</button>
        <button className='btn btn-ghost btn-xs' onClick={() => { setMode('delete'); setError(''); }}>삭제</button>
      </div>}
      {mode === 'edit' && <SubmitForm entry={data} onCancel={() => setMode(null)} onSaved={() => { setMode(null); onChanged?.(); }} />}
      {mode === 'delete' && <form onSubmit={remove} aria-label='방명록 삭제' className='mt-3 flex flex-col gap-2'>
        <p className='text-sm'>삭제하려면 이 글의 비밀번호를 입력해주세요.</p>
        <label>비밀번호<input name='password' type='password' required maxLength={72} disabled={pending} className='input input-bordered w-full' /></label>
        <div className='flex gap-2 justify-end'><button type='button' disabled={pending} className='btn btn-sm' onClick={() => setMode(null)}>취소</button><button type='submit' disabled={pending} className='btn btn-sm btn-error'>{pending ? '삭제 중…' : '삭제 확인'}</button></div>
        {error && <p role='alert' className='text-error text-sm'>{error}</p>}
      </form>}
    </div>
  </article>;
}
