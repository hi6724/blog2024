'use client';

import BlogList from '@/components/blog/BlogList';
import { useBlogOverviewList } from '@/react-query/blog';
import { IBlogOverview } from '@/react-query/types';
import { motion } from 'framer-motion';
import InfiniteScroll from 'react-infinite-scroll-component';

function BlogListPage() {
  const { data, fetchNextPage, hasNextPage } = useBlogOverviewList({ page_size: 24, sort: 'descending' });
  const blogItems = data?.pages.reduce((prev: IBlogOverview[], crr) => [...prev, ...crr.results], []);

  return (
    <div>
      <motion.h1 className='text-title sticky top-14 bg-base-100 text-base-content p-2'>BLOG</motion.h1>

      {blogItems && (
        <InfiniteScroll
          dataLength={blogItems.length}
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          <BlogList blogItems={blogItems} />
        </InfiniteScroll>
      )}
    </div>
  );
}

export default BlogListPage;
