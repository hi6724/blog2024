import AboutmeHeader from '@/components/about-me/AboutmeHeader';
import AboutmeSkills from '@/components/about-me/AboutmeSkills';
import AboutMeTimeLine from '@/components/about-me/AboutMeTimeLine';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '훈모구 소개',
  description: '하훈목의 포트폴리오 사이트에서 자신에 대해 소개하는 페이지입니다.',
  keywords: ['하훈목', '포트폴리오', '소개', '개발자', '프론트엔드'],
};

function page() {
  return (
    <>
      <AboutmeHeader />
      <AboutMeTimeLine />
      <AboutmeSkills />
    </>
  );
}

export default page;
