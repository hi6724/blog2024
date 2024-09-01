import AboutmeHeader from '@/components/about-me/AboutmeHeader';
import AboutmeSkills from '@/components/about-me/AboutmeSkills';
import AboutMeTimeLine from '@/components/about-me/AboutMeTimeLine';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: '훈모구 소개',
  description: '하훈목의 포트폴리오 사이트에서 자신에 대해 소개하는 페이지입니다.',
  keywords: ['하훈목', '포트폴리오', '소개', '개발자', '프론트엔드'],
  openGraph: {
    title: '하훈목 소개',
    description: '하훈목의 포트폴리오 사이트에서 자신에 대해 소개하는 페이지입니다.',
    url: 'https://hunmogu.com/about-me', // 실제 URL로 교체
    type: 'website',
    images: [
      {
        url: 'https://firebasestorage.googleapis.com/v0/b/hunmok-fe31e.appspot.com/o/preview%2Faboutme-preview.webp?alt=media&token=7cc50760-b91e-4fba-b1f4-34e4e6690a31',
        width: 2000,
        height: 797,
        alt: '귀여운 코딩하는 강아지 사진',
      },
    ],
  },
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
