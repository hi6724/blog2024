'use client';
import { NotionRenderer } from 'react-notion-x';
import { Collection } from 'react-notion-x/build/third-party/collection';

import { useRef } from 'react';
import CommentSection from '@/components/comments/CommentSection';
import { motion } from 'framer-motion';
import { useMobile } from '@/hooks/useMobile';
import { useNextPrevBlogOverview } from '@/react-query/blog';
import Link from 'next/link';
import MyCodeBlock from '../notion/MyCodeBlock';
import MyDateProperty from '../notion/MyDateProperty';

const NAME_MAP: { [key: string]: string } = {
  publishedAt: '작성일',
  types: '태그',
  overview: '개요',
  views: '조회수',
};
const DELETE_KEYS = ['type', 'comments', 'createdAt'];

function BlogDetailContent({ data, darkMode, id }: { data: any; darkMode?: boolean; id: string }) {
  const isMobile = useMobile();
  const { data: nextPrevData } = useNextPrevBlogOverview(id);
  // 페이지 프로퍼티 이름 변경
  const collectionKey = Object.keys(data?.collection ?? {})?.[0];
  const schema = data?.collection?.[collectionKey]?.value?.schema;
  const title = useRef('');

  Object.keys(schema ?? {}).forEach((key) => {
    const name = schema[key].name;
    if (DELETE_KEYS.includes(name)) {
      delete schema[key];
    } else if (name in NAME_MAP) {
      schema[key].name = NAME_MAP[name];
    }
  });

  Object.keys(data?.block ?? {}).forEach((key) => {
    const type = data.block[key]?.value?.type;
    if (type !== 'page') return;
    title.current = data.block[key].value.properties?.title?.[0]?.[0] ?? '';
  });

  return (
    <div className='relative'>
      <NotionRenderer
        showTableOfContents={!isMobile}
        recordMap={data}
        components={{
          Collection,
          propertyDateValue: MyDateProperty,
          Code: MyCodeBlock,
        }}
        darkMode={darkMode}
        fullPage
        pageAside={
          <a className='notion-table-of-contents-item !text-xl' onClick={() => window.scrollTo(0, 0)}>
            {title.current}
          </a>
        }
        footer={
          <motion.div className='w-full border-t-2 border-success py-4 px-2 flex flex-col gap-4' initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
            <CommentSection pageId={id} />
            <div className='flex justify-between gap-2'>
              {nextPrevData?.prev ? (
                <Link
                  href={`/blog/${nextPrevData.prev.id}`}
                  className='w-72 bg-success bg-opacity-10 flex flex-col p-4 hover:bg-opacity-30 transition-all rounded-md'
                >
                  <p className='text-sm'>이전 글</p>
                  <h2 className='font-bold line-clamp-1'>{nextPrevData.prev.title}</h2>
                </Link>
              ) : (
                <div className='w-72'></div>
              )}
              {nextPrevData?.next ? (
                <Link
                  href={`/blog/${nextPrevData.next.id}`}
                  className='w-72 max-w-64 flex flex-col items-end p-4 bg-success bg-opacity-10 hover:bg-opacity-30 transition-all rounded-md'
                >
                  <p className='text-sm'>다음 글</p>
                  <h2 className='font-bold line-clamp-1'>{nextPrevData.next.title}</h2>
                </Link>
              ) : (
                <div className='w-72'></div>
              )}
            </div>
          </motion.div>
        }
        className={`!font-sans w-full`}
      />
    </div>
  );
}

export default BlogDetailContent;
