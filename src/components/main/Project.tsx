import { motion, useInView, useMotionValueEvent, useScroll } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { loremIpsum } from 'lorem-ipsum';
import { useProjectOverviewList } from '@/react-query/project';
import { IProjectOverView } from '@/react-query/types';
import { useMobile } from '@/hooks/useMobile';

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

function Project2() {
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
            <>
              <CarouselItem scrollY={animationY} index={index} lengthList={lengthList} project={project} />
            </>
          ))}
        </motion.div>
        <motion.div
          className={`h-200vh`}
          initial={{ height: '200vh' }}
          animate={{ height: `${lengthList[lengthList.length - 1] * (isMobile ? 50 : 100)}vh` }}
        />
      </div>
    </>
  );
}

export default Project2;

function CarouselItem({
  project,
  index,
  scrollY,
  lengthList,
}: {
  project: IProjectOverView;
  lengthList: number[];
  index: number;
  scrollY: number;
}) {
  const totalLength = lengthList[lengthList.length - 1];
  const isShow = scrollY >= lengthList[index] / totalLength && scrollY < lengthList[index + 1] / totalLength;
  const showNext = scrollY >= (lengthList[index] + 1) / totalLength;

  return (
    <>
      <motion.div
        className='p-2 w-full z-20 sticky top-0 bg-base-100 text-base-content bg-opacity-30 flex justify-between items-center border-b-2 border-opacity-30 '
        initial={{ opacity: 0 }}
        animate={{ opacity: isShow ? 1 : 0 }}
      >
        <h1 className='text-sub-title text-center'>{project.title}</h1>
        <div>
          {project.link && (
            <a href={project.link} target='_blank' className='btn btn-xs btn-link'>
              LINK
            </a>
          )}
          <button className='btn btn-xs btn-outline '>DETAIL</button>
        </div>
      </motion.div>

      {!project.overviewImg && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isShow ? 1 : 0 }}
          className='flex w-full h-full flex-col mt-20'
        >
          <img
            src={project.thumbImageUri}
            loading='lazy'
            alt=''
            className='rounded-xl object-cover w-full max-h-60 sm:h-96 sm:max-h-96'
          />
          <div className='mt-4 flex flex-col gap-4'>
            <p>{project.overview}</p>
          </div>
        </motion.div>
      )}

      {project.overviewImg && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isShow && !showNext ? 1 : 0 }}
            className='flex w-full h-full flex-col mt-20'
          >
            <img src={project.thumbImageUri} loading='lazy' alt='' className='rounded-xl object-cover w-full sm:h-96' />
            <div className='mt-4 flex flex-col gap-4'>
              <p>{project.overview}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isShow && showNext ? 1 : 0 }}
            className='flex w-full h-full flex-col mt-20'
          >
            <img src={project.overviewImg} loading='lazy' alt='' className='rounded-xl object-cover w-full sm:h-96' />
            <div className='mt-4 flex flex-col gap-4'>
              <p>{project.overview2}</p>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
}
