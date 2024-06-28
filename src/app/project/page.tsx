'use client';
import { useProjectOverviewList } from '@/react-query/project';
import { IProjectOverView } from '@/react-query/types';
import { motion, useInView, useMotionValueEvent, useScroll } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

function ProjectList() {
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
      <div className='flex flex-col *:pt-4 sm:*:pt-12 bg-base-100'>
        {projects && (
          <InfiniteScroll
            dataLength={projects.length} //This is important field to render the next data
            next={fetchNextPage}
            hasMore={hasNextPage}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p style={{ textAlign: 'center' }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            {projects?.map((project, i) => (
              <Project project={project} key={project.id} index={i} />
            ))}
          </InfiniteScroll>
        )}
      </div>
    </>
  );
}

export default ProjectList;

function Project({ project, index }: { project: IProjectOverView; index: number }) {
  const scrollRef = useRef(null);
  const [animationY, setAnimationY] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref);
  const { scrollYProgress } = useScroll({ target: scrollRef, offset: ['start end', 'end start'] });
  useMotionValueEvent(scrollYProgress, 'change', setAnimationY);

  return (
    <>
      <div ref={ref}></div>
      <div className='h-20'></div>
      <div className='h-12 border-t-2 p-2 z-10 w-full bg-base-100 text-base-content backdrop-blur-lg flex justify-between items-center border-b-2 border-opacity-30 mb-4 sm:mb-8'>
        <h1 className='text-sub-title text-center'>{project.title}</h1>
        <div>
          {project.link && (
            <a href={project.link} target='_blank' className='btn btn-xs btn-link'>
              LINK
            </a>
          )}
          <Link href={`/project/${project.id}`} className='btn btn-xs btn-outline '>
            DETAIL
          </Link>
        </div>
      </div>

      <div>
        <motion.div
          className='p-2 z-20 fixed w-full top-16 bg-base-100 text-base-content backdrop-blur-lg flex justify-between items-center border-b-2 border-opacity-30 mb-4 sm:mb-8'
          initial={{ opacity: 0 }}
          animate={{
            opacity: animationY < 1 && !inView && animationY > 0 ? 1 : 0,
            zIndex: 10 - index,
            y: animationY < 1 && !inView && animationY > 0 ? 0 : -10,
          }}
        >
          <motion.h1 className='text-sub-title text-center'>{project.title}</motion.h1>
          <div>
            {project.link && (
              <a href={project.link} target='_blank' className='btn btn-xs btn-link'>
                LINK
              </a>
            )}
            <Link href={`/project/${project.id}`} className='btn btn-xs btn-outline '>
              DETAIL
            </Link>
          </div>
        </motion.div>
        <motion.div className='overflow-hidden flex flex-col gap-4' ref={scrollRef}>
          <ProjectContent src={project.thumbImageUri} content={project.overview} />
          {project.overviewImg && <ProjectContent reverse src={project.overviewImg} content={project.overview2} />}
        </motion.div>
      </div>
    </>
  );
}

function ProjectContent({ src, content, reverse }: { src: string; content: string; reverse?: boolean }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const inView = useInView(scrollRef);

  return (
    <div className='relative'>
      <div ref={scrollRef} className='top-1/2 absolute z-50'></div>
      <motion.div
        className={`flex w-full flex-col mb-4 sm:flex-row sm:relative sm:mb-16 sm:px-4 ${
          reverse && 'sm:flex-row-reverse'
        }`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: inView ? 1 : 0,
          scale: inView ? 1 : 0.9,
        }}
      >
        <Image
          width={1000}
          height={400}
          className={`sm:w-2/3 shadow-xl w-full rounded-xl aspect-video object-cover sm:mb-[10%]`}
          src={src}
          alt=''
        />
        <motion.div
          ref={contentRef}
          className={`whitespace-break-spaces backdrop-blur-sm h-28 bg-base-300 text-base-content rounded-xl p-2 mx-2 bg-opacity-60 -translate-y-8 sm:translate-y-0 sm:absolute sm:right-4 sm:bottom-4 sm:w-1/2 sm:p-8 sm:mx-0  ${
            reverse && 'sm:left-4'
          }`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <p className='line-clamp-4 sm:line-clamp-none'>{content}</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
