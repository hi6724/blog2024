'use client';

import BlogList from '@/components/blog/BlogList';
import { useBlogOverviewList, useBlogTags } from '@/react-query/blog';
import { IBlogOverview } from '@/react-query/types';
import { motion } from 'framer-motion';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MultiSelect } from 'react-multi-select-component';

function BlogMain() {
  const [selected, setSelected] = useState([]);
  const { data, fetchNextPage, hasNextPage } = useBlogOverviewList({
    page_size: 24,
    sort: 'descending',
    filter: selected.map((el: any) => el.value).join(','),
  });
  const { data: tags } = useBlogTags();
  const blogItems = data?.pages.reduce((prev: IBlogOverview[], crr) => [...prev, ...crr.results], []);
  const options = tags?.map((el) => ({ label: el.name, value: el.name }));

  return (
    <div>
      <motion.h1 className='text-title sticky top-14 bg-base-100 text-base-content p-2'>블로그</motion.h1>
      <div className='py-2 px-4 space-y-1'>
        <p>
          <span className='font-semibold'>TMAX</span>와 <span className='font-semibold'>SSAFY</span>에서 배운내용 그리고
          개인적으로 공부한 내용을 노션에 기록했습니다.
        </p>
        <p>노션에서만 볼 수 있는 점이 아쉬워서, 노션 API 를 사용해서 블로그 형태로 만들어 보았습니다.</p>
        <p>
          <a target='_blank' href='https://velog.io/@hunmok1027' className='font-bold text-primary btn-link'>
            개인 블로그
          </a>
          에서 더 자세하게 볼 수 있습니다.
        </p>
      </div>
      {options && (
        <div className='z-40 px-2 flex justify-end'>
          <MultiSelect
            options={options}
            value={selected}
            onChange={setSelected}
            labelledBy='select'
            disableSearch
            overrideStrings={{
              allItemsAreSelected: 'All items are selected.',
              clearSearch: 'Clear Search',
              clearSelected: 'Clear Selected',
              search: '검색',
              selectAll: '전체선택',
              selectAllFiltered: '전체선택',
              selectSomeItems: '태그선택',
            }}
            className='w-64'
          />
        </div>
      )}

      {blogItems && (
        <InfiniteScroll
          dataLength={blogItems.length}
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={<h4>Loading...</h4>}
          className='relative z-0'
        >
          <BlogList blogItems={blogItems} />
        </InfiniteScroll>
      )}
    </div>
  );
}

export default BlogMain;
