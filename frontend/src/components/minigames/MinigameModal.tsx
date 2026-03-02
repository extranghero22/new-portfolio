import { useState, useEffect, useCallback } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { motion, AnimatePresence } from 'framer-motion';
import { activeMinigameAtom, reducedMotionAtom, type MinigameId } from '../../store/atoms';
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from '../ui/dialog';
import { SnakeGame } from './SnakeGame';
import { TetrisGame } from './TetrisGame';
import { BreakoutGame } from './BreakoutGame';

export interface GameProps {
  isPaused: boolean;
  onGameOver: (finalScore: number) => void;
  onScoreChange: (score: number) => void;
  onLivesChange: (lives: number) => void;
  reducedMotion: boolean;
  gameKey: number;
}

const GAME_CONFIG: Record<MinigameId, { name: string; accent: string; accentVar: string }> = {
  snake: { name: 'SNAKE', accent: 'text-rpg-heal', accentVar: '140 70% 45%' },
  tetris: { name: 'TETRIS', accent: 'text-rpg-mp', accentVar: '190 90% 55%' },
  breakout: { name: 'BREAKOUT', accent: 'text-rpg-rare', accentVar: '270 70% 60%' },
};

const GAME_COMPONENTS: Record<MinigameId, React.ComponentType<GameProps>> = {
  snake: SnakeGame,
  tetris: TetrisGame,
  breakout: BreakoutGame,
};

function getBestKey(id: MinigameId) {
  return `minigame-${id}-best`;
}

