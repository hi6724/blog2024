'use client';
import classNames from 'classnames';
import { useInView, motion, HTMLMotionProps } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

function AboutmeHeader() {
  return (
    <div>
      <img
        className='rounded-xl object-cover  w-full h-48 min-h-48 sm:h-64 sm:min-h-64 mb-8'
        src='https://firebasestorage.googleapis.com/v0/b/hunmok-fe31e.appspot.com/o/main%2Fbg.webp?alt=media&token=72085499-080a-4860-a8b9-82ca69428814'
        alt=''
      />

      <div className={`${container}`}>
        <div className='mb-8'>
          <motion.h1 className='font-bold text-2xl md:text-3xl'>프론트엔드 개발자</motion.h1>
          <motion.h1 className='font-bold text-2xl md:text-3xl'>하훈목입니다.</motion.h1>
        </div>

        <AnimateSection title='프로젝트'>
          <p>
            <span>사이드프로젝트로 </span>
            <Link href='/project/23e96911-9caa-498a-89db-5c9b02f956c1' className={`${strongText}`}>
              무신사PC 익스텐션
            </Link>
            <span>을 개발했습니다. (유저 2000+)</span>
          </p>
          <p>
            <span>KB국민은행에서 </span>
            <Link href='/project/ec37885e-13ef-4f4c-83ef-65e9f807cc38' className={`${strongText}`}>
              태블릿브랜치
            </Link>
            <span>와 </span>
            <Link href='/project/c97dc5ab-bf28-4714-a49f-dbff7b0d3331' className={`${strongText}`}>
              미리작성태블릿
            </Link>
            <span>을 개발하고 있습니다.</span>
          </p>
          <p>
            <span>TMAX에서 </span>
            <Link href='/project/ec37885e-13ef-4f4c-83ef-65e9f807cc38' className={`${strongText}`}>
              CoreBank
            </Link>
            <span>와 </span>
            <Link href='/project/c97dc5ab-bf28-4714-a49f-dbff7b0d3331' className={`${strongText}`}>
              배달공제조합
            </Link>
            <span>을 개발했습니다.</span>
          </p>
          <p>
            <span>SSAFY에서 </span>
            <Link href='/project/2ba92a19-359f-42b8-a597-232e6a16ca46' className={`${strongText}`}>
              니,누꼬?
            </Link>
            <span>를 개발했습니다.</span>
          </p>
        </AnimateSection>

        <AnimateSection title='수상이력'>
          <p>
            7th Ne(o)rdinary 우수상
            <time className='text-sm'> 2024.11.24</time>
          </p>
          <p>
            <Link href='/project/3c09e85b-8e7e-41e4-9dfb-d9ab68b830bc' className={strongText}>
              10th 구름톤 최우수상
            </Link>
            <time className='text-sm'> 2024.05.24</time>
          </p>
          <p>
            <Link href='/project/2ba92a19-359f-42b8-a597-232e6a16ca46' className={strongText}></Link>
            조코딩 AI 해커톤: 본선진출 <time className='text-sm'> 2023.8.19</time>
          </p>
          <p>
            8th SSAFY 특화 프로젝트 우수상<time className='text-sm'> 2023.04.07</time>
          </p>
          <p>
            8th SSAFY 관통 프로젝트 최우수상<time className='text-sm'> 2022.11.25</time>
          </p>
          <p>
            <Link href='/project/d55d84dc-c4c8-4040-83e7-09a6b5283512' className={strongText}>
              천하제일 앱 컨테스트 기발하상
            </Link>
            <time className='text-sm inline'> 2021.11.30</time>
          </p>
        </AnimateSection>
        <AnimateSection title='자격증'>
          <p>PCCP Lv5 (2024.11.14)</p>
          <p>SQLD (2023.12.15)</p>
          <p>영어 OPIc IM1 (2022.12.24)</p>
          <p>일본어 JLPT N1 (2022.08.10)</p>
        </AnimateSection>
      </div>
    </div>
  );
}

export default AboutmeHeader;

const strongText = classNames('underline-offset-2 btn-link inline');
const container = classNames(
  `[&_section_h2]:font-bold [&_section_h2]:text-lg [&_section_h2]:mb-2 [&_section_h2]:pb-1
  md:[&_section_h2]:text-xl md:[&_section_h2]:mb-4 md:[&_section_h2]:pb-2

  px-2 py-8 flex flex-col gap-8 bg-base-100 z-10 relative mb-12
  md:py-12 md:gap-12 md:mb-16

  [&_p]:mb-1
  `
);

function AnimateSection({ children, title }: { children: React.ReactNode; title?: string }) {
  const childrenRef = useRef<HTMLDivElement>(null);
  const [childrenHeight, setChildrenHeight] = useState(0);
  const isInview = useInView(childrenRef, { amount: 'some' });

  useEffect(() => {
    if (childrenRef.current) {
      setChildrenHeight(childrenRef.current.clientHeight);
    }
  }, [childrenRef]);

  return (
    <section className='z-10 relative'>
      {title && (
        <div className='relative z-0 h-8'>
          <motion.h2
            className='absolute top-0'
            initial={{ top: '1rem' }}
            whileInView={{ top: 0 }}
            transition={{ duration: 0.2, delay: 0.1, ease: 'easeInOut' }}
          >
            {title}
          </motion.h2>
          <motion.div
            className='absolute bg-primary w-full h-[1px] top-8 z-0'
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 1000 }}
            transition={{ duration: 0.3, delay: 0.2, ease: 'easeInOut' }}
          ></motion.div>
        </div>
      )}
      <div className='relative mt-4'>
        <motion.div
          className='z-10 relative'
          ref={childrenRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.3 }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
