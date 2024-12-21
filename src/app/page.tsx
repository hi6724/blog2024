import { MainContent } from '@/components/main/MainContent';
import { headers } from 'next/headers';

export default async function Main() {
  const host = headers().get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  const totalViews = await (await fetch(`${baseUrl}/api/views/total`)).json();
  const totalPostCnt = await (await fetch(`${baseUrl}/api/blog/count`)).json();
  const totalGuestBookCnt = await (await fetch(`${baseUrl}/api/guestbook/count`)).json();

  console.log(totalPostCnt, totalGuestBookCnt);

  return (
    <MainContent
      totalViews={totalViews ?? 0}
      totalBlogPostCnt={totalPostCnt ?? 0}
      totalGuestbookCnt={totalGuestBookCnt ?? 0}
    />
  );
}
