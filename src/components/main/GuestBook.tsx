'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function GuestBook() {
  return (
    <div>
      <div className='h-[25vh]' />
      <motion.h1
        className='text-6xl font-oranienbaum text-shadow shadow-base-content z-10 sticky top-16 bg-base-100 text-base-content bg-opacity-30 backdrop-blur-lg p-2'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        GUESTBOOK
      </motion.h1>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        <ChatItem
          text='You were the Chosen One! You were the Chosen One! You were the Chosen One! You were the Chosen One! You were the
        '
        />
        <ChatItem text='hello' />
        <ChatItem text='hello' />
        <ChatItem text='hello' />
      </div>
      <button className='btn btn-outline w-full mt-4'>READ MORE</button>
    </div>
  );
}

export default GuestBook;

function ChatItem({ text }: any) {
  return (
    <div className='chat chat-start max-w-96 '>
      <div className='chat-image avatar'>
        <div className='w-10 text-3xl text-center  rounded-full'>🥰</div>
      </div>
      <div className='chat-header mb-1'>
        Obi-Wan Kenobi
        <time className='ml-2 text-xs opacity-50'>24.06.06</time>
      </div>
      <div className='chat-bubble line-clamp-3 sm:line-clamp-5 lg:line-clamp-none'>{text}</div>
    </div>
  );
}
