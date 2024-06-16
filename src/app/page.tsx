'use client';
import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import AboutMe from '@/components/main/AboutMe';
import Blog from '@/components/main/Blog';
import ContactMe from '@/components/main/ContactMe';
import GuestBook from '@/components/main/GuestBook';
import Projects from '@/components/main/Projects';

export default function Home() {
  return (
    <Container>
      <NavBar />
      <div className='z-10 relative mt-12'>
        <h1 className='text-6xl font-normal font-oranienbaum'>HELLO!</h1>
        <h1 className='text-6xl font-normal font-oranienbaum'>{"I'M HUNMOK"}</h1>
      </div>

      <AboutMe />
      <Projects />
      <Blog />
      <GuestBook />
      <div className='h-16'></div>
      <Footer />
    </Container>
  );
}

function Container({ children }: any) {
  return (
    <div className='flex justify-center w-full scrollbar-hide'>
      <div className='max-w-5xl px-4 w-full'>{children}</div>
    </div>
  );
}
