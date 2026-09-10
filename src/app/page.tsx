import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';
import { MainContent } from "@/components/main/MainContent";
import { fetchStatistic } from "@/lib/fetch-statistic";
import { headers } from "next/headers";

export default async function Main() {
  const host = headers().get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const [totalViews, totalPostCnt, totalGuestBookCnt] = await Promise.all([
    fetchStatistic(`${baseUrl}/api/views/total`),
    fetchStatistic(`${baseUrl}/api/blog/count`),
    fetchStatistic(`${baseUrl}/api/guestbook/count`, { cache: 'no-store' }),
  ]);

  return (
    <MainContent
      totalViews={totalViews}
      totalBlogPostCnt={totalPostCnt}
      totalGuestbookCnt={totalGuestBookCnt}
    />
  );
}

export const metadata: Metadata = {
  title: '훈모구 | 프론트엔드 개발 블로그와 포트폴리오',
  description: '프론트엔드 개발자 하훈목의 기술 블로그와 포트폴리오입니다. React, Next.js 개발 경험과 프로젝트, 취업과 성장 기록을 공유합니다.',
  alternates: { canonical: '/' },
  openGraph: {
    title: '훈모구 | 프론트엔드 개발 블로그와 포트폴리오',
    description: 'React, Next.js 개발 경험과 프로젝트, 취업과 성장 기록을 공유합니다.',
    url: SITE_URL,
    type: 'website',
    locale: 'ko_KR',
    siteName: '훈모구',
    images: [{ url: '/thumbnail.png', alt: '훈모구 블로그와 포트폴리오' }],
  },
};
