import { motion } from 'framer-motion';

interface GradientBlobProps {
  className?: string;
  color1?: string;
  color2?: string;
  delay?: number;
}

export function GradientBlob({
  className = '',
  color1 = 'from-primary/30',
  color2 = 'to-accent/20',
  delay = 0
}: GradientBlobProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, delay }}
      className={`absolute rounded-full blur-3xl animate-blob ${className}`}
    >
      <div className={`w-full h-full rounded-full bg-gradient-to-br ${color1} ${color2}`} />
    </motion.div>
  );
}

export function GradientBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Primary blob */}
      <GradientBlob
        className="w-[600px] h-[600px] -top-48 -left-48"
        color1="from-primary/20"
        color2="to-amber-700/10"
        delay={0}
      />

      {/* Secondary blob */}
      <GradientBlob
        className="w-[500px] h-[500px] top-1/4 -right-32 animation-delay-2000"
        color1="from-accent/15"
        color2="to-orange-500/10"
        delay={0.5}
      />

      {/* Tertiary blob */}
      <GradientBlob
        className="w-[400px] h-[400px] bottom-0 left-1/4 animation-delay-4000"
        color1="from-orange-600/10"
        color2="to-primary/15"
        delay={1}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-30" />

      {/* Noise texture */}
      <div className="absolute inset-0 noise opacity-50" />
    </div>
  );
}
