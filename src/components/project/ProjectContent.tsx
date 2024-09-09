import skillIcons from '@/assets/images/skills';
import { IProjectOverView } from '@/react-query/types';
import classNames from 'classnames';
import { useInView, motion } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

function ProjectContent({ project, reverse }: { project: IProjectOverView; reverse?: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref);

  return (
    <div className='relative' ref={ref}>
      <motion.div
        className={`flex w-full bg-base-100 py-6 flex-col mb-4 sm:flex-row sm:relative sm:mb-16 sm:px-4 hover:bg-base-200 ${
          reverse && 'sm:flex-row-reverse'
        }`}
        style={{
          transform: isInView ? 'none' : 'translateY(200px)',
          opacity: isInView ? 1 : 0,
          transition: 'all cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s',
        }}
      >
        <Image
          width={1000}
          height={400}
          className={`sm:w-3/5 shadow-xl w-full rounded-xl aspect-video object-cover sm:mb-[10%]`}
          src={project.thumbImageUri}
          alt=''
        />
        <div className='w-full relative'>
          <div className={classNames('font-bold', { 'text-end': !reverse })}>
            <h3
              className={classNames('text-primary items-center flex', {
                'flex-row-reverse': !reverse,
              })}
            >
              {project.type}
              <span className='font-normal text-xs text-base-content mx-2'>
                {project.startData} ~ {project.endDate}
              </span>
            </h3>
            <h1 className='text-3xl'>{project.title}</h1>
          </div>
          <div
            className={classNames('sm:absolute sm:w-[110%]', {
              'right-0': !reverse,
              'left-0': reverse,
            })}
          >
            <div
              className={classNames(
                'from-neutral-50/30 via-base-200 via-15% to-base-300 to-90% px-6 py-4 rounded-lg mt-4 sm:mt-8',
                {
                  'sm:bg-gradient-to-r': !reverse,
                  'sm:bg-gradient-to-l': reverse,
                }
              )}
            >
              <p className='line-clamp-4 whitespace-break-spaces leading-6'>{project.overview}</p>
            </div>
            <div className={classNames('mt-2 flex [&_img]:w-8 [&_img]:h-8 gap-2', { 'justify-end': !reverse })}>
              <SkillSet skills={project.skills} />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ProjectContent;

function SkillSet({ skills }: { skills: string[] }) {
  const skillIconsNames = skillIcons.map((str) => str.src.split('icons8-')[1].split('.')[0]);

  if (!skills) return null;
  return skills.map((skill) => {
    const index = skillIconsNames.indexOf(skill);
    if (index === -1) return null;
    return (
      <div key={skill} className='bg-base-200 p-2 rounded-md flex flex-col items-center justify-center min-w-20'>
        <img src={skillIcons[index].src} alt={skill} />
        <span className='text-xs'>{skill}</span>
      </div>
    );
  });
}
