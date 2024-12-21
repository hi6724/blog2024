'use client';
import { useTheme } from 'next-themes';
import BlogDetailContent from './BlogDetailContent';
import { useEffect, useState } from 'react';

function BlogDetailMain({ data, id }: { data: any; id: string }) {
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
      <div className="relative">
        <BlogDetailContent data={data} id={id} darkMode={true} />
      </div>
    );

  return (
    <div className="relative">
      <BlogDetailContent data={data} id={id} darkMode={false} />
    </div>
  );
}

export default BlogDetailMain;
