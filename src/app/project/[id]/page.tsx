import ProjectDetailMain from '@/components/project/ProjectDetailMain';
import { headers } from 'next/headers';

async function ProjectDetailPage({ params: { id } }: { params: { id: string } }) {
  const headersList = headers();
  const host = headersList.get('host'); // 현재 요청의 호스트 정보를 가져옴
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'; // 개발 환경에서는 http, 프로덕션에서는 https
  const res = await fetch(`${protocol}://${host}/api/project/${id}`);
  const data = await res.json();

  return (
    <div className='relative'>
      <ProjectDetailMain data={data} />
    </div>
  );
}

export default ProjectDetailPage;
