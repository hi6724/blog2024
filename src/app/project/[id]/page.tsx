'use client';
import { useProjectDetail } from '@/react-query/project';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { NotionRenderer } from 'react-notion-x';

function ProjectDetailPage({ params: { id } }: { params: { id: string } }) {
  const { data } = useProjectDetail(id);
  const { theme } = useTheme();

  return (
    <div className='relative'>
      <NotionRenderer
        recordMap={data}
        components={{
          Image: Image,
        }}
        fullPage
        className={`${theme?.includes('dark') ? 'dark-mode' : 'light-mode'}
        !font-sans`}
      />
    </div>
  );
}

export default ProjectDetailPage;
