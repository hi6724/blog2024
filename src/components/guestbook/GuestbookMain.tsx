'use client';
import ChatItem from './ChatItem';
import SubmitForm from './SubmitForm';
import { useGuestBookList, useInvalidateGuestbook } from '@/react-query/guestbook';
import { useState } from 'react';

export default function GuestbookMain() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError, refetch } = useGuestBookList({ page_size: 20, sort: 'descending' });
  const invalidateGuestbook = useInvalidateGuestbook();
  const [saved, setSaved] = useState(false);
  const entries = data?.pages.flatMap(page => page.results) ?? [];
  const onChanged = () => { void invalidateGuestbook(); };
  return <div className='px-4 pt-6 pb-28'>
    <h1 className='text-title mb-6'>방명록</h1>
    <div><SubmitForm floating onSaved={() => { setSaved(true); onChanged(); }} />
      {saved && <p role='status' className='text-success mt-2'>방명록이 등록되었습니다.</p>}
    </div>
    {isPending && <p role='status'>방명록을 불러오는 중입니다.</p>}
    {isError && <div role='alert'>방명록을 불러오지 못했습니다. <button className='btn btn-sm' onClick={() => void refetch()}>다시 시도</button></div>}
    {!isPending && !isError && entries.length === 0 && <p>첫 방명록을 남겨주세요.</p>}
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>{entries.map(entry => <ChatItem key={entry.id} data={entry} onChanged={onChanged} />)}</div>
    {hasNextPage && <button disabled={isFetchingNextPage} className='btn block mx-auto mt-6' onClick={() => void fetchNextPage()}>{isFetchingNextPage ? '불러오는 중…' : '방명록 더 보기'}</button>}
  </div>;
}
