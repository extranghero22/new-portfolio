import { motion, useScroll, useTransform } from 'framer-motion';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const width = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-4 bg-card/90 border-b-2 border-primary/30 flex items-center px-1">
      {/* EXP label */}
      <span className="font-display text-[7px] text-primary/70 mr-2 hidden sm:block tracking-widest">
        EXP
      </span>

      {/* Bar container */}
      <div className="flex-1 h-2.5 bg-background/60 border border-primary/20 relative overflow-hidden">
        {/* Segmented fill */}
        <motion.div
          className="absolute inset-y-0 left-0"
          style={{
            width,
            background: `repeating-linear-gradient(
              90deg,
              hsl(38 90% 50%) 0px,
              hsl(38 90% 50%) 6px,
              transparent 6px,
              transparent 8px
            )`,
          }}
        />
      </div>

      {/* Percentage */}
      <motion.span
        className="font-display text-[7px] text-primary/60 ml-2 hidden sm:block tracking-wider tabular-nums"
      >
        <motion.span>
          {/* We'll show a static % indicator */}
        </motion.span>
      </motion.span>
    </div>
  );
}
