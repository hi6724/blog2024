'use client';
import AboutmeHeader from '@/components/about-me/AboutmeHeader';
import AboutMeTimeLine from '@/components/about-me/AboutMeTimeLine';

function page() {
  return (
    <>
      <AboutmeHeader />
      <AboutMeTimeLine />
      <div className='h-screen'></div>
    </>
  );
}

export default page;
