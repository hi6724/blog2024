'use client';

import React from 'react';
import ProjectList from '@/components/project/ProjectList';

import { useProjectOverviewList } from '@/react-query/project';
import { IProjectOverView } from '@/react-query/types';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';

function MainProject() {
  const scrollRef = useRef(null);
  const showRef = useRef(null);
  const isInviewShow = useInView(showRef, { amount: 'some' });
  const { data } = useProjectOverviewList({ page_size: 2, sort: 'descending' });
  const projects = data?.pages.reduce((prev: IProjectOverView[], crr) => [...prev, ...crr.results], []);
  return (
    <div className='bg-base-100 relative z-10'>
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: isInviewShow ? 1 : 0 }}
        className='text-title sticky top-16 mx-2'
      >
        프로젝트
      </motion.h1>
      <div ref={scrollRef} />
      <div ref={showRef} />
      {projects && <ProjectList projects={projects} />}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className='py-8 sm:py-16 bg-base-100 z-10 mt-4 mx-2 flex justify-center'
      >
        <Link href={'/project'} className='btn btn-primary w-full self-center max-w-96'>
          모든 프로젝트 보기
        </Link>
      </motion.div>
    </div>
  );
}

export default MainProject;
