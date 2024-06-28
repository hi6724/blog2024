'use client';

import { animateScroll } from 'react-scroll';
import { v4 as uuidv4 } from 'uuid';
import { useMobile } from '@/hooks/useMobile';
import { IGuestBook } from '@/react-query/types';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import useUser from '@/hooks/useUser';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();

  const emojiList = ['🥳', '🤪', '⭐', '🐝', '👻', '🐷', '🐻'];
  const isMobile = useMobile();
  const formRef = useRef<HTMLFormElement>(null);
  const gap = isMobile ? '0.5rem' : '0.5rem';
  const { handleSubmit, register, reset, setValue, watch } = useFormContext();

  const onValid = (data: any) => {
    if (data.isEdit) onValidEditPost(data);
    else onValidNewPost(data);
    reset();
    setValue('open', false);
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
    if (pathname === '/guestbook') animateScroll.scrollToTop;
  };

  const onValidEditPost = (data: any) => {
    const { content, id, icon, title, userId, username } = data;
    if (userId !== user?.userId) return;
    createOrUpdateUser({ icon: data.icon, username: data.username });
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

  useEffect(() => {
    const handleScroll = (setValue: any) => {
      const scrollHandler = () => {
        console.log('SCROLL');
        setValue('open', false);
      };
      window.addEventListener('scroll', scrollHandler);

      return () => {
        window.removeEventListener('scroll', scrollHandler);
      };
    };

    const cleanup = handleScroll(setValue);
    return cleanup;
  }, []);
  return (
    <>
      <motion.form
        className={`sticky bottom-0 z-50 pt-2 pb-6 bg-base-200 flex flex-col w-full max-w-[100vw] overflow-hidden ${className}`}
        onSubmit={handleSubmit(onValid)}
        onClick={() => {
          if (!watch('open')) setValue('open', true);
          if (!user || watch('isEdit')) return;
          setValue('username', user.username);
          setValue('userId', user.userId);
          setValue('icon', user.icon);
        }}
        ref={formRef}
      >
        {watch('isEdit') && (
          <motion.div
            className='flex justify-between items-baseline'
            animate={{
              height: watch('open') ? '3rem' : '0rem',
              overflow: watch('open') ? 'hidden' : '0rem',
            }}
          >
            <h2>수정하시겠습니까?</h2>
            <div className='flex gap-2'>
              <div
                className='btn btn-outline btn-error btn-sm'
                onClick={(e) => {
                  e.stopPropagation();
                  setValue('open', false);
                  reset();
                }}
              >
                취소
              </div>
              <button className='btn btn-outline btn-info btn-sm'>확인</button>
            </div>
          </motion.div>
        )}
        <div className='px-2'>
          <label className='input input-bordered flex items-center gap-2 !outline-primary sm:input-lg' tabIndex={0}>
            <input
              type='text'
              className='grow'
              placeholder={
                !watch('isEdit') ? (watch('open') ? '제목' : '방명록을 남겨주세요') : watch('prevData.title')
              }
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
        </div>
        <motion.div
          className='h-0 overflow-hidden px-2'
          animate={{
            height: watch('open') ? (isMobile ? '6rem' : '9rem') : 0,
            marginTop: watch('open') ? gap : 0,
            overflow: watch('open') ? 'visible' : 'hidden',
          }}
        >
          <textarea
            placeholder={!watch('isEdit') ? '내용' : watch('prevData.content')}
            className='textarea textarea-md text-[1rem] textarea-bordered sm:textarea-lg  w-full h-full !outline-primary'
            required
            {...register('content', { required: true })}
          ></textarea>
        </motion.div>
        <motion.div
          className='flex w-screen max-w-screen-lg gap-2 sm:flex-row h-0 overflow-hidden px-2'
          animate={{
            height: watch('open') ? (isMobile ? '3rem' : '4rem') : 0,
            marginTop: watch('open') ? gap : 0,
            overflow: watch('open') ? 'visible' : 'hidden',
          }}
        >
          <select className='select !outline-primary w-20 sm:select-lg' {...register('icon')}>
            {emojiList.map((el) => (
              <option key={el} value={el}>
                {el}
              </option>
            ))}
          </select>
          <label className='input input-bordered flex items-center gap-2 !outline-primary relative w-[calc(100vw-6.5rem)] sm:input-lg'>
            <input
              type='text'
              placeholder={!watch('isEdit') ? '이름' : watch('prevData.username')}
              required
              maxLength={10}
              {...register('username', { required: true, maxLength: 10 })}
            />
          </label>
        </motion.div>
      </motion.form>
      {watch('open') && (
        <div
          className='z-20 fixed top-0 left-0 bg-neutral/60 w-full h-screen'
          onClick={() => setValue('open', false)}
        />
      )}
    </>
  );
}
export default SubmitForm;
