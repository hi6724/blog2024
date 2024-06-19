'use client';
import { useMobile } from '@/hooks/useMobile';
import { useBlogOverviewList } from '@/react-query/blog';
import { IBlogOverview } from '@/react-query/types';
import { motion, useInView } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

function Blog() {
  const isMobile = useMobile();
  const { data } = useBlogOverviewList({ page_size: isMobile ? 4 : 12, sort: 'descending' });
  const ref = useRef<HTMLDivElement>(null);
  const isShowTitle = useInView(ref);

  return (
    <>
      <div className='h-[25vh]' />
      <motion.h1
        className='text-title z-10 sticky top-16 bg-base-100 text-base-content bg-opacity-30 backdrop-blur-lg mb-6 p-2'
        initial={{ opacity: 0 }}
        animate={{ opacity: isShowTitle ? 1 : 0 }}
      >
        BLOG
      </motion.h1>
      <div ref={ref} className='grid gap-4 p-2 sm:grid-cols-2 md:grid-cols-3 '>
        {data?.results?.map((data, index) => (
          <BlogItem key={data.id} data={data} />
        ))}
      </div>
      <button className='btn btn-outline w-full mt-4'>READ MORE</button>
    </>
  );
}

export default Blog;

function BlogItem({ data }: { data: IBlogOverview }) {
  const router = useRouter();
  return (
    <motion.div
      className='card card-compact sm:card-normal w-full bg-base-100 shadow-xl'
      onClick={() => router.push(`/blog/${data.id}`)}
    >
      {data.thumbImageUri && (
        <figure className='h-32 hidden'>
          <img src={data.thumbImageUri} alt='thumbImageUri' />
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
        <p className='text-sm font-semibold opacity-40 flex-grow-0'>2024년 6월 7일 | 2개의 댓글</p>
      </div>
    </motion.div>
  );
}
