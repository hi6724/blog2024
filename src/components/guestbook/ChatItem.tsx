import { IGuestBook } from '@/react-query/types';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import useUser from '@/hooks/useUser';
import { useFormContext } from 'react-hook-form';

function ChatItem({ data }: { data: IGuestBook }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [overflow, setOverFlow] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const [isMine, setIsMine] = useState(user?.userId === data.userId);
  const { setFocus, setValue } = useFormContext();
  const [deleted, setDeleted] = useState(false);
  const isLoading = data.id.includes('tempID');

  useEffect(() => {
    if (!ref.current) return;
    setOverFlow(ref.current.scrollHeight > ref.current.offsetHeight);
    setIsMine(data.userId === user?.userId);
  }, [ref, user]);

  const colorClassName = isMine ? 'bg-accent text-accent-content' : '';

  const handleStartEdit = () => {
    setValue('title', data.title);
    setValue('content', data.content);
    setValue('isEdit', true);
    setValue('open', true);
    setValue('id', data.id);
    setValue('username', data.username);
    setValue('icon', data.icon);
    setValue('prevData', { title: data.title, content: data.content, username: data.username });
    setFocus('title');
  };
  const handleDelete = () => {
    const confirmResult = confirm('정말 삭제하시겠습니까?');
    if (!confirmResult) return;
    fetch(`/api/guestbook/${data.id}`, {
      method: 'DELETE',
    });
    setDeleted(true);
  };
  if (deleted) return null;
  return (
    <div className='max-w-96 whitespace-break-spaces relative'>
      <div className='w-full self-end'>
        <div className='flex justify-between mb-1 mx-1'>
          <div>
            <span className='text-2xl mr-1'>{data.icon}</span>
            <span>{data.username}</span>
            <time className='ml-2 text-xs opacity-50'>{dayjs(data.createdAt).format('YY.MM.DD')}</time>
          </div>

          {isMine && (
            <div className='flex gap-1'>
              <button onClick={handleDelete}>
                <svg
                  data-slot='icon'
                  fill='none'
                  strokeWidth='2.5'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                  aria-hidden='true'
                  className={`w-5 h-5 text-error hover:scale-125 transition-all rounded-full`}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
                  ></path>
                </svg>
              </button>

              <button onClick={handleStartEdit}>
                <svg
                  data-slot='icon'
                  fill='none'
                  strokeWidth='2.5'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                  aria-hidden='true'
                  className={`w-5 h-5 text-success/80 hover:scale-125 transition-all rounded-full`}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10'
                  ></path>
                </svg>
              </button>
            </div>
          )}
        </div>
        <div className={`px-4 py-2 bg-neutral text-neutral-content ${colorClassName} rounded-xl w-full self-end`}>
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

          <div className='bg-primary text-primary-content'></div>
        </div>
      </div>
      {isLoading && (
        <div className='absolute left-0 top-0 z-10 bg-neutral/60 w-full h-full rounded-lg flex items-center justify-center text-neutral-content font-bold'>
          Loading...
        </div>
      )}
    </div>
  );
}
export default ChatItem;
