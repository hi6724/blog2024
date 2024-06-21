import { useMobile } from '@/hooks/useMobile';
import { useProjectOverviewList } from '@/react-query/project';
import { IProjectOverView } from '@/react-query/types';
import { motion, useInView, useMotionValueEvent, useScroll } from 'framer-motion';
import { useRef, useState } from 'react';
import ProjectItem from './ProjectItem';

function calculateArray(arr?: IProjectOverView[]) {
  if (!arr) return [0];
  let result: number[] = [0];
  let sum = 0;

  arr.forEach((obj: IProjectOverView) => {
    if (obj.overviewImg) {
      sum += 2;
    } else {
      sum += 1;
    }
    result.push(sum);
  });

  return result;
}

function Project() {
  const isMobile = useMobile();
  const scrollRef = useRef(null);
  const showTitleRef = useRef(null);
  const isInviewShow = useInView(showTitleRef, { amount: 'some' });
  const [animationY, setAnimationY] = useState(0);
  const { scrollYProgress } = useScroll({ target: scrollRef, offset: ['start start', 'end 70%'] });
  useMotionValueEvent(scrollYProgress, 'change', setAnimationY);

  const { data: projects } = useProjectOverviewList({ page_size: 3, sort: 'descending' });
  const lengthList = calculateArray(projects?.results);

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
        <motion.div className='w-full h-full flex justify-center mt-10 top-16 sticky *:absolute'>
          {projects?.results.map((project, index) => (
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
          className={`h-[200vh]`}
          style={{
            height: `${lengthList[lengthList.length - 1] * (isMobile ? 50 : 100)}vh`,
          }}
        />
      </div>
    </>
  );
}

export default Project;
