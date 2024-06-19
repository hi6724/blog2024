import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
import { loremIpsum } from 'lorem-ipsum';

function AboutMe() {
  const scrollRef = useRef(null);
  const [animationY, setAnimationY] = useState(0);
  const { scrollYProgress } = useScroll({ target: scrollRef, offset: ['start start', 'end 70%'] });
  useMotionValueEvent(scrollYProgress, 'change', setAnimationY);

  return (
    <div ref={scrollRef}>
      <motion.div className='w-full h-full flex justify-center mt-10 top-16 sticky *:absolute'>
        <CarouselItem
          scrollY={animationY}
          index={0}
          src='https://cdn.prod.website-files.com/650478fbd32707701e101c64/6512fd12cdb632e3a9ceef18_pexels.webp'
        />
        <CarouselItem
          scrollY={animationY}
          index={1}
          src='https://cdn.prod.website-files.com/650478fbd32707701e101c64/6533e2c432e997a1c5845e47_safari-condo-website%20(3).webp'
        />
        <CarouselItem
          scrollY={animationY}
          index={2}
          src='https://cdn.prod.website-files.com/650478fbd32707701e101c64/6533e2c220d28e426debe1d0_safari-condo-website%20(1).webp'
        />
        <CarouselItem
          scrollY={animationY}
          index={3}
          src='https://cdn.prod.website-files.com/650478fbd32707701e101c64/6533e2c497cd72e2104fcd62_safari-condo-website%20(2).webp'
        />
      </motion.div>
      <div className='h-[200vh] sm:h-[400vh]'></div>
    </div>
  );
}

export default AboutMe;

function CarouselItem({ src, index, scrollY }: { src: string; index: number; scrollY: number }) {
  const isShow = scrollY >= index / 4 && scrollY < (index + 1) / 4;
  const title = useMemo(() => loremIpsum({ units: 'word' }), []);
  const paragraphs = useMemo(() => loremIpsum({ count: 2, units: 'paragraph', paragraphUpperBound: 4 }), []);

  return (
    <>
      <motion.div
        className='w-full top-20 sticky z-10 backdrop-blur-lg'
        initial={{ opacity: 0 }}
        animate={{ opacity: isShow ? 1 : 0 }}
      >
        <h1 className='text-title text-center text-neutral-content p-2'>{title.toUpperCase()}</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isShow ? 1 : 0 }}
        className='flex w-full h-full flex-col '
      >
        <img src={src} loading='lazy' alt='' className='rounded-xl object-cover  w-full sm:h-96' />
        <div className='mt-4 flex flex-col gap-4'>
          {paragraphs.split('\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </motion.div>
    </>
  );
}
