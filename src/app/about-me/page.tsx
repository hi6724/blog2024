import AboutmeHeader from '@/components/about-me/AboutmeHeader';
import AboutmeSkills from '@/components/about-me/AboutmeSkills';
import AboutMeTimeLine from '@/components/about-me/AboutMeTimeLine';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '훈모구 소개 - 프론트엔드 개발자 경력 소개',
  description:
    '싸피(SSAFY) 수료 후 티맥스핀테크에서 1년간 근무하고, 현재는 KB국민은행에서 프론트엔드 개발자로 재직 중입니다. 핀테크 현장에서 쌓은 실무 경험과 기술 역량을 소개합니다.',
  keywords: [
    '프론트엔드',
    '개발자 소개',
    '국민은행',
    '티맥스핀테크',
    '싸피',
    '핀테크',
    '포트폴리오',
    'React',
    'Next.js',
    '신입 개발자',
    '개발자 성장',
    '성능 최적화',
  ],
  openGraph: {
    title: '훈모구 소개 - 프론트엔드 개발자 경력과 성장 스토리',
    description:
      '훈모구는 싸피 수료 후 티맥스핀테크에서 1년간 근무했으며, 현재는 KB국민은행에서 프론트엔드 개발자로 일하고 있습니다. 실무 중심의 경험과 기술 스택을 소개합니다.',
    url: 'https://hunmogu.com/about-me',
    type: 'website',
    images: [
      {
        url: 'https://firebasestorage.googleapis.com/v0/b/hunmok-fe31e.appspot.com/o/preview%2Faboutme-preview.webp?alt=media&token=7cc50760-b91e-4fba-b1f4-34e4e6690a31',
        width: 2000,
        height: 797,
        alt: '프론트엔드 개발자 훈모구의 소개 페이지 썸네일',
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
