import { IGuestBook } from '@/react-query/types';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';

function ChatItem({ data }: { data: IGuestBook }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [overflow, setOverFlow] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    setOverFlow(ref.current.scrollHeight > ref.current.offsetHeight);
  }, [ref]);
  return (
    <div className='max-w-96 whitespace-break-spaces'>
      <div className='w-full self-end'>
        <div className='mb-1 ml-1'>
          <span className='text-2xl mr-1'>{data.icon}</span>
          <span>{data.user.username}</span>
          <time className='ml-2 text-xs opacity-50'>{dayjs(data.createdAt).format('YY.MM.DD')}</time>
        </div>
        <div className='px-4 py-2 bg-neutral text-neutral-content rounded-xl w-full self-end'>
          <h2 className='font-semibold mb-2'>{data.title}</h2>
          <motion.p
            ref={ref}
            className='relative overflow-hidden max-h-[4.5rem]'
            animate={{
              maxHeight: open ? `${ref.current?.scrollHeight}px` : '72px',
            }}
          >
            {data.content}
          </motion.p>
          {overflow && (
            <button className='z-10 bg-neutral text-primary' onClick={() => setOpen(!open)}>
              {open ? '접기' : '...더보기'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
export default ChatItem;
