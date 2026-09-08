'use client';
import { CONTENT_STALE_MS } from '@/lib/cache-policy';
import { useQuery } from '@tanstack/react-query';
import type { AboutSection } from '@/lib/notion-about-sections';
import classNames from 'classnames';
import { useInView, motion, HTMLMotionProps } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

async function getSections(): Promise<AboutSection[]> {
  const response = await fetch('/api/about-me/sections', { cache: 'no-store' });
  if (!response.ok) throw new Error('자기소개 항목을 불러오지 못했습니다.');
  return response.json();
}

function AboutmeHeader() {
  const { data: sections = [], isPending, isError, refetch } = useQuery({
    queryKey: ['about-me/sections'], queryFn: getSections, staleTime: CONTENT_STALE_MS,
  });
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

        {isPending && <p role='status'>자기소개 항목을 불러오는 중입니다.</p>}
        {isError && <p role='alert'>자기소개 항목을 불러오지 못했습니다. <button className='btn btn-sm' onClick={() => void refetch()}>다시 시도</button></p>}
        {sections.map(section => <AnimateSection key={section.id} title={section.title}>
          {section.paragraphs.map(paragraph => <p key={paragraph.id} className={classNames('whitespace-pre-wrap', paragraph.bulleted && 'ml-5 list-item list-disc')}>
            {paragraph.parts.map((part, index) => {
              const textClass = classNames(part.bold && 'font-bold', part.italic && 'italic', part.muted && 'text-sm text-base-content/60');
              return part.href ? <Link key={index} href={part.href} className={classNames(strongText, textClass)}>{part.text}</Link>
                : <span key={index} className={textClass}>{part.text}</span>;
            })}
          </p>)}
        </AnimateSection>)}
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
