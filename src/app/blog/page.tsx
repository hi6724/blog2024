import BlogMain from '@/components/blog/BlogMain';

function BlogListPage() {
  return <BlogMain />;
}

export default BlogListPage;

export const metadata = {
  title: '훈모구 블로그 - 프론트엔드 취업과 성장 기록',
  description:
    '프론트엔드 개발자를 준비하며 쌓아온 면접 후기, 포트폴리오 제작 과정, 코딩테스트 경험과 실전 기술을 공유하는 블로그입니다. 취준생에게 실질적인 도움이 되는 글들을 모았습니다.',
  keywords: [
    '프론트엔드',
    '개발자',
    '면접 후기',
    '취업 준비',
    '코딩테스트',
    '포트폴리오',
    '자기소개서',
    '알고리즘',
    '신입 개발자',
    '금융권 취업',
    '기술 블로그',
  ],
  openGraph: {
    title: '훈모구 블로그 - 면접과 취업 준비 이야기',
    description: '프론트엔드 개발자 취업을 준비하며 겪은 실제 경험과 정보를 정리한 블로그입니다. 포트폴리오, 자소서, 코테, 면접 후기가 가득합니다.',
    url: 'https://hunmogu.com/blog',
    type: 'website',
    images: [
      {
        url: 'https://firebasestorage.googleapis.com/v0/b/hunmok-fe31e.appspot.com/o/preview%2Fblog-preview.webp?alt=media&token=7a508fe7-38b8-4ca3-b6f4-91993129028e',
        width: 2000,
        height: 1059,
        alt: '프론트엔드 취업을 준비하는 블로그 썸네일',
      },
    ],
  },
};
