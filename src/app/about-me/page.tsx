import AboutmeHeader from '@/components/about-me/AboutmeHeader';
import AboutmeSkills from '@/components/about-me/AboutmeSkills';
import AboutMeTimeLine from '@/components/about-me/AboutMeTimeLine';

function page() {
  return (
    <>
      <AboutmeHeader />
      <AboutMeTimeLine />
      <AboutmeSkills />
    </>
  );
}

export default page;
