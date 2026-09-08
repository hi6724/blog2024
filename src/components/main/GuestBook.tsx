'use client';
import { useGuestBookList, useInvalidateGuestbook } from '@/react-query/guestbook';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import ChatItem from '../guestbook/ChatItem';
import SubmitForm from '../guestbook/SubmitForm';

export default function GuestBook() {
  const { data, isError, refetch } = useGuestBookList({ page_size: 9, sort: 'descending' });
  const invalidateGuestbook = useInvalidateGuestbook();
  const formAnchor = useRef<HTMLDivElement>(null);
  const showForm = useInView(formAnchor);
  const items = data?.pages.flatMap(page => page.results) ?? [];
  return <div>
    <div className='h-[25vh]' />
    <motion.h1 className='text-title p-2 sticky top-14 bg-base-100' initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>방명록</motion.h1>
    {isError && <p role='alert'>방명록을 불러오지 못했습니다. <button className='btn btn-sm' onClick={() => void refetch()}>다시 시도</button></p>}
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 bg-base-100 p-2'>
      {items.map(item => <ChatItem key={item.id} data={item} />)}
    </div>
    <div className='py-8 mx-2 flex justify-center'><Link href='/guestbook' className='btn btn-primary w-full max-w-96'>모든 방명록 보기</Link></div>
    <div ref={formAnchor} className='h-28'>{showForm && <SubmitForm floating onSaved={() => { void invalidateGuestbook(); }} />}</div>
  </div>;
}
