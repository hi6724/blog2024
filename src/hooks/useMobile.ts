'use client';
import { useEffect, useState } from 'react';

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const resizeEvent = () => {
      window.innerWidth <= 640 ? setIsMobile(true) : setIsMobile(false);
    };
    window.addEventListener('resize', resizeEvent);
    return () => window.removeEventListener('resize', resizeEvent);
  });
  useEffect(() => {
    setIsMobile(window.innerWidth <= 640);
  }, []);

  return isMobile;
};
