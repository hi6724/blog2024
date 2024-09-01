'use client';
import { useProjectDetail } from '@/react-query/project';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { NotionRenderer } from 'react-notion-x';
import { Collection } from 'react-notion-x/build/third-party/collection';

import { CodeBlock, dracula, monokai, monokaiSublime, hopscotch } from 'react-code-blocks';
import { formatDateWithDay } from '@/lib/date';
import { splitFirst } from '@/lib/string';
import { FormProvider, useForm } from 'react-hook-form';
import SubmitForm from '@/components/blog/SubmitForm';
import { useState } from 'react';
import { IComment } from '@/react-query/types';
import { motion } from 'framer-motion';
import { useMobile } from '@/hooks/useMobile';
import { useNextPrevBlogOverview } from '@/react-query/blog';
import Link from 'next/link';
import BlogCommentItem from './BlogComment';
import MyCodeBlock from '../notion/MyCodeBlock';
import MyDateProperty from '../notion/MyDateProperty';

const NAME_MAP: { [key: string]: string } = {
  publishedAt: '작성일',
  types: '태그',
  overview: '개요',
};
const DELETE_KEYS = ['type', 'comments', 'createdAt'];

function BlogDetailMain({ data, id }: { data: any; id: string }) {
  const { theme } = useTheme();
  const [submittedItems, setSubmittedItems] = useState<IComment[]>([]);
  const isMobile = useMobile();
  const { data: nextPrevData } = useNextPrevBlogOverview(id);
  // 페이지 프로퍼티 이름 변경
  const collectionKey = Object.keys(data?.collection ?? {})?.[0];
  const schema = data?.collection[collectionKey].value.schema;

  const method = useForm();
  Object.keys(schema ?? {}).forEach((key) => {
    const name = schema[key].name;
    if (DELETE_KEYS.includes(name)) {
      delete schema[key];
    } else if (name in NAME_MAP) {
      schema[key].name = NAME_MAP[name];
    }
  });

  const comments = Object.values(data?.comment ?? {}).map((comment: any) => {
    const [icon, username, userId, content] = splitFirst(comment.value.text[0][0], ':', 3);
    return { id: comment.value.id, createdAt: comment.value.created_time, icon, username, userId, content };
  });

  return (
    <div className='relative'>
      <NotionRenderer
        recordMap={data}
        showTableOfContents={!isMobile}
        components={{
          Collection,
          propertyDateValue: MyDateProperty,
          Code: MyCodeBlock,
        }}
        fullPage
        footer={
          <motion.div
            className='w-full border-t-2 border-success py-4 px-2 flex flex-col gap-4'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            <FormProvider {...method}>
              <SubmitForm
                id={id}
                setItems={setSubmittedItems}
                commentsLength={(comments?.length ?? 0) + (submittedItems?.length ?? 0)}
              />
              {[...submittedItems, ...comments]?.map((comment, i) => (
                <BlogCommentItem comment={comment} key={comment.id} />
              ))}
            </FormProvider>
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
        className={`${theme?.includes('dark') ? 'dark-mode' : 'light-mode'} !font-sans w-full`}
      />
    </div>
  );
}

export default BlogDetailMain;
