import { IProjectOverView } from '@/react-query/types';
import ProjectItem from './ProjectItem';

function ProjectList({ projects }: { projects: IProjectOverView[] }) {
  return (
    <div className='flex flex-col bg-base-100'>
      {projects?.map((project, i) => (
        <ProjectItem project={project} key={project.id} index={i} />
      ))}
    </div>
  );
}

export default ProjectList;
