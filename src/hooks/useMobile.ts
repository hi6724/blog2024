import { useEffect, useState } from 'react';

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  useEffect(() => {
    const resizeEvent = () => {
      window.innerWidth <= 640 ? setIsMobile(true) : setIsMobile(false);
    };
    window.addEventListener('resize', resizeEvent);
    return () => window.removeEventListener('resize', resizeEvent);
  });

  return isMobile;
};
