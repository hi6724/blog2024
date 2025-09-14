'use client';
import { useTheme } from 'next-themes';
import BlogDetailContent from './BlogDetailContent';
import { useEffect, useState } from 'react';
import { ISupabaseComment } from '@/react-query/types';

function BlogDetailMain({ data, id, comments }: { data: any; id: string; comments: ISupabaseComment[] }) {
  const theme = useTheme();

  const [darkMode, setDarkMode] = useState<boolean | null>(null);
  useEffect(() => {
    setTimeout(() => {
      setDarkMode(theme.resolvedTheme === 'dark');
    }, 0);
  }, [setDarkMode, theme]);

  if (darkMode === null) return 'loading...';

  if (darkMode)
    return (
      <div className='relative'>
        <BlogDetailContent data={data} id={id} darkMode={true} supaSomments={comments} />
      </div>
    );

  return (
    <div className='relative'>
      <BlogDetailContent data={data} id={id} darkMode={false} supaSomments={comments} />
    </div>
  );
}

export default BlogDetailMain;
