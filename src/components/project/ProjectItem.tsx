import { useProjectOverviewList } from '@/react-query/project';
import { IProjectOverView } from '@/react-query/types';
import { useInView, motion, useScroll, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';
import ProjectContent from './ProjectContent';

function ProjectItem({ project, index }: { project: IProjectOverView; index: number }) {
  return (
    <Link href={`/project/${project.id}`}>
      <motion.div className='flex flex-col gap-4'>
        <ProjectContent project={project} reverse={index % 2 == 1} />
      </motion.div>
    </Link>
  );
}

export default ProjectItem;
