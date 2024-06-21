'use client';
import { useMobile } from '@/hooks/useMobile';
import { useGuestBookList } from '@/react-query/guestbook';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { IGuestBook } from '@/react-query/types';
import Link from 'next/link';

function GuestBook() {
  const isMobile = useMobile();
  const { data } = useGuestBookList({ cursor: undefined, page_size: 9, sort: 'descending' });
  const guestBookItems = isMobile ? data?.results.slice(0, 4) : data?.results;

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
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 relative bg-base-100'>
        {guestBookItems?.map((chat, i) => (
          <ChatItem data={chat} key={chat.id} />
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className='py-8 sm:py-16 bg-base-100 z-10 mt-4 mx-2 flex justify-center'
      >
        <Link href={'/blog'} className='btn btn-outline w-full self-center max-w-96'>
          모든 방명록 보기
        </Link>
      </motion.div>
    </div>
  );
}

export default GuestBook;

function ChatItem({ data }: { data: IGuestBook }) {
  return (
    <div className='chat chat-start '>
      <div className='chat-image avatar'>
        <div className='w-10 text-3xl text-center  rounded-full'>{data.icon}</div>
      </div>
      <div className='chat-header self-end mb-1 ml-1'>
        {data.user.username}
        <time className='ml-2 text-xs opacity-50'>{dayjs(data.createdAt).format('YY.MM.DD')}</time>
      </div>
      <div className='chat-bubble w-full h-full'>
        <h2 className='font-semibold mb-2'>{data.title}</h2>
        <p className='line-clamp-3 sm:line-clamp-5 lg:line-clamp-none'>{data.content}</p>
      </div>
    </div>
  );
}
