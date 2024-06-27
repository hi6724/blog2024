'use client';
import { v4 as uuidv4 } from 'uuid';
import { useMobile } from '@/hooks/useMobile';
import { IGuestBook } from '@/react-query/types';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

function SubmitForm({
  setItems,
  className,
}: {
  setItems: React.Dispatch<React.SetStateAction<IGuestBook[] | undefined>>;
  className?: string;
}) {
  const emojiList = ['🥳', '🤪', '⭐', '🐝', '👻', '🐷', '🐻'];
  const isMobile = useMobile();
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const gap = isMobile ? '0.5rem' : '1rem';
  const { handleSubmit, register, reset, setValue } = useForm();

  useEffect(() => {
    const randomEmoji = emojiList[Math.floor(Math.random() * emojiList.length)];
    setValue('icon', randomEmoji);
  }, []);

  const onValid = (data: any) => {
    fetch('/api/guestbook', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    reset();
    setItems((p) => {
      const newData = { id: uuidv4(), createdAt: dayjs(), ...data };
      if (p) return [newData, ...p];
      else return [newData];
    });
  };

  return (
    <motion.form
      className={`sticky bottom-0 z-20 p-4 w-full bg-base-200 flex flex-col ${className}`}
      onSubmit={handleSubmit(onValid)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      ref={formRef}
    >
      <label className='input input-bordered flex items-center gap-2 !outline-primary sm:input-lg' tabIndex={0}>
        <input
          type='text'
          className='grow'
          placeholder={open ? '제목' : '방명록을 남겨주세요'}
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
          placeholder='내용'
          className='textarea textarea-bordered sm:textarea-lg  w-full h-full !outline-primary'
          required
          {...register('content', { required: true })}
        ></textarea>
      </motion.div>
      <motion.div
        className='flex flex-col w-full *:w-full gap-2 sm:gap-4 sm:flex-row h-0 overflow-hidden'
        animate={{
          height: open ? '6rem' : 0,
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
              placeholder='이름'
              required
              maxLength={10}
              {...register('user.username', { required: true, maxLength: 10 })}
            />
          </label>
        </div>
        <label className='input input-bordered flex items-center gap-2 !outline-primary sm:input-lg'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 16 16'
            fill='currentColor'
            className='h-4 w-4 opacity-70'
          >
            <path
              fillRule='evenodd'
              d='M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z'
              clipRule='evenodd'
            />
          </svg>
          <input
            required
            type='password'
            className='grow'
            defaultValue=''
            placeholder='비밀번호 (수정 및 삭제시 필요합니다)'
            {...register('user.password', { required: true })}
          />
        </label>
      </motion.div>
    </motion.form>
  );
}
export default SubmitForm;
