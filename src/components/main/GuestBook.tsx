'use client';
import { useMobile } from '@/hooks/useMobile';
import { useGuestBookList } from '@/react-query/guestbook';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ChatItem from '../guestbook/ChatItem';
import SubmitForm from '../guestbook/SubmitForm';
import { IGuestBook } from '@/react-query/types';
import { useState } from 'react';

function GuestBook() {
  const { data } = useGuestBookList({ page_size: 9, sort: 'descending' });
  const guestBookItems = data?.pages.reduce((prev: IGuestBook[], crr) => [...prev, ...crr.results], []);
  const [submittedItems, setSubmittedItems] = useState<IGuestBook[] | undefined>();

  return (
    <div>
      <div className='h-[25vh]' />
      <motion.h1
        className='text-title p-2 z-20 sticky top-14 bg-base-100 '
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        GUESTBOOK
      </motion.h1>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 relative bg-base-100 p-2'>
        {submittedItems?.map((chat, i) => (
          <ChatItem data={chat} key={chat.id} />
        ))}
        {guestBookItems?.map((chat, i) => (
          <ChatItem data={chat} key={chat.id} />
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className='py-8 sm:py-12 bg-base-100 z-10 mt-4 mx-2 flex justify-center'
      >
        <Link href={'/guestbook'} className='btn btn-outline w-full self-center max-w-96'>
          모든 방명록 보기
        </Link>
      </motion.div>
      <SubmitForm className='!relative' setItems={setSubmittedItems} />
    </div>
  );
}

export default GuestBook;
