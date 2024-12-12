'use client';
import AboutMe from '@/components/main/AboutMe';
import MainBlog from '@/components/main/MainBlog';
import GuestBook from '@/components/main/GuestBook';
import MainProject from '@/components/main/MainProject';
import { Suspense } from 'react';
import { useWorkHistory } from '@/react-query/about-me';
import { getYearMonthDifference } from '@/lib/date';

export default function Main() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <Home />
    </Suspense>
  );
}

function Home() {
  const { data } = useWorkHistory();
  const totalDate = data?.total ?? getYearMonthDifference(new Date(2023, 7, 1), new Date());
  const kbDate = data?.kb ?? getYearMonthDifference(new Date(2024, 11, 1), new Date());

  return (
    <>
      <div className='z-10 relative mt-12 ml-2'>
        <h1 className='text-title text-4xl pl-4 sm:text-6xl'>프론트엔드 개발자</h1>
        <h1 className='text-title font-aggro pl-4 sm:text-6xl text-4xl'>
          <span className='text-accent my-text-shadow'>하훈목</span>입니다
        </h1>
        <div className='flex flex-col'>
          <div className='stats w-full mt-4 *:p-4'>
            <div className='stat'>
              <div className='stat-value'>{totalDate}</div>
              <div className='stat-title'>프론트엔드 개발자</div>
              <div className='stat-desc text-secondary'>현재: 국민은행({kbDate})</div>
            </div>

            <div className='stat'>
              <div className='stat-figure text-primary'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  className='inline-block h-8 w-8 stroke-current'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                  ></path>
                </svg>
              </div>
              <div className='stat-title'>총 유저수</div>
              <div className='stat-value text-primary'>2.1k</div>
              <div className='stat-desc'>의 사용자가 있습니다</div>
            </div>

            <div className='stat'>
              <div className='stat-figure text-secondary'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  className='inline-block h-8 w-8 stroke-current'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M13 10V3L4 14h7v7l9-11h-7z'
                  ></path>
                </svg>
              </div>
              <div className='stat-title'>총 조회수</div>
              <div className='stat-value text-secondary'>4.2k</div>
              <div className='stat-desc'>번 조회되었습니다</div>
            </div>
          </div>

          <p className='text-md mt-4 pl-4'>
            <span className='font-bold text-secondary'> {totalDate}</span> 일하고 있는 프론트엔드 개발자입니다.
            <br />
            주로 react와 next를 사용해서 프로젝트를 진행하고 있습니다. <br />
            트렌드와 프로덕션의 중간에서 효율점을 찾아가며 발전해 나가고 있습니다. 잘 부탁드립니다.
          </p>
        </div>
      </div>

      <AboutMe />
      <MainProject />
      <MainBlog />
      <GuestBook />
    </>
  );
}
