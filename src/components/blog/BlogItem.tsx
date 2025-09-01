'use client';
import { IBlogOverview } from '@/react-query/types';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { thumbnailList } from '@/assets/images/thumbnail/index';
import { useTheme } from 'next-themes';
import { NOTION_COLOR_SCHEME } from '@/constants';
import Link from 'next/link';

function BlogItem({ data, i = 1 }: { data: IBlogOverview; i?: number }) {
  const createdAt = dayjs(data.createdAt);
  const today = dayjs();
  const src = thumbnailList[i % thumbnailList.length];
  const { resolvedTheme } = useTheme();

  return (
    <Link href={`/blog/${data.id}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className='card card-compact sm:card-normal w-full shadow-lg dark:shadow-base-content/20 cursor-pointer'
        whileHover={{
          scale: 1.05,
        }}
      >
        <figure className='h-32 hidden relative'>
          {data.thumbImageUri ? (
            <Image src={data.thumbImageUri} alt='thumbImageUri' width={400} height={400} className='w-full' />
          ) : (
            <div
              className='hero h-full w-full bg-cover bg-center'
              style={{
                backgroundImage: `url(${src.src})`,
              }}
            >
              <div className='hero-overlay bg-opacity-60'></div>
              <div className='hero-content text-neutral-content text-center'>
                <div className='max-w-md'>
                  <h1 className='text-2xl font-letter font-bold border px-8 py-4'>NO IMG</h1>
                </div>
              </div>
            </div>
          )}
        </figure>
        <div className='card-body !gap-1 !px-4 relative'>
          <div className='absolute -top-4 left-2 text-2xl'>{data.icon}</div>
          {/* title */}
          <h2 className='card-title !mb-2'>{data.title}</h2>
          {/* contents */}
          <div>
            <p className='line-clamp-3 text-sm'>{data.overview}</p>
          </div>
          <p className='mt-2 text-xs font-semibold opacity-40 flex-grow-0'>
            <span>{createdAt.format(createdAt.get('year') !== today.get('year') ? 'YYYY년 M월 D일' : 'M월 D일')}</span>
            {data.comments && <span className='ml-2'>{data.comments}개의 댓글</span>}
          </p>
          <div className='divider mb-1 mt-0'></div>
          {/* tags */}
          <div className='flex gap-1'>
            {data.tags.map((tag) => (
              <div
                className='badge'
                key={tag.id}
                style={{
                  color: NOTION_COLOR_SCHEME[resolvedTheme ?? 'light'].text.default,
                  backgroundColor: NOTION_COLOR_SCHEME[resolvedTheme ?? 'light'].bg[tag.color],
                }}
              >
                {tag.name}
              </div>
            ))}
          </div>
          {/* footer */}
        </div>
      </motion.div>
    </Link>
  );
}

export default BlogItem;
