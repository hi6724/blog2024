import ProjectDetailMain from '@/components/project/ProjectDetailMain';
import { Metadata } from 'next';
import { headers } from 'next/headers';

async function fetchProject(id: string) {
  const headersList = headers();
  const host = headersList.get('host'); // 현재 요청의 호스트 정보를 가져옴
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'; // 개발 환경에서는 http, 프로덕션에서는 https
  const res = await fetch(`${protocol}://${host}/api/project/${id}`);
  const data = await res.json();
  return data;
}

async function ProjectDetailPage({ params: { id } }: { params: { id: string } }) {
  const data = await fetchProject(id);

  return (
    <div className='relative'>
      <ProjectDetailMain data={data} />
    </div>
  );
}

export default ProjectDetailPage;

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = params; // URL에서 id 파라미터 추출
  const blogData = await fetchProject(id); // id를 이용해 블로그 데이터 가져오기
  const title = blogData?.block?.[id]?.value?.properties?.title?.[0]?.[0];
  const description = blogData?.block?.[id]?.value?.properties?.['nQ^=']?.[0]?.[0];
  const thumbnail = blogData?.block?.[id]?.value?.format?.page_cover;

  return {
    title: `${title} | 프로젝트`, // 가져온 데이터의 제목을 메타데이터의 타이틀로 설정
    description: description || '진행한 프로젝트 입니다.',
    openGraph: {
      title: `${title} | 훈모구의 프로젝트`,
      description: description || '진행한 프로젝트 입니다.',
      url: `https://hunmogu.com/blog/${id}`,
      type: 'article',
      images: [
        {
          url:
            thumbnail ||
            'https://firebasestorage.googleapis.com/v0/b/hunmok-fe31e.appspot.com/o/preview%2Fdefault-preview.webp?alt=media&token=20632868-8263-4a80-a8dc-03f60d37942a',
          width: 1700,
          height: 1000,
          alt: title,
        },
      ],
    },
  };
}
