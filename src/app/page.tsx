'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  return (
    <Container>
      <Header />
    </Container>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <div className='navbar bg-base-100'>
      <div className='flex-none'></div>
      <div className='flex-1'>
        <a className='btn btn-ghost text-3xl font-oranienbaum'>HUNMOK</a>
      </div>
      <div className='flex-none sm:hidden'>
        <div className='dropdown dropdown-end'>
          <div tabIndex={0} role='button' className='btn btn-ghost btn-circle'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h7' />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className='menu menu-lg dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 font-oranienbaum text-2xl'
          >
            <li>
              <a>HOME</a>
            </li>
            <li>
              <a>ABOUT ME</a>
            </li>
            <li>
              <a>PROJECTS</a>
            </li>
            <li>
              <a>BLOG</a>
            </li>
          </ul>
        </div>
      </div>
      {/* desktop */}
      <div className='hidden sm:flex gap-4 font-oranienbaum text-2xl *:link *:link-hover'>
        <Link href={'/'}>HOME</Link>
        <Link href={'/'}>ABOUT ME</Link>
        <Link href={'/'}>PROJECTS</Link>
        <Link href={'/'}>BLOG</Link>
      </div>
    </div>
  );
}

function Container({ children }: any) {
  return (
    <div className='flex justify-center w-[100vw]'>
      <div className='max-w-5xl px-4 w-full'>{children}</div>
    </div>
  );
}
