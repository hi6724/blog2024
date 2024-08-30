import BlogDetailMain from '@/components/blog/BlogDetailMain';
import { Metadata } from 'next';
import { headers } from 'next/headers';

async function fetchBlogData(id: string) {
  const headersList = headers();
  const host = headersList.get('host'); // 현재 요청의 호스트 정보를 가져옴
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'; // 개발 환경에서는 http, 프로덕션에서는 https
  const res = await fetch(`${protocol}://${host}/api/project/${id}`);
  const data = await res.json();
  return data;
}

async function BlogDetailPage({ params: { id } }: { params: { id: string } }) {
  const data = await fetchBlogData(id);

  return <BlogDetailMain data={data} id={id} />;
}

export default BlogDetailPage;

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = params; // URL에서 id 파라미터 추출
  const blogData = await fetchBlogData(id); // id를 이용해 블로그 데이터 가져오기
  const title = blogData?.block?.[id]?.value?.properties?.title?.[0]?.[0];
  const description = blogData?.block?.[id]?.value?.properties?.['nQ^=']?.[0]?.[0];
  const thumbnail = blogData?.block?.[id]?.value?.format?.page_cover;

  return {
    title: `${title} | 블로그`, // 가져온 데이터의 제목을 메타데이터의 타이틀로 설정
    description: description || '블로그 포스트에 대한 설명을 추가합니다.',
    openGraph: {
      title,
      description,
      url: `https://hunmogu.com/blog/${id}`,
      type: 'article',
      images: [
        {
          url: thumbnail || 'https://hunmogu.com/default-thumbnail.jpg',
          width: 1700,
          height: 1000,
          alt: title,
        },
      ],
    },
  };
}
