import { useMobile } from '@/hooks/useMobile';
import { useProjectOverviewList } from '@/react-query/project';
import { IProjectOverView } from '@/react-query/types';
import { motion, useInView, useMotionValueEvent, useScroll } from 'framer-motion';
import { useRef, useState } from 'react';
import ProjectItem from './ProjectItem';
import { calculateArray } from '@/lib/list';
import Link from 'next/link';

function Project() {
  const isMobile = useMobile();
  const scrollRef = useRef(null);
  const showTitleRef = useRef(null);
  const isInviewShow = useInView(showTitleRef, { amount: 'some' });
  const [animationY, setAnimationY] = useState(0);
  const { scrollYProgress } = useScroll({ target: scrollRef, offset: ['start start', 'end 40%'] });
  useMotionValueEvent(scrollYProgress, 'change', setAnimationY);

  const { data } = useProjectOverviewList({ page_size: 3, sort: 'descending' });
  const projects = isMobile ? data?.pages?.[0]?.results?.slice(0, 2) : data?.pages?.[0]?.results;
  const lengthList = calculateArray(projects, 'overviewImg');

  return (
    <>
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: isInviewShow ? 1 : 0 }}
        className='text-title -z-[1] sticky top-16 '
      >
        PROJECTS
      </motion.h1>

      <div className='h-8 sm:h-[15vh]' />
      <div ref={showTitleRef} />
      <div className='h-8 sm:h-[15vh]' />

      <div ref={scrollRef}>
        <motion.div className='w-full h-full flex justify-center mt-10 top-16 sticky'>
          {projects?.map((project, index) => (
            <ProjectItem
              scrollY={animationY}
              index={index}
              lengthList={lengthList}
              project={project}
              key={project.id}
            />
          ))}
        </motion.div>
        <motion.div
          className={`min-h-[200vh]`}
          style={{
            height: `${lengthList[lengthList.length - 1] * (isMobile ? 50 : 100)}vh`,
          }}
        />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: animationY > 0 ? 1 : 0 }}
        className='sticky bottom-0 py-8 sm:py-16 bg-base-100 z-10 mt-32 mx-2 flex justify-center'
      >
        <Link href={'/project'} className='btn btn-outline w-full max-w-96'>
          모든 프로젝트 보기
        </Link>
      </motion.div>
    </>
  );
}

export default Project;
