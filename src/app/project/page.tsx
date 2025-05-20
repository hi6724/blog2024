import ProjectMain from '@/components/project/ProjectMain';
import { Metadata } from 'next';

function ProjectListPage() {
  return <ProjectMain />;
}

export default ProjectListPage;

export const metadata: Metadata = {
  title: '훈모구 프로젝트 - 실무와 사이드 프로젝트 포트폴리오',
  description:
    '싸피 수료 후 티맥스핀테크, KB국민은행에서 진행한 실무 프로젝트부터 개인 포트폴리오 사이드 프로젝트까지. 프론트엔드 개발자로서 성장해온 여정을 프로젝트를 통해 소개합니다.',
  keywords: [
    '프론트엔드 포트폴리오',
    '프로젝트',
    '티맥스핀테크',
    '국민은행',
    'Next.js',
    'React',
    '사이드 프로젝트',
    '프론트엔드 개발자',
    '핀테크 개발',
    '성능 최적화',
    'UI/UX 개선',
  ],
  openGraph: {
    title: '훈모구의 프로젝트 - 프론트엔드 개발 실무 경험',
    description: '티맥스핀테크와 국민은행에서의 실무 프로젝트, 그리고 다양한 사이드 프로젝트를 통해 프론트엔드 기술을 쌓아온 과정을 소개합니다.',
    url: 'https://hunmogu.com/project',
    type: 'website',
    images: [
      {
        url: 'https://firebasestorage.googleapis.com/v0/b/hunmok-fe31e.appspot.com/o/preview%2Fproject-preview.webp?alt=media&token=1c039d20-5aad-4e04-bfad-ba489dce6144',
        width: 2000,
        height: 1019,
        alt: '훈모구의 프로젝트 썸네일 이미지',
      },
    ],
  },
};
