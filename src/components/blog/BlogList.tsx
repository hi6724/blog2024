import { IBlogOverview } from '@/react-query/types';
import React from 'react';
import BlogItem from './BlogItem';

function BlogList({ blogItems }: { blogItems: IBlogOverview[] }) {
  return (
    <div className='grid gap-4 p-2 sm:grid-cols-2 md:grid-cols-3 bg-base-100 z-10 relative overflow-hidden'>
      {blogItems?.map((data, i) => (
        <BlogItem key={data.id} data={data} i={i} />
      ))}
    </div>
  );
}

export default BlogList;
