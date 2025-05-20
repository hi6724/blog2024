import GuestbookMain from '@/components/guestbook/GuestbookMain';
import type { Metadata } from 'next';

function GuestBookPage() {
  return <GuestbookMain />;
}

export default GuestBookPage;

export const metadata: Metadata = {
  title: '훈모구 방명록 - 당신의 생각을 들려주세요',
  description: '방문해주셔서 감사합니다! 프론트엔드 개발자 훈모구의 포트폴리오 사이트 방명록입니다. 응원, 질문, 피드백 등 자유롭게 의견을 남겨주세요.',
  keywords: ['방명록', '훈모구', '포트폴리오', '프론트엔드 개발자', '커뮤니케이션', '개발 블로그', '소통', '개발자 브랜딩'],
  openGraph: {
    title: '훈모구 방명록 - 의견을 남겨보세요',
    description: '프론트엔드 개발자 훈모구의 포트폴리오 사이트에서 자유롭게 응원과 피드백을 남길 수 있는 공간입니다. 당신의 소중한 이야기를 기다립니다.',
    url: 'https://hunmogu.com/guestbook',
    type: 'website',
    images: [
      {
        url: 'https://firebasestorage.googleapis.com/v0/b/hunmok-fe31e.appspot.com/o/preview%2Fguestbook-preview.webp?alt=media&token=0fae0857-231e-4652-8ea7-42ec4747923d',
        width: 2000,
        height: 1196,
        alt: '훈모구 방명록 페이지 미리보기',
      },
    ],
  },
};
