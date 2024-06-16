import { motion, useInView, useMotionValueEvent, useScroll } from 'framer-motion';
import { loremIpsum } from 'lorem-ipsum';
import React, { useMemo, useRef, useState } from 'react';

const DUMMY = [
  'https://cdn.prod.website-files.com/650478fbd32707701e101c64/6512fd12cdb632e3a9ceef18_pexels.webp',
  'https://cdn.prod.website-files.com/650478fbd32707701e101c64/6533e2c432e997a1c5845e47_safari-condo-website%20(3).webp',
  'https://cdn.prod.website-files.com/650478fbd32707701e101c64/6533e2c220d28e426debe1d0_safari-condo-website%20(1).webp',
  'https://cdn.prod.website-files.com/650478fbd32707701e101c64/6533e2c497cd72e2104fcd62_safari-condo-website%20(2).webp',
];

function Projects() {
  const scrollRef = useRef(null);
  const showRef = useRef(null);
  const isInview = useInView(scrollRef, { amount: 'some' });
  const isInviewShow = useInView(showRef, { amount: 'some' });
  const [projects, setProjects] = useState([1, 2, 3, 4, 5, 6]);

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: isInview && isInviewShow ? 1 : 0 }}
        className='text-6xl font-oranienbaum text-shadow shadow-base-content z-10 sticky top-16 '
      >
        PROJECTS
      </motion.h1>
      <div ref={scrollRef} />
      <div className='h-[35vh]' />
      <div ref={showRef} />
      <div className='flex flex-col gap-12'>
        {projects.map((project, i) => (
          <Project project={project} key={i} />
        ))}
      </div>
    </div>
  );
}

export default Projects;

function Project({ project }: any) {
  const scrollRef = useRef(null);
  const [animationY, setAnimationY] = useState(0);
  const { scrollYProgress } = useScroll({ target: scrollRef, offset: ['start end', 'end start'] });
  const [projectContents, setProjectContents] = useState(DUMMY);
  useMotionValueEvent(scrollYProgress, 'change', setAnimationY);
  if (!projectContents) return null;

  return (
    <div>
      <motion.div className='p-2  z-20 sticky top-16 bg-base-100 text-base-content bg-opacity-30 backdrop-blur-lg flex justify-between'>
        <motion.h1
          className=' text-3xl font-oranienbaum text-center'
          initial={{ opacity: 0 }}
          animate={{ opacity: animationY > 1 / (projectContents.length * 2) && animationY < 1 ? 1 : 0 }}
        >
          {`TITLE-${project}`}
        </motion.h1>
        <div>
          <button className='btn btn-xs btn-link'>LINK</button>
          <button className='btn btn-xs btn-outline '>DETAIL</button>
        </div>
      </motion.div>
      <motion.div className='overflow-hidden flex flex-col gap-4' ref={scrollRef}>
        {projectContents.map((projectContent, i) => (
          <ProjectContent key={i} src={projectContent} />
        ))}
      </motion.div>
    </div>
  );
}

function ProjectContent({ src }: any) {
  const content = useMemo(() => loremIpsum({ units: 'paragraph' }), []);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(scrollRef);

  return (
    <div className='relative'>
      <div ref={scrollRef} className='top-1/2 absolute z-50'></div>
      <motion.div
        className='flex w-full flex-col sm:flex-row'
        initial={{ opacity: 0, x: 100 }}
        animate={{
          opacity: inView ? 1 : 0,
          x: inView ? 0 : 100,
        }}
      >
        <img className='sm:w-2/3 aspect-video object-cover' src={src} alt='' />
        <p>{content}</p>
      </motion.div>
    </div>
  );
}
