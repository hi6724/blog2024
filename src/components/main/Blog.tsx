'use client';
import { useMobile } from '@/hooks/useMobile';
import { useBlogOverviewList } from '@/react-query/blog';
import { IBlogOverview } from '@/react-query/types';
import dayjs from 'dayjs';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

function Blog() {
  const isMobile = useMobile();
  const { data } = useBlogOverviewList({ page_size: 12, sort: 'descending' });
  const blogItems = isMobile ? data?.results.slice(0, 4) : data?.results;
  const ref = useRef<HTMLDivElement>(null);
  const isShowTitle = useInView(ref);

  return (
    <>
      <div className='h-16 sm:h-[25vh] bg-base-100 z-10 relative' />
      <motion.h1
        className='text-title z-20 sticky top-14 bg-base-100 text-base-content p-2'
        initial={{ opacity: 0 }}
        animate={{ opacity: isShowTitle ? 1 : 0 }}
      >
        BLOG
      </motion.h1>
      <div ref={ref} className='grid gap-4 p-2 sm:grid-cols-2 md:grid-cols-3 bg-base-100 z-10 relative'>
        {blogItems?.map((data, index) => (
          <BlogItem key={data.id} data={data} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className='py-8 sm:py-16 bg-base-100 z-10 mt-4 mx-2 flex justify-center'
      >
        <Link href={'/blog'} className='btn btn-outline w-full self-center max-w-96'>
          모든 블로그 보기
        </Link>
      </motion.div>
    </>
  );
}

export default Blog;

function BlogItem({ data }: { data: IBlogOverview }) {
  const router = useRouter();
  const createdAt = dayjs(data.createdAt);
  const today = dayjs();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className='card card-compact sm:card-normal w-full bg-base-100 shadow-xl shadow-base-content/40 cursor-pointer'
      onClick={() => router.push(`/blog/${data.id}`)}
      whileHover={{ scale: 1 }}
    >
      {data.thumbImageUri && (
        <figure className='h-32 hidden'>
          <Image src={data.thumbImageUri} alt='thumbImageUri' width={400} height={400} />
        </figure>
      )}
      <div className='card-body justify-end'>
        {/* title */}
        <h2 className='card-title'>{data.title}</h2>
        {/* contents */}
        <div>
          <p className='line-clamp-2'>{data.overview}</p>
        </div>
        <div className='divider my-1'></div>
        {/* tags */}
        <div className='flex gap-1'>
          {data.tags.map((tag: string, i: number) => (
            <div className='badge badge-accent badge-outline' key={i}>
              {tag}
            </div>
          ))}
        </div>
        {/* footer */}
        <p className='text-sm font-semibold opacity-40 flex-grow-0'>
          {createdAt.format(createdAt.get('year') !== today.get('year') ? 'YYYY년 M월 D일' : 'M월 D일')}
        </p>
      </div>
    </motion.div>
  );
}
