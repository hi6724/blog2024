'use client';
import { motion } from 'framer-motion';
import { ALL_THEMES } from '@/lib/theme';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function NavBar() {
  return (
    <div className='navbar bg-base-100 sticky top-0 z-50'>
      <div className='flex-none'></div>
      <div className='flex-1'>
        <Link href={'/'} className='btn btn-ghost text-3xl font-letter p-0'>
          HUNMOK
        </Link>
      </div>

      <div className='flex-none flex items-center gap-4'>
        <ToggleTheme />
        <MobileNav />
      </div>
      {/* desktop */}
      <div className='hidden sm:flex gap-4 font-letter text-2xl *:link *:link-hover'>
        {NAV_DATA.map((el) => (
          <Link key={el.href} href={el.href}>
            {el.text}
          </Link>
        ))}
        <ToggleTheme desktop />
      </div>
    </div>
  );
}

const NAV_DATA = [
  { href: '/', text: 'HOME' },
  { href: '/about-me', text: 'ABOUT ME' },
  { href: '/project', text: 'PROJECTS' },
  { href: '/blog', text: 'BLOG' },
  { href: '/guestbook', text: 'GUESTBOOK' },
];

function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = (setOpen: any) => {
      setOpen(false);
    };
    window.addEventListener('scroll', () => handleScroll(setOpen));
    return () => window.removeEventListener('scroll', () => handleScroll(setOpen));
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  return (
    <div className='relative'>
      <div className='w-5 h-5 relative' onClick={() => setOpen(!open)}>
        <motion.div
          initial={{ opacity: 1, zIndex: 1 }}
          animate={{ opacity: open ? 0 : 1, zIndex: open ? 0 : 1, rotateX: open ? 90 : 0 }}
        >
          <HamburgerSvg className='absolute' />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, zIndex: 0 }}
          animate={{ opacity: open ? 1 : 0, zIndex: open ? 1 : 0, rotateX: open ? 0 : 90 }}
        >
          <CloseSvg className='absolute' />
        </motion.div>
      </div>
      <motion.div
        className={`flex absolute top-7 right-0 flex-col overflow-hidden w-52 shadow-xl shadow-base-content/40 rounded-xl`}
        initial={{ height: 0 }}
        animate={{ height: open ? '13.75rem' : 0 }}
      >
        {NAV_DATA.map((el) => (
          <div
            className={`font-letter text-xl px-4 py-2 bg-base-300/80 text-base-content first:rounded-t-xl last:rounded-b-xl ${
              pathname === el.href && 'bg-primary/80 text-primary-content'
            }`}
            key={el.text}
          >
            <Link href={el.href}>{el.text}</Link>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function ToggleTheme({ desktop }: { desktop?: boolean }) {
  const { theme, setTheme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  function toggleTheme() {
    const prevThemeIndex = ALL_THEMES.findIndex((el) => el === currentTheme);
    const nextTheme = ALL_THEMES[(prevThemeIndex + 1) % ALL_THEMES.length];
    setTheme(nextTheme);
  }
  return (
    <label
      onClick={toggleTheme}
      className={`${
        desktop ? 'hidden sm:flex sm:w-6 sm:h-6 sm:relative' : 'sm:hidden relative w-5 h-5'
      } cursor-pointer`}
    >
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: currentTheme === 'lighten' ? 1 : 0 }}>
        <SunSvg fill />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: currentTheme === 'light' ? 1 : 0 }}>
        <SunSvg />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: currentTheme === 'dark' ? 1 : 0 }}>
        <MoonSvg />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: currentTheme === 'darken' ? 1 : 0 }}>
        <MoonSvg fill />
      </motion.div>
    </label>
  );
}

function HamburgerSvg({ className }: { className?: string }) {
  return (
    <svg className={`fill-current w-5 h-5 ${className}`} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
      <path d='M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z' />
    </svg>
  );
}
function CloseSvg({ className }: { className?: string }) {
  return (
    <svg className={`fill-current w-5 h-5 ${className}`} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
      <polygon points='400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49' />
    </svg>
  );
}
function SunSvg({ fill }: { fill?: boolean }) {
  if (fill)
    return (
      <svg
        data-slot='icon'
        fill='currentColor'
        viewBox='0 0 24 24'
        xmlns='http://www.w3.org/2000/svg'
        aria-hidden='true'
        className='absolute w-5 h-5 sm:w-6 sm:h-6 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2'
      >
        <path d='M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z'></path>
      </svg>
    );
  return (
    <svg
      data-slot='icon'
      fill='none'
      strokeWidth='1.5'
      stroke='currentColor'
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'
      className='absolute w-5 h-5 sm:w-6 sm:h-6 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z'
      ></path>
    </svg>
  );
}

function MoonSvg({ fill }: { fill?: boolean }) {
  if (fill)
    return (
      <svg
        data-slot='icon'
        fill='currentColor'
        viewBox='0 0 24 24'
        xmlns='http://www.w3.org/2000/svg'
        aria-hidden='true'
        className='absolute w-5 h-5 sm:w-6 sm:h-6 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2'
      >
        <path
          clipRule='evenodd'
          fillRule='evenodd'
          d='M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z'
        ></path>
      </svg>
    );
  return (
    <svg
      data-slot='icon'
      fill='none'
      strokeWidth='1.5'
      stroke='currentColor'
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'
      className='absolute w-5 h-5 sm:w-6 sm:h-6 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z'
      ></path>
    </svg>
  );
}
