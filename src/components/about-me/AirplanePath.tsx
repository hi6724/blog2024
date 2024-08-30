'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';

const PATH = `M10 0 Q 100 100 10 200 T 10 400 Q 100 500 10 600 T 10 800 Q 100 900 10 1000 T 10 1200 Q 100 1300 10 1400 T 10 1600 Q 100 1700 10 1800`;

const AirplanePath = () => {
  const ref = useRef(null);
  const [animationY, setAnimationY] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 30%', 'end 50%'] });
  useMotionValueEvent(scrollYProgress, 'change', setAnimationY);

  return (
    <div ref={ref} className='relative h-[1800px]'>
      <motion.svg className='absolute top-0 left-[65px] w-full h-[1800px] overflow-visible'>
        <motion.path d={PATH} fill='transparent' stroke='lightgrey' strokeWidth='2' strokeDasharray='5 5' />
        <motion.path
          className='stroke-primary fill-transparent stroke-2'
          d={PATH}
          animate={{ pathLength: animationY }}
          transition={{ duration: 1 }}
        />
      </motion.svg>
      <motion.div
        className='top-0 left-[65px] absolute w-4 h-4 bg-primary rounded-full my-box'
        initial={{ offsetDistance: '0%' }}
        animate={{ offsetDistance: animationY * 100 + '%' }}
        style={{
          offsetPath: `path('${PATH}')`,
        }}
        transition={{ duration: 1 }}
      />
    </div>
  );
};

export default AirplanePath;
