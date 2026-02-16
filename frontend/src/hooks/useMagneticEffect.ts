import { useRef, useCallback } from 'react';

interface MagneticOptions {
  strength?: number;
  ease?: number;
}

export function useMagneticEffect<T extends HTMLElement = HTMLDivElement>(
  options: MagneticOptions = {}
) {
  const { strength = 0.3, ease = 0.15 } = options;
  const ref = useRef<T>(null);
  const animationRef = useRef<number | null>(null);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);

  const animate = useCallback(() => {
    currentX.current += (targetX.current - currentX.current) * ease;
    currentY.current += (targetY.current - currentY.current) * ease;

    if (ref.current) {
      ref.current.style.transform = `translate(${currentX.current}px, ${currentY.current}px)`;
    }

    if (
      Math.abs(targetX.current - currentX.current) > 0.01 ||
      Math.abs(targetY.current - currentY.current) > 0.01
    ) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [ease]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<T>) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      targetX.current = deltaX;
      targetY.current = deltaY;

      if (!animationRef.current) {
        animationRef.current = requestAnimationFrame(animate);
      }
    },
    [strength, animate]
  );

  const handleMouseLeave = useCallback(() => {
    targetX.current = 0;
    targetY.current = 0;

    if (!animationRef.current) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  return {
    ref,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
  };
}
