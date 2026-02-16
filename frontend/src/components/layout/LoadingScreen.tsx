import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSetAtom } from 'jotai';
import { isLoadingAtom, loadingProgressAtom } from '../../store/atoms';

const BOOT_LINES = [
  { text: 'BIOS v2.4.1 ── AMBER SYSTEMS', delay: 0 },
  { text: 'MEM CHECK ......... 640K OK', delay: 200 },
  { text: 'LOADING MODULES:', delay: 500 },
  { text: '  ├── portfolio.exe', delay: 650 },
  { text: '  ├── animations.dll', delay: 800 },
  { text: '  ├── style.css', delay: 950 },
  { text: '  └── effects.wasm', delay: 1100 },
  { text: '', delay: 1300 },
  { text: 'INITIALIZING ...', delay: 1400 },
];

export function LoadingScreen() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showReady, setShowReady] = useState(false);
  const setIsLoading = useSetAtom(isLoadingAtom);
  const setLoadingProgress = useSetAtom(loadingProgressAtom);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    // Reveal boot lines one by one
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => setVisibleLines(i + 1), line.delay);
    });

    // Progress bar starts after last boot line
    const barStart = 1500;
    const barDuration = 1200;
    const steps = 30;
    const stepTime = barDuration / steps;

    for (let i = 1; i <= steps; i++) {
      setTimeout(() => {
        const p = Math.min(100, Math.round((i / steps) * 100));
        setProgress(p);
        setLoadingProgress(p);
      }, barStart + i * stepTime);
    }

    // Show READY and exit
    setTimeout(() => setShowReady(true), barStart + barDuration + 200);
    setTimeout(() => {
      setIsComplete(true);
      setTimeout(() => setIsLoading(false), 600);
    }, barStart + barDuration + 800);
  }, [setIsLoading, setLoadingProgress]);

  const barWidth = 24;
  const filled = Math.round((progress / 100) * barWidth);
  const bar = '█'.repeat(filled) + '░'.repeat(barWidth - filled);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
        >
          {/* Amber glow behind terminal */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-primary/8 blur-[120px]" />

          {/* Terminal window */}
          <div className="relative z-10 w-full max-w-lg mx-4">
            {/* Terminal chrome */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/60 border border-border/40 border-b-0">
              <div className="w-2.5 h-2.5 bg-primary/60" />
              <div className="w-2.5 h-2.5 bg-primary/30" />
              <div className="w-2.5 h-2.5 bg-primary/15" />
              <span className="ml-3 text-xs font-mono text-muted-foreground/60">amber-terminal</span>
            </div>

            {/* Terminal body */}
            <div className="px-5 py-5 rounded-b-lg bg-background/80 backdrop-blur-sm border border-border/40 border-t-border/20 font-mono text-sm leading-relaxed">
              {/* Boot lines */}
              {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
                <div key={i} className="text-primary/80">
                  {line.text && (
                    <span>
                      <span className="text-primary/40">&gt; </span>
                      {line.text}
                    </span>
                  )}
                  {!line.text && <br />}
                </div>
              ))}

              {/* Progress bar */}
              {visibleLines >= BOOT_LINES.length && (
                <div className="mt-1">
                  <span className="text-primary/40">&gt; </span>
                  <span className="text-primary/70">[</span>
                  <span className="text-primary">{bar}</span>
                  <span className="text-primary/70">]</span>
                  <span className="text-primary/60 ml-2">{progress}%</span>
                </div>
              )}

              {/* READY */}
              {showReady && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2"
                >
                  <span className="text-primary/40">&gt; </span>
                  <span className="text-primary font-bold">READY</span>
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="text-primary ml-0.5"
                  >
                    _
                  </motion.span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
