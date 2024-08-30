'use client';
import ProjectList from '@/components/project/ProjectList';
import { useProjectOverviewList } from '@/react-query/project';
import { IProjectOverView } from '@/react-query/types';
import { useInView, motion } from 'framer-motion';
import { useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

function ProjectMain() {
  const scrollRef = useRef(null);
  const showRef = useRef(null);
  const isInviewShow = useInView(showRef, { amount: 'some' });
  const { data, fetchNextPage, hasNextPage } = useProjectOverviewList({ page_size: 6, sort: 'descending' });

  const projects = data?.pages.reduce((prev: IProjectOverView[], crr) => [...prev, ...crr.results], []);
  return (
    <>
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: isInviewShow ? 1 : 0 }}
        className='text-title sticky top-16 mx-2'
      >
        PROJECTS
      </motion.h1>
      <div ref={scrollRef} />
      <div className='h-16 sm:h-32' />
      <div ref={showRef} />
      {projects && (
        <InfiniteScroll
          dataLength={projects.length}
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={<h4>Loading...</h4>}
          className='!overflow-visible'
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          <ProjectList projects={projects} />
        </InfiniteScroll>
      )}
    </>
  );
}

export default ProjectMain;
