'use client';
import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import AboutMe from '@/components/main/AboutMe';
import Blog from '@/components/main/Blog';
import GuestBook from '@/components/main/GuestBook';
import Project from '@/components/main/Project';
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
    <Container>
      <NavBar />
      <div className='z-10 relative mt-12'>
        <h1 className='text-title'>HELLO!</h1>
        <h1 className='text-title'>{"I'M HUNMOK"}</h1>
      </div>

      <AboutMe />
      <Project />
      <Blog />
      <GuestBook />
      <div className='h-16'></div>
      <Footer />
    </Container>
  );
}

function Container({ children }: any) {
  return (
    <div className='flex justify-center w-full'>
      <div className='max-w-5xl px-4 w-full'>{children}</div>
    </div>
  );
}
