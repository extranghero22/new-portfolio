import { motion, type Variants } from 'framer-motion';
import { useInView } from '../../hooks/useInView';

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  staggerChildren?: number;
  once?: boolean;
}

export function TextReveal({
  children,
  className = '',
  delay = 0,
  staggerChildren = 0.03,
  once = true
}: TextRevealProps) {
  const { ref, isInView } = useInView({ threshold: 0.3, triggerOnce: once });

  const words = children.split(' ');

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren: delay,
      },
    },
  };

  const child: Variants = {
    hidden: {
      opacity: 0,
      y: 50,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: 'spring' as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.span
      ref={ref}
      className={`inline-flex flex-wrap ${className}`}
      variants={container}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      style={{ perspective: '1000px' }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-[0.25em] origin-bottom"
          variants={child}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

interface CharacterRevealProps {
  children: string;
  className?: string;
  delay?: number;
  staggerChildren?: number;
}

export function CharacterReveal({
  children,
  className = '',
  delay = 0,
  staggerChildren = 0.02
}: CharacterRevealProps) {
  const { ref, isInView } = useInView({ threshold: 0.3, triggerOnce: true });

  const characters = children.split('');

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren: delay,
      },
    },
  };

  const child: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: 'blur(10px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring' as const,
        damping: 12,
        stiffness: 200,
      },
    },
  };

  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className}`}
      variants={container}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          className="inline-block"
          variants={child}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

interface LineRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function LineReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up'
}: LineRevealProps) {
  const { ref, isInView } = useInView({ threshold: 0.3, triggerOnce: true });

  const directions = {
    up: { y: 100, x: 0 },
    down: { y: -100, x: 0 },
    left: { x: 100, y: 0 },
    right: { x: -100, y: 0 },
  };

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{
          ...directions[direction],
          opacity: 0
        }}
        animate={isInView ? {
          x: 0,
          y: 0,
          opacity: 1
        } : {}}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
