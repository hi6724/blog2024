'use client';
import AboutMe from '@/components/main/AboutMe';
import MainBlog from '@/components/main/MainBlog';
import GuestBook from '@/components/main/GuestBook';
import MainProject from '@/components/main/MainProject';
import { Suspense } from 'react';

export default function Main() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <Home />
    </Suspense>
  );
}

function Home() {
  return (
    <>
      <div className='z-10 relative mt-12 ml-2'>
        <h1 className='text-title'>HELLO!</h1>
        <h1 className='text-title'>{"I'M HUNMOK"}</h1>
      </div>

      <AboutMe />
      <MainProject />
      <MainBlog />
      <GuestBook />
    </>
  );
}
