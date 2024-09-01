import BlogMain from '@/components/blog/BlogMain';

function BlogListPage() {
  return <BlogMain />;
}

export default BlogListPage;

export const metadata = {
  title: '훈모구 블로그',
  description: '노션에 작성한 블로그 포스트 입니다.',
  keywords: ['하훈목', '포트폴리오', '소개', '개발자', '프론트엔드', '블로그'],
  openGraph: {
    title: '작성한 블로그 포스트',
    description: '작성한 블로그 포스트 페이지입니다.',
    url: 'https://hunmogu.com/blog', // 여기에 실제 사이트 URL을 입력하세요.
    type: 'website',
    images: [
      {
        url: 'https://firebasestorage.googleapis.com/v0/b/hunmok-fe31e.appspot.com/o/preview%2Fblog-preview.webp?alt=media&token=7a508fe7-38b8-4ca3-b6f4-91993129028e', // 링크 미리보기에서 사용할 이미지 URL을 입력하세요.
        width: 2000,
        height: 1059,
        alt: '귀여운 강아지 사진',
      },
    ],
  },
};
