'use client';
import { useMobile } from '@/hooks/useMobile';
import { useBlogOverviewList } from '@/react-query/blog';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
import BlogList from '../blog/BlogList';

function Blog() {
  const isMobile = useMobile();
  const { data } = useBlogOverviewList({ page_size: 12, sort: 'descending' });
  const blogItems = isMobile ? data?.pages?.[0]?.results?.slice(0, 4) : data?.pages?.[0]?.results;
  const ref = useRef<HTMLDivElement>(null);
  const isShowTitle = useInView(ref);

  return (
    <>
      <div className='h-16 sm:h-[25vh] bg-base-100 z-10 relative' />
      <motion.h1
        className='text-title sticky top-14 bg-base-100 text-base-content p-2'
        initial={{ opacity: 0 }}
        animate={{ opacity: isShowTitle ? 1 : 0 }}
      >
        블로그
      </motion.h1>
      <div ref={ref}>{blogItems && <BlogList blogItems={blogItems} />}</div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className='py-8 sm:py-16 bg-base-100 z-10 mt-4 mx-2 flex justify-center'
      >
        <Link href={'/blog'} className='btn btn-primary w-full self-center max-w-96'>
          모든 블로그 보기
        </Link>
      </motion.div>
    </>
  );
}

export default Blog;
