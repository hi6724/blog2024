'use client';
import { useMobile } from '@/hooks/useMobile';
import { useGuestBookList } from '@/react-query/guestbook';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import Link from 'next/link';
import ChatItem from '../guestbook/ChatItem';
import SubmitForm from '../guestbook/SubmitForm';
import { IGuestBook } from '@/react-query/types';
import { useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

function GuestBook() {
  const { data } = useGuestBookList({ page_size: 9, sort: 'descending' });
  const guestBookItems = data?.pages.reduce((prev: IGuestBook[], crr) => [...prev, ...crr.results], []) ?? [];
  const [submittedItems, setSubmittedItems] = useState<IGuestBook[]>([]);
  const [editItems, setEditItems] = useState<IGuestBook[]>([]);
  const editItemsIds = editItems.map((el) => el.id);
  const methods = useForm();

  const scrollRef = useRef(null);
  const [animationY, setAnimationY] = useState(0);
  const { scrollYProgress } = useScroll({ target: scrollRef, offset: ['start end', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', setAnimationY);

  return (
    <FormProvider {...methods}>
      <div ref={scrollRef}>
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
          {[...submittedItems, ...guestBookItems]?.map((chat, i) => {
            if (editItemsIds.includes(chat.id))
              return <ChatItem data={editItems.find((el) => chat.id === el.id) as IGuestBook} key={chat.id} />;
            return <ChatItem data={chat} key={chat.id} />;
          })}
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
        <motion.div
          className='sticky bottom-0'
          initial={{ opacity: 0 }}
          animate={{
            opacity: animationY > 0.5 ? 1 : 0,
            scale: animationY > 0.5 ? 1 : 0.85,
          }}
        >
          <SubmitForm setItems={setSubmittedItems} setEditItems={setEditItems} />
        </motion.div>
      </div>
    </FormProvider>
  );
}

export default GuestBook;
