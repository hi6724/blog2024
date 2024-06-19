import { useProjectOverviewList } from '@/react-query/project';
import { IProjectOverView } from '@/react-query/types';
import { motion, useInView, useMotionValueEvent, useScroll } from 'framer-motion';
import { loremIpsum } from 'lorem-ipsum';
import Image from 'next/image';
import React, { useMemo, useRef, useState } from 'react';

const DUMMY = [
  'https://cdn.prod.website-files.com/650478fbd32707701e101c64/6512fd12cdb632e3a9ceef18_pexels.webp',
  'https://cdn.prod.website-files.com/650478fbd32707701e101c64/6533e2c432e997a1c5845e47_safari-condo-website%20(3).webp',
];

function Projects() {
  const scrollRef = useRef(null);
  const showRef = useRef(null);
  const isInviewShow = useInView(showRef, { amount: 'some' });
  const { data: projects } = useProjectOverviewList({ page_size: 3, sort: 'descending' });

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: isInviewShow ? 1 : 0 }}
        className='text-title -z-[1] sticky top-16 '
      >
        PROJECTS
      </motion.h1>
      <div ref={scrollRef} />
      <div className='h-[35vh]' />
      <div ref={showRef} />
      <div className='flex flex-col *:pt-12 bg-base-100'>
        {projects?.map((project, i) => (
          <Project project={project} key={i} />
        ))}
      </div>
      <button className='btn btn-outline w-full mt-8'>VIEW ALL PROJECTS</button>
    </div>
  );
}

export default Projects;

function Project({ project }: { project: IProjectOverView }) {
  const scrollRef = useRef(null);
  const [animationY, setAnimationY] = useState(0);
  const { scrollYProgress } = useScroll({ target: scrollRef, offset: ['start end', 'end end'] });
  const startView = animationY > 1 / (project.overviewImg ? 4 : 2);
  useMotionValueEvent(scrollYProgress, 'change', setAnimationY);

  return (
    <div>
      <motion.div
        className='p-2 z-20 sticky top-16 bg-base-100 text-base-content bg-opacity-30 backdrop-blur-lg flex justify-between items-center border-b-2 border-opacity-30 mb-16'
        initial={{ opacity: 0 }}
        animate={{ opacity: startView ? 1 : 0 }}
      >
        <motion.h1 className='text-sub-title text-center'>{project.title}</motion.h1>
        <div>
          <button className='btn btn-xs btn-link'>LINK</button>
          <button className='btn btn-xs btn-outline '>DETAIL</button>
        </div>
      </motion.div>
      <motion.div className='overflow-hidden flex flex-col gap-4' ref={scrollRef}>
        <ProjectContent src={project.thumbImageUri} content={project.overview} />
        {project.overviewImg && <ProjectContent reverse src={project.overviewImg} content={project.overview2} />}
      </motion.div>
    </div>
  );
}

function ProjectContent({ src, content, reverse }: { src: string; content: string; reverse?: boolean }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(scrollRef);

  return (
    <div className='relative'>
      <div ref={scrollRef} className='top-1/2 absolute z-50'></div>
      <motion.div
        className={`flex w-full flex-col sm:flex-row sm:relative sm:mb-16 ${reverse && 'sm:flex-row-reverse'}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: inView ? 1 : 0,
          scale: inView ? 1 : 0.9,
        }}
      >
        <Image
          width={400}
          height={400}
          className='sm:w-2/3 shadow-xl w-full rounded-xl aspect-video object-cover sm:mb-[10%]'
          src={src}
          alt=''
        />
        <motion.p
          className={`whitespace-break-spaces sm:absolute sm:right-4 sm:bottom-4 sm:w-1/2 sm:backdrop-blur-sm bg-primary text-primary-content rounded-xl sm:p-8 bg-opacity-60 ${
            reverse && 'sm:left-4'
          }`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          {content}
        </motion.p>
      </motion.div>
    </div>
  );
}
