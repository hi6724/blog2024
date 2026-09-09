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
