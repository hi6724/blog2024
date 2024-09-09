import skillIcons from '@/assets/images/skills';
import classNames from 'classnames';
import React from 'react';

function AboutmeSkills() {
  const skillIconsNames = skillIcons.map((str) => str.src.split('icons8-')[1].split('.')[0]);

  return (
    <div>
      <h2 className='font-bold text-2xl px-2 mt-16'>기술스택</h2>
      <div className={classNames('mt-2 [&_img]:w-12 [&_img]:h-12 gap-2 grid sm:grid-cols-8 grid-cols-3')}>
        {skillIconsNames.map((skill, index) => (
          <div key={index} className='p-2 rounded-md flex flex-col items-center justify-center min-w-20'>
            <img src={skillIcons[index].src} alt={'스킬'} />
            <span className='text-xs'>{skill}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AboutmeSkills;
