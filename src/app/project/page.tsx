import ProjectMain from '@/components/project/ProjectMain';
import { Metadata } from 'next';

function ProjectListPage() {
  return <ProjectMain />;
}

export default ProjectListPage;

export const metadata = {
  title: '진행한 프로젝트',
  description: '하훈목의 포트폴리오 사이트에서 자신에 대해 소개하는 페이지입니다.',
  keywords: ['하훈목', '포트폴리오', '소개', '개발자', '프론트엔드'],
  openGraph: {
    title: '진행한 프로젝트',
    description: '프로젝트에 대해 소개하는 페이지입니다.',
    url: 'https://hunmogu.com/project', // 여기에 실제 사이트 URL을 입력하세요.
    type: 'website',
    images: [
      {
        url: 'https://hunmogu.com/thumbnail.png', // 링크 미리보기에서 사용할 이미지 URL을 입력하세요.
        width: 1000,
        height: 1000,
        alt: '귀여운 강아지 사진',
      },
    ],
  },
};
