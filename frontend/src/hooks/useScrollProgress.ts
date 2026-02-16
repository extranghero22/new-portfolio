import { useState, useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { scrollProgressAtom } from '../store/atoms';

export function useScrollProgress() {
  const [scrollProgress, setLocalScrollProgress] = useState(0);
  const setScrollProgress = useSetAtom(scrollProgressAtom);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setLocalScrollProgress(progress);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [setScrollProgress]);

  return scrollProgress;
}
