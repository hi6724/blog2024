'use client';

import { animateScroll } from 'react-scroll';
import { v4 as uuidv4 } from 'uuid';
import { useMobile } from '@/hooks/useMobile';
import { IComment, IGuestBook } from '@/react-query/types';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import useUser from '@/hooks/useUser';
import { usePathname } from 'next/navigation';

function SubmitForm({
  setItems,
  className,
  id,
  commentsLength,
}: {
  setItems: React.Dispatch<React.SetStateAction<IComment[]>>;
  className?: string;
  id: string;
  commentsLength: number;
}) {
  const { user, createOrUpdateUser } = useUser();
  const [prevScrollY, setPrevScrollY] = useState(0);
  const pathname = usePathname();

  const emojiList = ['🥳', '🤪', '⭐', '🐝', '👻', '🐷', '🐻'];
  const isMobile = useMobile();
  const formRef = useRef<HTMLFormElement>(null);
  const { handleSubmit, register, reset, setValue, watch } = useFormContext();

  const onValid = (data: any) => {
    const confirmResult = confirm('댓글은 수정과 삭제가 불가능합니다.\n등록하시겠습니까?');
    if (!confirmResult) return;
    onValidNewPost(data);
    reset();
    closeForm();
  };

  const onValidNewPost = (data: any) => {
    const userId = createOrUpdateUser({ icon: data.icon, username: data.username });
    const newData = { ...data, userId, commentsLength: commentsLength + 1 };

    fetch(`/api/project/${id}`, {
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
        className={`fixed -bottom-44 left-1/2 -translate-x-1/2 sm:-bottom-60 z-[301] py-2 bg-transparent flex flex-col w-full max-w-screen-lg overflow-hidden gap-2 ${className}`}
        onSubmit={handleSubmit(onValid)}
        onClick={openForm}
        ref={formRef}
        animate={{
          bottom: watch('open') ? '0' : isMobile ? '-4rem' : '-5rem',
          backgroundColor: watch('open') ? 'var(--fallback-b2, oklch(var(--b2)' : 'rgba(255,255,255,0)',
        }}
      >
        <div className='px-2 pb-4'>
          <textarea
            className='textarea textarea-md text-[1rem] textarea-bordered sm:textarea-lg w-full h-full  resize-none overflow-hidden focus:border-primary focus:border-2'
            placeholder={!watch('isEdit') ? (watch('open') ? '내용' : '댓글을 남겨주세요') : watch('prevData.content')}
            required
            {...register('content', { required: true })}
          />
        </div>

        <motion.div
          className='flex w-screen max-w-screen-lg gap-2 sm:flex-row overflow-hidden px-2 h-12 sm:h-16'
          animate={{
            overflow: watch('open') ? 'visible' : 'hidden',
          }}
        >
          <select
            className='select w-20 sm:select-lg !outline-none focus:!outline-primary border border-base-content border-opacity-20'
            {...register('icon')}
          >
            {emojiList.map((el) => (
              <option key={el} value={el}>
                {el}
              </option>
            ))}
          </select>

          <label className='input input-bordered flex items-center gap-2 !outline-primary relative w-[calc(100vw-6.5rem)] sm:input-lg'>
            <input
              type='text'
              placeholder='이름'
              required
              maxLength={10}
              {...register('username', { required: true, maxLength: 10 })}
            />
          </label>
        </motion.div>
        <button
          type='submit'
          className='absolute right-4 top-5 hover:ring-2 focus:ring-2 ring-primary p-2 outline-none rounded-md'
        >
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
      </motion.form>
      {watch('open') && (
        <div className='z-[300] fixed top-0 left-0 bg-neutral/60 w-full h-screen' onClick={onClickBackdrop} />
      )}
    </>
  );
}
export default SubmitForm;
