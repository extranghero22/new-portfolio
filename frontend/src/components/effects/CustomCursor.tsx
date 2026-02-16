import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useAtomValue } from 'jotai';
import { cursorVariantAtom, cursorTextAtom } from '../../store/atoms';

export function CustomCursor() {
  const cursorVariant = useAtomValue(cursorVariantAtom);
  const cursorText = useAtomValue(cursorTextAtom);
  const cursorRef = useRef<HTMLDivElement>(null);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', moveCursor);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, [cursorX, cursorY]);

  // Amber Monitor theme
  const variants = {
    default: {
      width: 20,
      height: 20,
      backgroundColor: 'rgba(204, 153, 51, 0.25)',
      border: '2px solid rgba(204, 153, 51, 0.7)',
      boxShadow: '0 0 12px rgba(204, 153, 51, 0.3)',
      mixBlendMode: 'difference' as const,
    },
    text: {
      width: 120,
      height: 120,
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      border: '2px solid rgba(255, 255, 255, 0.4)',
      boxShadow: '0 0 25px rgba(178, 120, 50, 0.25)',
      mixBlendMode: 'difference' as const,
    },
    link: {
      width: 60,
      height: 60,
      backgroundColor: 'rgba(204, 153, 51, 0.15)',
      border: '2px solid rgba(204, 153, 51, 0.9)',
      boxShadow: '0 0 20px rgba(204, 153, 51, 0.35)',
      mixBlendMode: 'normal' as const,
    },
    project: {
      width: 100,
      height: 100,
      backgroundColor: 'rgba(178, 120, 50, 0.15)',
      border: '2px solid rgba(178, 120, 50, 0.9)',
      boxShadow: '0 0 25px rgba(178, 120, 50, 0.35)',
      mixBlendMode: 'normal' as const,
    },
  };

  return (
    <>
      {/* Main cursor with glow effect */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full flex items-center justify-center"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        variants={variants}
        animate={cursorVariant}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {cursorText && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="text-xs font-medium text-white whitespace-nowrap"
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>

      {/* Dot cursor with subtle glow */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'linear-gradient(135deg, hsl(38 90% 50%) 0%, hsl(25 70% 42%) 100%)',
          boxShadow: '0 0 8px rgba(204, 153, 51, 0.6), 0 0 16px rgba(178, 120, 50, 0.3)',
        }}
      />
    </>
  );
}
