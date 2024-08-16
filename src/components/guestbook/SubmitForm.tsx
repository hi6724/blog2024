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
  const [prevScrollY, setPrevScrollY] = useState(0);
  const pathname = usePathname();

  const emojiList = ['🥳', '🤪', '⭐', '🐝', '👻', '🐷', '🐻'];
  const isMobile = useMobile();
  const formRef = useRef<HTMLFormElement>(null);
  const { handleSubmit, register, reset, setValue, watch } = useFormContext();

  const onValid = (data: any) => {
    if (data.isEdit) onValidEditPost(data);
    else onValidNewPost(data);
    reset();
    closeForm();
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

  const setUserInfo = () => {
    if (!user) return;
    setValue('username', user.username);
    setValue('userId', user.userId);
    setValue('icon', user.icon);
  };
  useEffect(() => {
    setUserInfo();
  }, [user]);

  const onClickBackdrop = () => {
    closeForm();
    if (watch('isEdit')) {
      reset();
      setUserInfo();
    }
  };
  const openForm = () => {
    if (watch('open')) return;
    setPrevScrollY(window.scrollY);
    setValue('open', true);
  };

  const closeForm = () => {
    if (!watch('open')) return;
    setValue('open', false);
    window.scrollTo(0, prevScrollY);
  };

  return (
    <>
      <motion.form
        id='guestbook-form'
        className={`fixed -bottom-44 sm:-bottom-60 z-50 py-2 bg-base-200 flex flex-col w-full max-w-screen-lg overflow-hidden gap-2 ${className}`}
        onSubmit={handleSubmit(onValid)}
        onClick={openForm}
        ref={formRef}
        animate={{
          bottom: watch('open') ? '0' : isMobile ? '-10rem' : '-14rem',
        }}
      >
        {watch('isEdit') && (
          <motion.div
            className='flex justify-between items-baseline h-12'
            animate={{
              overflow: watch('open') ? 'hidden' : '0rem',
            }}
          >
            <h2>수정하시겠습니까?</h2>
            <div className='flex gap-2'>
              <div
                className='btn btn-outline btn-error btn-sm'
                onClick={(e) => {
                  e.stopPropagation();
                  closeForm();
                  reset();
                  if (user && !watch('isEdit')) {
                    setValue('username', user.username);
                    setValue('userId', user.userId);
                    setValue('icon', user.icon);
                  }
                }}
              >
                취소
              </div>
              <button className='btn btn-outline btn-info btn-sm'>확인</button>
            </div>
          </motion.div>
        )}
        <div className='px-2 pb-4'>
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
          className='overflow-hidden px-2 h-24 sm:h-36 '
          animate={{
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
          className='flex w-screen max-w-screen-lg gap-2 sm:flex-row overflow-hidden px-2  h-12 sm:h-16'
          animate={{
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
        <div className='z-20 fixed top-0 left-0 bg-neutral/60 w-full h-screen' onClick={onClickBackdrop} />
      )}
    </>
  );
}
export default SubmitForm;
