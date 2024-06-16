import Link from 'next/link';

export default function NavBar() {
  return (
    <div className='navbar bg-base-100 sticky top-0 z-50 '>
      <div className='flex-none'></div>
      <div className='flex-1'>
        <a className='btn btn-ghost text-3xl font-oranienbaum'>HUNMOK</a>
      </div>
      <div className='flex-none sm:hidden'>
        <div className='dropdown dropdown-end'>
          <div tabIndex={0} role='button' className='btn btn-ghost btn-circle'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h7' />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className='menu menu-lg dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 font-oranienbaum text-2xl'
          >
            <li>
              <Link href={'/'}>HOME</Link>
            </li>
            <li>
              <Link href={'/'}>ABOUT ME</Link>
            </li>
            <li>
              <Link href={'/'}>PROJECTS</Link>
            </li>
            <li>
              <Link href={'/'}>BLOG</Link>
            </li>
            <li>
              <Link href={'/'}>GUESTBOOK</Link>
            </li>
          </ul>
        </div>
      </div>
      {/* desktop */}
      <div className='hidden sm:flex gap-4 font-oranienbaum text-2xl *:link *:link-hover'>
        <Link href={'/'}>HOME</Link>
        <Link href={'/'}>ABOUT ME</Link>
        <Link href={'/'}>PROJECTS</Link>
        <Link href={'/'}>BLOG</Link>
      </div>
    </div>
  );
}
