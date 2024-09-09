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
        <h1 className='text-title text-4xl sm:text-6xl'>프론트엔드 개발자</h1>
        <h1 className='text-title font-aggro sm:text-6xl text-4xl'>
          <span className='text-accent my-text-shadow'>하훈목</span>입니다
        </h1>
      </div>

      <AboutMe />
      <MainProject />
      <MainBlog />
      <GuestBook />
    </>
  );
}
