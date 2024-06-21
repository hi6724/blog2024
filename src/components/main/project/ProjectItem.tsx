import { IProjectOverView } from '@/react-query/types';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ProjectItem({
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
        initial={{ opacity: 0, zIndex: -1 }}
        animate={{ opacity: isShow ? 1 : 0, zIndex: isShow ? 1 : -1 }}
      >
        <h1 className='text-sub-title text-center'>{project.title}</h1>
        <div>
          {project.link && (
            <a href={project.link} target='_blank' className='btn btn-xs btn-link'>
              LINK
            </a>
          )}
          <Link href={`/project/${project.id}`} className='btn btn-xs btn-outline '>
            DETAIL
          </Link>
        </div>
      </motion.div>

      {!project.overviewImg && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isShow ? 1 : 0 }}
          className='flex w-full h-full flex-col mt-20 min-h-screen'
        >
          <Image
            src={project.thumbImageUri}
            blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=='
            alt=''
            className='rounded-xl object-cover h-60 w-full sm:h-96'
            width={400}
            height={240}
          />
          <div className='mt-4 flex flex-col gap-4'>
            <p className='whitespace-break-spaces'>{project.overview}</p>
          </div>
        </motion.div>
      )}

      {project.overviewImg && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isShow && !showNext ? 1 : 0 }}
            className='flex w-full h-full flex-col mt-20 min-h-screen'
          >
            <Image
              src={project.thumbImageUri}
              blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=='
              alt=''
              className='rounded-xl object-cover h-60 w-full sm:h-96'
              width={400}
              height={240}
            />
            <div className='mt-4 flex flex-col gap-4'>
              <p className='whitespace-break-spaces'>{project.overview}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isShow && showNext ? 1 : 0 }}
            className='flex w-full h-full flex-col mt-20 min-h-screen'
          >
            <Image
              src={project.overviewImg}
              blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=='
              alt=''
              className='rounded-xl object-cover h-60 w-full sm:h-96'
              width={400}
              height={240}
            />
            <div className='mt-4 flex flex-col gap-4'>
              <p className='whitespace-break-spaces'>{project.overview2}</p>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
}
