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

const THEME = {
  dark: monokai,
  darken: monokaiSublime,
  light: dracula,
  lighten: hopscotch,
};

const NAME_MAP: { [key: string]: string } = {
  publishedAt: '작성일',
  types: '태그',
  overview: '개요',
};
const DELETE_KEYS = ['type', 'comments', 'createdAt'];

function BlogDetailPage({ params: { id } }: { params: { id: string } }) {
  const { data } = useProjectDetail(id);
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
        header={
          <h1 className='text-4xl font-bold'>{data?.block?.[id]?.value.properties.title?.[0]?.[0]?.plain_text}</h1>
        }
        components={{
          Collection,
          propertyDateValue: ({ data }) => {
            const date = data?.[0]?.[1]?.[0]?.[1];
            const startDate = date?.start_date;
            if (!date) return null;
            return <span>{formatDateWithDay(startDate, { time: true })}</span>;
          },

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
                <CommentItem comment={comment} key={comment.id} />
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

export default BlogDetailPage;

function CommentItem({ comment }: { comment: IComment }) {
  return (
    <div key={comment.id}>
      <div className='flex mb-2'>
        <div className='text-3xl mr-2'>{comment.icon}</div>
        <div>
          <div className='flex items-center'>
            <p className='text-sm font-bold mr-4'>{comment.username}</p>
          </div>
          <p className='text-xs font-thin text-base-content text-opacity-80'>
            {formatDateWithDay(comment.createdAt, { day: true, time: true })}
          </p>
        </div>
      </div>
      <div>
        <p>{comment.content}</p>
      </div>
    </div>
  );
}
