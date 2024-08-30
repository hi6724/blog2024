'use client';
import classNames from 'classnames';
import { useInView, motion } from 'framer-motion';
import { useRef } from 'react';

const DATA = [];

function AboutmeHeader() {
  const scrollRef = useRef(null);
  const showRef = useRef(null);
  const isInviewShow = useInView(showRef, { amount: 'some' });

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: isInviewShow ? 1 : 0 }}
        className='text-title sticky top-16 mx-2'
      >
        ABOUT ME
      </motion.h1>
      <div ref={scrollRef} />
      <div className='h-16 sm:h-32' />
      <div ref={showRef} />

      <div className={`px-4 py-8 flex flex-col gap-4 ${container}`}>
        <div className='mb-4'>
          <h1 className='font-bold text-2xl'>프론트엔드 개발자</h1>
          <h1 className='font-bold text-2xl'>하훈목입니다.</h1>
        </div>

        <section>
          <h2>열정을 잃지 않는 개발자 입니다.</h2>
          <div>
            <p>
              기술블로그에{' '}
              <a href='/' className={strongText}>
                100+개의 포스팅
              </a>
              을 작성했습니다.
            </p>
            <p>
              구름톤에 참여하여{' '}
              <a href='/' className={strongText}>
                최우수상
              </a>
              을 수상했습니다.
            </p>
          </div>
        </section>
        <section>
          <h2>행동으로 옮기는 개발자 입니다.</h2>
          <div>
            <p>필요하다고 생각하면, 직접 만들어서 배포합니다.</p>
            <p>
              <a href='/' className={strongText}>
                tmax-extension을(다운로드 300+)
              </a>{' '}
              개발하였습니다.
            </p>
            <p>
              무신사가 PC버전을 종료하여 PC에 적합한 화면으로 보여주는{' '}
              <a href='/' className={strongText}>
                무신사PC
              </a>
              를 개발했습니다.{' '}
            </p>
          </div>
        </section>

        <section>
          <h2>수상이력</h2>
          <p>
            <a href='https://9oormthon.goorm.io/cb4a3770-a6ea-4ce8-b56b-36b6acc31ffd' className={strongText}>
              구름톤 최우수상 <time className='text-sm'>2024.05.24</time>
            </a>
          </p>
          <p>
            <a href='https://www.youtube.com/watch?v=g-hA8vYcROk' className={strongText}>
              조코딩X유데미X원티드-AI 해커톤: 본선진출 <time className='text-sm'>2023.8.19</time>
            </a>
          </p>
          <p>
            SSAFY 특화 프로젝트 경진대회 <time className='text-sm'>2023.04.07</time>
          </p>
          <p>
            SSAFY 1학기 최종 프로젝트 최우수상 <time className='text-sm'>2022.11.25</time>
          </p>
          <p>
            <a href='https://nomadcoders.co/community/thread/1435' className={strongText}>
              천하제일 앱 컨테스트 기발하상
            </a>
            <time className='text-sm inline'>2021.11.30</time>
          </p>
        </section>
        <section>
          <h2>자격증</h2>
          <p>SQLD (2023.12.15)</p>
          <p>PCCP Lv2 (2023.07.16)</p>
          <p>영어 OPIc IM1 (2022.12.24)</p>
          <p>일본어 JLPT N1 (2022.08.10)</p>
        </section>
      </div>
    </div>
  );
}

export default AboutmeHeader;

const strongText = classNames('underline-offset-2 btn-link inline');
const container = classNames(
  '[&_section_h2]:font-bold [&_section_h2]:text-lg [&_section_h2]:border-b [&_section_h2]:border-base-200 [&_section_h2]:mb-2 [&_section_h2]:pb-1'
);
