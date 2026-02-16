import { motion, AnimatePresence } from 'framer-motion';
import { useKonamiCode } from '../../hooks';

export function KonamiToast() {
  const activated = useKonamiCode();

  return (
    <AnimatePresence>
      {activated && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none"
        >
          <div className="px-6 py-3 pixel-panel font-mono text-sm flex items-center gap-3 glow">
            <span className="text-primary font-display text-pixel-xs">+30</span>
            <span className="text-primary/60 font-display text-[8px]">LIVES</span>
            <span className="text-muted-foreground mx-1">|</span>
            <span className="text-foreground/80 tracking-wider font-display text-[8px]">CHEAT ACTIVATED</span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-primary"
            >
              _
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
