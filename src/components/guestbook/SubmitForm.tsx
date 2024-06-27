'use client';

import { v4 as uuidv4 } from 'uuid';
import { useMobile } from '@/hooks/useMobile';
import { IGuestBook } from '@/react-query/types';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import useUser from '@/hooks/useUser';

function SubmitForm({
  setItems,
  className,
  setEditItems,
}: {
  setItems: React.Dispatch<React.SetStateAction<IGuestBook[]>>;
  setEditItems: React.Dispatch<React.SetStateAction<IGuestBook[]>>;
  className?: string;
}) {
  const { user, createOrUpdateUser } = useUser();

  const emojiList = ['🥳', '🤪', '⭐', '🐝', '👻', '🐷', '🐻'];
  const isMobile = useMobile();
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const gap = isMobile ? '0.5rem' : '0.5rem';
  const { handleSubmit, register, reset, setValue, watch } = useFormContext();

  const onValid = (data: any) => {
    if (data.isEdit) onValidEditPost(data);
    else onValidNewPost(data);
  };

  const onValidNewPost = (data: any) => {
    const userId = createOrUpdateUser({ icon: data.icon, username: data.username });
    const newData = { ...data, userId };
    fetch('/api/guestbook', {
      method: 'POST',
      body: JSON.stringify(newData),
    });
    reset({ title: '', content: '' });

    setItems((p) => {
      const newSubmittedData = { createdAt: dayjs(), id: uuidv4(), icon: newData.icon, ...newData };
      if (p) return [newSubmittedData, ...p];
      else return [newSubmittedData];
    });
  };

  const onValidEditPost = (data: any) => {
    const { content, id, icon, title, userId, username } = data;
    if (userId !== user?.userId) return;

    fetch('/api/guestbook/edit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setEditItems((p) => [{ content, id, icon, title, userId, username, createdAt: dayjs().toString() }, ...p]);
  };

  useEffect(() => {
    if (!user) return;
    setValue('username', user.username);
    setValue('userId', user.userId);
    setValue('icon', user.icon);
  }, [user]);

  return (
    <motion.form
      className={`sticky bottom-0 z-20 p-2 w-full bg-base-200 flex flex-col ${className}`}
      onSubmit={handleSubmit(onValid)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      ref={formRef}
    >
      {watch('isEdit') && (
        <motion.div
          className='flex justify-between items-baseline'
          animate={{
            height: open ? '3rem' : '0rem',
            overflow: open ? 'hidden' : '0rem',
          }}
        >
          <h2>수정하시겠습니까?</h2>
          <div className='flex gap-2'>
            <button
              className='btn btn-outline btn-error btn-sm'
              onClick={() => {
                reset();
                setValue('username', user!.username);
                setValue('userId', user!.userId);
                setValue('icon', user!.icon);
                setOpen(false);
              }}
            >
              취소
            </button>
            <button className='btn btn-outline btn-info btn-sm'>확인</button>
          </div>
        </motion.div>
      )}
      <label className='input input-bordered flex items-center gap-2 !outline-primary sm:input-lg' tabIndex={0}>
        <input
          type='text'
          className='grow'
          placeholder={!watch('isEdit') ? (open ? '제목' : '방명록을 남겨주세요') : watch('prevData.title')}
          required
          {...register('title', { required: true })}
        />
        <button type='submit' tabIndex={9}>
          <svg
            data-slot='icon'
            fill='none'
            strokeWidth='1.5'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
            aria-hidden='true'
            className='w-6 h-6 cursor-pointer'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5'
            ></path>
          </svg>
        </button>
      </label>

      <motion.div
        className='h-0 overflow-hidden'
        animate={{
          height: open ? (isMobile ? '6rem' : '9rem') : 0,
          marginTop: open ? gap : 0,
          overflow: open ? 'visible' : 'hidden',
        }}
      >
        <textarea
          placeholder={!watch('isEdit') ? '내용' : watch('prevData.content')}
          className='textarea textarea-bordered sm:textarea-lg  w-full h-full !outline-primary'
          required
          {...register('content', { required: true })}
        ></textarea>
      </motion.div>
      <motion.div
        className='flex flex-col w-full *:w-full gap-2 sm:flex-row h-0 overflow-hidden'
        animate={{
          height: open ? (isMobile ? '3rem' : '4rem') : 0,
          marginTop: open ? gap : 0,
          overflow: open ? 'visible' : 'hidden',
        }}
      >
        <div className='flex gap-2 w-full'>
          <select className='select !outline-primary !w-20 sm:select-lg' {...register('icon')}>
            {emojiList.map((el) => (
              <option key={el} value={el}>
                {el}
              </option>
            ))}
          </select>
          <label className='input input-bordered flex items-center gap-2 !outline-primary relative w-full sm:input-lg'>
            <input
              type='text'
              className='grow'
              placeholder={!watch('isEdit') ? '이름' : watch('prevData.username')}
              required
              maxLength={10}
              {...register('username', { required: true, maxLength: 10 })}
            />
          </label>
        </div>
      </motion.div>
    </motion.form>
  );
}
export default SubmitForm;
