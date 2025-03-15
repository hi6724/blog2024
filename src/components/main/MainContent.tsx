'use client';
import AboutMe from '@/components/main/AboutMe';
import MainBlog from '@/components/main/MainBlog';
import GuestBook from '@/components/main/GuestBook';
import MainProject from '@/components/main/MainProject';
import { useAboutMeList, useWorkHistory } from '@/react-query/about-me';
import { getFormatDateWithDay, getYearMonthDifference } from '@/lib/date';
import React from 'react';

// DB로 변경하기
const DESCRIPTION = {
  mobile: [
    '동안 개발자로 일하고 있습니다.',
    '주로 react와 next를 사용합니다.',
    '트렌드를 따라가며 꾸준히 발전하고 있습니다.',
    '잘 부탁드립니다.',
  ],
  pc: [
    '동안 프론트엔드 개발자로 일하고 있는 하훈목입니다.',
    '주로 react와 next를 사용해서 프로젝트를 진행하고 있습니다.',
    '트렌드와 프로덕션의 중간에서 효율점을 찾아가며 발전해 나가고 있습니다. 잘 부탁드립니다.',
  ],
};

export function MainContent({
  totalViews,
  totalBlogPostCnt,
  totalGuestbookCnt,
}: {
  totalViews: number;
  totalBlogPostCnt: number;
  totalGuestbookCnt: number;
}) {
  const { data: aboutMe } = useAboutMeList();

  const jobHistory = aboutMe
    ?.filter((el) => {
      const isJob = el.tags.some((tag) => tag?.name === 'job');
      return isJob;
    })
    .map((el) => {
      if (!el.date?.start) return;
      const startDate = new Date(el.date.start);
      const isNow = !el.date.end;
      const endDate = el.date?.end ? new Date(el.date.end) : new Date();
      const differenceInMillis = endDate.getTime() - startDate.getTime();
      const differenceInDays = differenceInMillis / (1000 * 60 * 60 * 24);
      return { title: el.title, day: Math.ceil(differenceInDays), isNow };
    }, 0);

  const totalDate = jobHistory?.reduce((acc, cur) => acc + (cur?.day ?? 0), 0);
  const nowData = jobHistory?.find((el) => el?.isNow);
  const nowWorkDate = nowData?.day;
  const formattedNowWorkDate = getFormatDateWithDay(nowWorkDate ?? 80);
  const formattedTotalWorkDate = getFormatDateWithDay(totalDate ?? 524);

  return (
    <>
      <div className='z-10 relative mt-12 ml-2'>
        <h1 className='text-title text-4xl pl-4 sm:text-6xl'>프론트엔드 개발자</h1>
        <h1 className='text-title font-aggro pl-4 sm:text-6xl text-4xl'>
          <span className='text-accent my-text-shadow'>하훈목</span>입니다
        </h1>
        <div className='flex flex-col pr-4'>
          <p className='text-md mt-4 pl-4'>
            <span className='font-bold text-secondary'> {formattedTotalWorkDate}</span>
            {DESCRIPTION.mobile.map((el, i) => (
              <React.Fragment key={el + i}>
                <span className='md:hidden'>{el}</span>
                <br className='md:hidden' />
              </React.Fragment>
            ))}
            {DESCRIPTION.pc.map((el, i) => (
              <React.Fragment key={el + i}>
                <span className='hidden md:inline-block'>{el}</span>
                <br className='hidden md:block' />
              </React.Fragment>
            ))}
          </p>

          <div className='stats stats-vertical sm:stats-horizontal sm:grid-rows-2 lg:grid-rows-1 w-full mt-4 *:p-4'>
            <div className='stat'>
              <div className='stat-value'>{formattedTotalWorkDate}</div>
              <div className='stat-title text-secondary'>
                현재: {nowData?.title}({formattedNowWorkDate})
              </div>
            </div>

            <div className='stat sm:border-opacity-0 lg:border-opacity-10'>
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
              <div className='stat-title'>포스트</div>
              <div className='stat-value'>{totalBlogPostCnt}</div>
              <div className='stat-desc'>개의 포스트를 작성했습니다.</div>
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
              <div className='stat-title'>방명록</div>
              <div className='stat-value'>{totalGuestbookCnt}</div>
              <div className='stat-desc'>개의 방명록이 작성되었습니다.</div>
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
              <div className='stat-value'>{totalViews}</div>
              <div className='stat-desc'>번 조회되었습니다</div>
            </div>
          </div>
        </div>
      </div>

      <AboutMe />
      <MainProject />
      <MainBlog />
      <GuestBook />
    </>
  );
}
