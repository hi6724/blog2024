import { IAboutMeOverview, useAboutMeOverview } from '@/react-query/about-me';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import Link from 'next/link';
import { useRef, useState } from 'react';

const IMG_LIST = [
  'https://cdn.prod.website-files.com/650478fbd32707701e101c64/6512fd12cdb632e3a9ceef18_pexels.webp',
  'https://cdn.prod.website-files.com/650478fbd32707701e101c64/6533e2c432e997a1c5845e47_safari-condo-website%20(3).webp',
  'https://cdn.prod.website-files.com/650478fbd32707701e101c64/6533e2c220d28e426debe1d0_safari-condo-website%20(1).webp',
  'https://cdn.prod.website-files.com/650478fbd32707701e101c64/6533e2c497cd72e2104fcd62_safari-condo-website%20(2).webp',
];
function AboutMe() {
  const scrollRef = useRef(null);
  const [animationY, setAnimationY] = useState(0);
  const { scrollYProgress } = useScroll({ target: scrollRef, offset: ['start start', 'end 70%'] });
  useMotionValueEvent(scrollYProgress, 'change', setAnimationY);
  const { data } = useAboutMeOverview();
  const aboutMeData = data?.slice(0, 4);

  return (
    <>
      <div ref={scrollRef}>
        <motion.div className='w-full h-full flex justify-center mt-10 top-16 sticky *:absolute'>
          {aboutMeData?.map((data, index) => (
            <CarouselItem key={data.id} data={data} src={IMG_LIST[index]} index={index} scrollY={animationY} />
          ))}
        </motion.div>
        <div className='h-[225vh] sm:h-[450vh] bg-base-100'></div>
        <motion.div
          className='py-8 bg-base-100 z-10 flex justify-center sticky bottom-0 w-full max-w-screen-lg px-2'
          initial={{ opacity: 0 }}
          animate={{ opacity: animationY > 0.1 ? 1 : 0 }}
        >
          <Link href={'/about-me'} className='btn btn-primary w-full self-center max-w-96'>
            자기소개 자세히 보기
          </Link>
        </motion.div>
      </div>
    </>
  );
}

export default AboutMe;

function CarouselItem({
  data,
  src,
  index,
  scrollY,
}: {
  data: IAboutMeOverview;
  src: string;
  index: number;
  scrollY: number;
}) {
  const isShow = scrollY >= index / 4 && scrollY < (index + 1) / 4;

  return (
    <>
      <motion.div
        className='w-full top-20 sticky z-10 bg-base-300 bg-opacity-60'
        initial={{ opacity: 0 }}
        animate={{ opacity: isShow ? 1 : 0 }}
      >
        <h1 className='text-title text-center text-base-content p-2'>{data.title.toUpperCase()}</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isShow ? 1 : 0 }}
        className='flex w-full h-full flex-col '
      >
        <img src={src} loading='lazy' alt='' className='rounded-xl object-cover  w-full sm:h-96' />
        <div className='mt-4 flex flex-col gap-4 p-4 whitespace-break-spaces sm:text-xl'>
          <p>{data.content}</p>
        </div>
      </motion.div>
    </>
  );
}
