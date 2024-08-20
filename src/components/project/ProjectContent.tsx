import { useInView, motion } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

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
        whileHover={{ scale: 1.05, transition: { duration: 0.5, type: 'spring' } }}
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
          className={`whitespace-break-spaces backdrop-blur-sm h-28 bg-base-300 text-base-content rounded-xl p-2 mx-2 bg-opacity-60 -translate-y-8 sm:translate-y-0 sm:absolute sm:right-4 sm:bottom-4 sm:w-1/2 sm:p-8 sm:mx-0 sm:h-auto  ${
            reverse && 'sm:left-4'
          }`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <p className='line-clamp-4 sm:line-clamp-none break-keep'>{content}</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default ProjectContent;
