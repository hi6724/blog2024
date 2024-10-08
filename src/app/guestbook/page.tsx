import GuestbookMain from '@/components/guestbook/GuestbookMain';

function GuestBookPage() {
  return <GuestbookMain />;
}

export default GuestBookPage;

export const metadata = {
  title: '방명록',
  description: '하훈목의 포트폴리오 사이트 방명록 페이지입니다. 이곳에서 방문자의 의견과 생각을 나눌 수 있습니다.',
  keywords: ['하훈목', '포트폴리오', '방명록', '개발자', '프론트엔드'],
  openGraph: {
    title: '방명록',
    description: '하훈목의 포트폴리오 사이트 방명록 페이지입니다. 이곳에서 방문자의 의견과 생각을 나눌 수 있습니다.',
    url: 'https://yourwebsite.com/guestbook', // 실제 방명록 페이지 URL을 입력하세요.
    type: 'website',
    images: [
      {
        url: 'https://firebasestorage.googleapis.com/v0/b/hunmok-fe31e.appspot.com/o/preview%2Fguestbook-preview.webp?alt=media&token=0fae0857-231e-4652-8ea7-42ec4747923d', // 방명록 페이지 미리보기에서 사용할 이미지 URL을 입력하세요.
        width: 2000,
        height: 1196,
        alt: '방명록 페이지 미리보기 이미지',
      },
    ],
  },
};
