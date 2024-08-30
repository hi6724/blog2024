'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useAboutMeList } from '@/react-query/about-me';

function AboutMeTimeLine() {
  const { data: aboutMeData } = useAboutMeList();

  const ulRef = useRef<HTMLUListElement | null>(null);
  const boxRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [cumulativeHeights, setCumulativeHeights] = useState<number[]>([]);
  const [ulHeight, setUlHeight] = useState(0);

  const [animationY, setAnimationY] = useState(0);
  const { scrollYProgress } = useScroll({ target: ulRef, offset: ['start 50%', 'end 50%'] });
  useMotionValueEvent(scrollYProgress, 'change', setAnimationY);

  useEffect(() => {
    if (!boxRefs.current || boxRefs.current.length === 0) return;
    const cumulative = boxRefs.current
      .slice(0, -1) // 마지막 ref를 제외한 배열
      .reduce(
        (acc: number[], ref) => {
          const lastHeight = acc.length > 0 ? acc[acc.length - 1] : 0; // 마지막 누적 높이 가져오기
          const currentHeight = ref?.offsetHeight || 0; // 현재 박스 높이
          acc.push(lastHeight + currentHeight); // 현재 높이를 이전 누적 높이에 더해서 배열에 추가
          return acc;
        },
        [0]
      ); // 초기값은 빈 배열
    setCumulativeHeights(cumulative);
  }, [boxRefs, aboutMeData]);

  useEffect(() => {
    if (!ulRef.current) return;
    setUlHeight(ulRef.current.offsetHeight);
  }, [aboutMeData, ulRef]);

  const barHeight = ulHeight * animationY;

  return (
    <>
      <div className='px-2 py-4 relative'>
        <ul ref={ulRef} className='timeline timeline-snap-icon max-md:timeline-compact timeline-vertical relative'>
          {aboutMeData?.map((data, index: number) => (
            <li className='min-h-52' ref={(el: any) => (boxRefs.current[index] = el)} key={data.id}>
              {index !== 0 && <hr />}
              <div className='timeline-middle z-10 bg-base-100'>
                <motion.svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  className='h-5 w-5 text-primary'
                  animate={{
                    color:
                      barHeight > cumulativeHeights[index]
                        ? 'var(--fallback-p,oklch(var(--p)/var(--tw-text-opacity)))'
                        : 'var(--fallback-b3,oklch(var(--b3)/var(--tw-bg-opacity)))',
                    scale: barHeight > cumulativeHeights[index] ? 1.5 : 1,
                  }}
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z'
                    clipRule='evenodd'
                  />
                </motion.svg>
              </div>
              <div className={`${index % 2 === 0 ? 'timeline-start md:text-end' : 'timeline-end'} mb-10`}>
                <time className='font-mono italic'>{data.date.start + ''}</time>
                <div className='text-lg font-black'>{data.title}</div>
                {data.content}
              </div>
              {index !== aboutMeData.length - 1 && <hr />}
            </li>
          ))}
        </ul>
        <motion.div
          className='absolute w-1 bg-primary top-8 rounded-lg left-[17px] md:left-1/2 md:-translate-x-1/2'
          initial={{ height: 0 }}
          animate={{ height: barHeight }}
          style={{ maxHeight: cumulativeHeights.at(-1) }}
        />
      </div>
    </>
  );
}

export default AboutMeTimeLine;
