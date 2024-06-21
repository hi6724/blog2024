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
    <div className='absolute w-full *:absolute'>
      <motion.div
        className='p-2 w-full z-20 sticky top-0 bg-base-100 text-base-content bg-opacity-30 flex justify-between items-center border-b-2 border-opacity-30 sm:h-16 h-12 '
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

      <ProjectContent src={project.thumbImageUri} content={project.overview} show={isShow && !showNext} />
      <ProjectContent src={project.overviewImg} content={project.overview2} show={isShow && showNext} />
    </div>
  );
}

function ProjectContent({ show, src, content }: { show: boolean; src: string; content: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0 }}
      className='flex w-full h-full flex-col mt-12 sm:mt-16 min-h-screen'
    >
      <Image src={src} alt='' className='rounded-xl object-cover h-60 w-full sm:h-96' width={1000} height={400} />
      <div className='mt-4 flex flex-col gap-4 p-2'>
        <p className='whitespace-break-spaces line-clamp-5 sm:line-clamp-none'>{content}</p>
      </div>
    </motion.div>
  );
}
