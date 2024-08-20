import { useProjectOverviewList } from '@/react-query/project';
import { IProjectOverView } from '@/react-query/types';
import { useInView, motion, useScroll, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';
import { useRef, useState } from 'react';
import ProjectContent from './ProjectContent';

function ProjectItem({ project, index }: { project: IProjectOverView; index: number }) {
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
      <div className='h-12 border-t-2 p-2 w-full bg-base-100 text-base-content backdrop-blur-lg flex justify-between items-center border-b-2 border-opacity-30 mb-4 sm:mb-8'>
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
          className='h-12 p-2 z-20 fixed w-full top-16 bg-base-100 text-base-content backdrop-blur-lg flex justify-between items-center border-b-2 border-opacity-30 mb-4 max-w-screen-lg sm:mb-8'
          initial={{ opacity: 0 }}
          animate={{
            opacity: animationY < 1 && !inView && animationY > 0 ? 1 : 0,
            display: animationY < 1 && !inView && animationY > 0 ? 'flex' : 'none',
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
        <Link href={`/project/${project.id}`}>
          <motion.div className='flex flex-col gap-4' ref={scrollRef}>
            <ProjectContent src={project.thumbImageUri} content={project.overview} />
            {project.overviewImg && <ProjectContent reverse src={project.overviewImg} content={project.overview2} />}
          </motion.div>
        </Link>
      </div>
    </>
  );
}

export default ProjectItem;
