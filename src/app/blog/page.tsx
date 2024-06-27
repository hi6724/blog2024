'use client';
import { BlogItem } from '@/components/main/Blog';
import { useBlogOverviewList } from '@/react-query/blog';
import { IBlogOverview } from '@/react-query/types';
import { motion } from 'framer-motion';
import InfiniteScroll from 'react-infinite-scroll-component';

function BlogListPage() {
  const { data, fetchNextPage, hasNextPage } = useBlogOverviewList({ page_size: 24, sort: 'descending' });
  const blogItems = data?.pages.reduce((prev: IBlogOverview[], crr) => [...prev, ...crr.results], []);

  return (
    <div>
      <motion.h1 className='text-title z-20 sticky top-14 bg-base-100 text-base-content p-2'>BLOG</motion.h1>

      {blogItems && (
        <InfiniteScroll
          dataLength={blogItems.length}
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={<h4>Loading...</h4>}
          className='grid gap-4 p-2 sm:grid-cols-2 md:grid-cols-3 bg-base-100 z-10 relative'
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          {blogItems?.map((blogData, i) => (
            <BlogItem key={blogData.id} data={blogData} />
          ))}
        </InfiniteScroll>
      )}
    </div>
  );
}

export default BlogListPage;