export function MinigameModal() {
  const [activeMinigame, setActiveMinigame] = useAtom(activeMinigameAtom);
  const reducedMotion = useAtomValue(reducedMotionAtom);

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [bestScore, setBestScore] = useState(0);
  const [gamePhase, setGamePhase] = useState<'playing' | 'gameover'>('playing');
  const [isPaused, setIsPaused] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [selectedOption, setSelectedOption] = useState(0);

  // Reset state when game changes or restarts
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (activeMinigame) {
      const stored = localStorage.getItem(getBestKey(activeMinigame));
      setBestScore(stored ? parseInt(stored, 10) : 0);
      setScore(0);
      setLives(3);
      setGamePhase('playing');
      setIsPaused(false);
      setSelectedOption(0);
    }
  }, [activeMinigame, gameKey]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Pause on tab blur / visibility
  useEffect(() => {
    if (!activeMinigame || gamePhase !== 'playing') return;

    const handleVisibility = () => {
      if (document.hidden) setIsPaused(true);
    };
    const handleBlur = () => setIsPaused(true);
    const handleFocus = () => setIsPaused(false);

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [activeMinigame, gamePhase]);

  const handleGameOver = useCallback((finalScore: number) => {
    setGamePhase('gameover');
    if (activeMinigame) {
      const key = getBestKey(activeMinigame);
      const prev = parseInt(localStorage.getItem(key) || '0', 10);
      if (finalScore > prev) {
        localStorage.setItem(key, String(finalScore));
        setBestScore(finalScore);
      }
    }
  }, [activeMinigame]);

  const handleRestart = useCallback(() => {
    setGameKey(k => k + 1);
  }, []);

  const handleQuit = useCallback(() => {
    setActiveMinigame(null);
  }, [setActiveMinigame]);

  const handleOpenChange = (open: boolean) => {
    if (!open) setActiveMinigame(null);
  };

  // Keyboard nav on game-over screen
  useEffect(() => {
    if (gamePhase !== 'gameover') return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedOption(prev => (prev === 0 ? 1 : 0));
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedOption === 0) handleRestart();
        else handleQuit();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gamePhase, selectedOption, handleRestart, handleQuit]);

  if (!activeMinigame) return null;

  const config = GAME_CONFIG[activeMinigame];
  const GameComponent = GAME_COMPONENTS[activeMinigame];

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent
        className="pixel-panel glow-strong border-primary/60 max-w-2xl p-0 overflow-hidden [&>button:last-child]:hidden"
        style={{ '--section-accent': config.accentVar } as React.CSSProperties}
        onPointerDownOutside={e => e.preventDefault()}
        aria-describedby={undefined}
      >
        <DialogDescription className="sr-only">Play {config.name} minigame</DialogDescription>

        {/* Title Bar */}
        <div className="flex items-center justify-between px-1 py-1 bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30 border-b-2 border-primary/40">
          <DialogTitle className="font-display text-[8px] text-primary tracking-wider pl-2 flex items-center gap-2">
            <span className="text-[10px]">♦</span>
            {config.name}.exe
          </DialogTitle>
          <DialogClose className="flex items-center justify-center w-6 h-5 border-2 border-t-foreground/20 border-l-foreground/20 border-b-foreground/5 border-r-foreground/5 bg-background/80 hover:bg-rpg-hp/20 hover:border-rpg-hp/40 active:border-t-foreground/5 active:border-l-foreground/5 active:border-b-foreground/20 active:border-r-foreground/20 transition-colors mr-0.5">
            <span className="font-display text-[8px] text-foreground/60 leading-none">✕</span>
          </DialogClose>
        </div>

        {/* HUD Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-primary/20 bg-background/80">
          <span className={`font-display text-[8px] ${config.accent} tracking-widest`}>
            {config.name}
          </span>
          <div className="flex flex-col items-center">
            <span className="font-display text-[6px] text-foreground/30 tracking-widest">SCORE</span>
            <span className="font-display text-[10px] text-rpg-gold neon-text">
              {String(score).padStart(5, '0')}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <span
                key={i}
                className={`font-display text-[12px] ${i < lives ? 'text-rpg-hp' : 'text-rpg-hp/20'}`}
              >
                ♥
              </span>
            ))}
          </div>
        </div>

        {/* Game Canvas Area */}
        <div className="relative">
          <GameComponent
            isPaused={isPaused || gamePhase === 'gameover'}
            onGameOver={handleGameOver}
            onScoreChange={setScore}
            onLivesChange={setLives}
            reducedMotion={reducedMotion}
            gameKey={gameKey}
          />

          {/* Pause Overlay */}
          <AnimatePresence>
            {isPaused && gamePhase === 'playing' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 flex items-center justify-center bg-background/80"
              >
                <span className="font-display text-pixel-sm text-rpg-gold neon-text animate-glow-pulse">
                  PAUSED
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Game Over Overlay */}
          <AnimatePresence>
            {gamePhase === 'gameover' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/95"
              >
                <motion.h2
                  className="font-display text-pixel-sm text-rpg-hp mb-8 neon-text"
                  animate={reducedMotion ? {} : { opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  GAME OVER
                </motion.h2>

                <div className="pixel-panel p-6 mb-8 min-w-[240px]">
                  <div className="space-y-3">
                    <div className="flex justify-between gap-8">
                      <span className="font-display text-[7px] text-foreground/40">SCORE</span>
                      <span className="font-display text-[8px] text-rpg-gold">{String(score).padStart(5, '0')}</span>
                    </div>
                    <div className="flex justify-between gap-8">
                      <span className="font-display text-[7px] text-foreground/40">BEST</span>
                      <span className="font-display text-[8px] text-rpg-gold">{String(bestScore).padStart(5, '0')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-1">
                  <button
                    onClick={handleRestart}
                    className={`rpg-menu-item ${selectedOption === 0 ? 'active' : ''}`}
                  >
                    PLAY AGAIN
                  </button>
                  <button
                    onClick={handleQuit}
                    className={`rpg-menu-item ${selectedOption === 1 ? 'active' : ''}`}
                  >
                    QUIT
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls hint */}
        <div className="px-4 py-1.5 border-t border-primary/10 bg-background/60">
          <span className="font-display text-[6px] text-foreground/20 tracking-widest">
            {activeMinigame === 'snake' && '↑↓←→ MOVE    SPACE PAUSE'}
            {activeMinigame === 'tetris' && '←→ MOVE  ↓ DROP  ↑ HARD DROP  Z/X ROTATE  SPACE PAUSE'}
            {activeMinigame === 'breakout' && '←→ MOVE    SPACE PAUSE'}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
