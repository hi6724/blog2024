'use client';
import { useProjectDetail } from '@/react-query/project';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { NotionRenderer } from 'react-notion-x';
import { CodeBlock, CopyBlock, dracula, monokai, monokaiSublime, anOldHope, hopscotch } from 'react-code-blocks';

const THEME = {
  dark: monokai,
  darken: monokaiSublime,
  light: dracula,
  lighten: hopscotch,
};

function BlogDetailPage({ params: { id } }: { params: { id: string } }) {
  const { data } = useProjectDetail(id);
  const { theme } = useTheme();

  return (
    <div className='relative'>
      <NotionRenderer
        recordMap={data}
        components={{
          Image: () => Image,
          Code: ({ block }: any) => {
            return (
              <div className='w-full *:p-4 *:font-thin'>
                <CodeBlock
                  language={block.properties?.language?.[0]?.[0]}
                  text={block.properties?.title?.[0]?.[0]}
                  theme={THEME[(theme as keyof typeof THEME) ?? 'light']}
                  showLineNumbers={false}
                />
              </div>
            );
          },
        }}
        fullPage
        className={`${theme?.includes('dark') ? 'dark-mode' : 'light-mode'}
        !font-sans w-full`}
      />
    </div>
  );
}

export default BlogDetailPage;
