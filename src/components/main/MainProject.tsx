'use client';

import React from 'react';
import ProjectList from '@/components/project/ProjectList';

import { useProjectOverviewList } from '@/react-query/project';
import { IProjectOverView } from '@/react-query/types';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

function MainProject() {
  const scrollRef = useRef(null);
  const showRef = useRef(null);
  const isInviewShow = useInView(showRef, { amount: 'some' });
  const { data } = useProjectOverviewList({ page_size: 2, sort: 'descending' });
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
      {projects && <ProjectList projects={projects} />}
    </>
  );
}

export default MainProject;
