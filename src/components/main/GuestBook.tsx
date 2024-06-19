'use client';
import { useMobile } from '@/hooks/useMobile';
import { useGuestBookList } from '@/react-query/guestbook';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { IGuestBook } from '@/react-query/types';

function GuestBook() {
  const isMobile = useMobile();
  const { data } = useGuestBookList({ cursor: undefined, page_size: isMobile ? 6 : 9, sort: 'descending' });

  return (
    <div>
      <div className='h-[25vh]' />
      <motion.h1
        className='text-title bg-opacity-30 backdrop-blur-lg p-2 z-10 sticky top-16 bg-base-100 '
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        GUESTBOOK
      </motion.h1>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {data && data.results?.map((chat, i) => <ChatItem data={chat} key={chat.id} />)}
      </div>
      <button className='btn btn-outline w-full mt-4'>READ MORE</button>
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
