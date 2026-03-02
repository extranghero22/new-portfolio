import { useEffect, useRef, useCallback } from 'react';
import type { GameProps } from './MinigameModal';

const GRID = 20;
const CELL = 24;
const SIZE = GRID * CELL; // 480px
const INITIAL_SPEED = 150;
const MIN_SPEED = 60;
const SPEED_STEP = 10;
const FOOD_PER_LEVEL = 5;
const SCORE_PER_FOOD = 10;
const MAX_LIVES = 3;

type Dir = 'up' | 'down' | 'left' | 'right';
type Point = { x: number; y: number };

function getRandomFood(snake: Point[]): Point {
  let p: Point;
  do {
    p = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
  } while (snake.some(s => s.x === p.x && s.y === p.y));
  return p;
}

export function SnakeGame({ isPaused, onGameOver, onScoreChange, onLivesChange, reducedMotion, gameKey }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    snake: [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }] as Point[],
    dir: 'right' as Dir,
    nextDir: 'right' as Dir,
    food: { x: 15, y: 10 } as Point,
    score: 0,
    lives: MAX_LIVES,
    level: 1,
    foodEaten: 0,
    speed: INITIAL_SPEED,
    dead: false,
    deathFlash: 0,
  });
  const tickRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);

  const resetGame = useCallback(() => {
    const s = stateRef.current;
    s.snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    s.dir = 'right';
    s.nextDir = 'right';
    s.food = getRandomFood(s.snake);
    s.score = 0;
    s.lives = MAX_LIVES;
    s.level = 1;
    s.foodEaten = 0;
    s.speed = INITIAL_SPEED;
    s.dead = false;
    s.deathFlash = 0;
    onScoreChange(0);
    onLivesChange(MAX_LIVES);
  }, [onScoreChange, onLivesChange]);

  const respawnSnake = useCallback(() => {
    const s = stateRef.current;
    s.snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    s.dir = 'right';
    s.nextDir = 'right';
    s.dead = false;
    s.deathFlash = 0;
  }, []);

  // Game tick
  const tick = useCallback(() => {
    const s = stateRef.current;
    if (s.dead) return;

    s.dir = s.nextDir;
    const head = { ...s.snake[0] };

    switch (s.dir) {
      case 'up': head.y--; break;
      case 'down': head.y++; break;
      case 'left': head.x--; break;
      case 'right': head.x++; break;
    }

    // Wall collision or self collision
    const hitWall = head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID;
    const hitSelf = s.snake.some(seg => seg.x === head.x && seg.y === head.y);

    if (hitWall || hitSelf) {
      s.lives--;
      s.deathFlash = 10;
      onLivesChange(s.lives);
      if (s.lives <= 0) {
        s.dead = true;
        onGameOver(s.score);
        return;
      }
      s.dead = true;
      setTimeout(() => {
        respawnSnake();
      }, 600);
      return;
    }

    s.snake.unshift(head);

    // Eat food
    if (head.x === s.food.x && head.y === s.food.y) {
      s.score += SCORE_PER_FOOD;
      s.foodEaten++;
      onScoreChange(s.score);
      s.food = getRandomFood(s.snake);

      if (s.foodEaten % FOOD_PER_LEVEL === 0) {
        s.level++;
        s.speed = Math.max(MIN_SPEED, s.speed - SPEED_STEP);
      }
    } else {
      s.snake.pop();
    }
  }, [onGameOver, onScoreChange, onLivesChange, respawnSnake]);

  // Main effect — canvas, input, game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${SIZE}px`;
    canvas.style.height = `${SIZE}px`;

    resetGame();

    // Keyboard input
    const handleKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      const dirMap: Record<string, Dir> = {
        ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
        w: 'up', s: 'down', a: 'left', d: 'right',
        W: 'up', S: 'down', A: 'left', D: 'right',
      };
      const newDir = dirMap[e.key];
      if (newDir) {
        e.preventDefault();
        const opposites: Record<Dir, Dir> = { up: 'down', down: 'up', left: 'right', right: 'left' };
        if (opposites[newDir] !== s.dir) {
          s.nextDir = newDir;
        }
      }
    };
    window.addEventListener('keydown', handleKey);

    // Render loop
    const render = () => {
      const s = stateRef.current;
      // Background
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--background')
        ? 'hsl(30 12% 6%)' : '#0d0b08';
      ctx.fillRect(0, 0, SIZE, SIZE);

      // Grid lines
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= GRID; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL, 0);
        ctx.lineTo(i * CELL, SIZE);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * CELL);
        ctx.lineTo(SIZE, i * CELL);
        ctx.stroke();
      }

      // Food
      ctx.fillStyle = 'hsl(45 95% 55%)';
      ctx.shadowColor = 'hsl(45 95% 55%)';
      ctx.shadowBlur = 8;
      ctx.fillRect(s.food.x * CELL + 4, s.food.y * CELL + 4, CELL - 8, CELL - 8);
      ctx.shadowBlur = 0;

      // Snake
      s.snake.forEach((seg, i) => {
        const isHead = i === 0;
        ctx.fillStyle = isHead ? 'hsl(140 70% 50%)' : 'hsl(140 70% 45%)';
        ctx.fillRect(seg.x * CELL + 2, seg.y * CELL + 2, CELL - 4, CELL - 4);
        if (isHead) {
          ctx.fillStyle = 'rgba(255,255,255,0.15)';
          ctx.fillRect(seg.x * CELL + 2, seg.y * CELL + 2, CELL - 4, 2);
        }
      });

      // Death flash
      if (s.deathFlash > 0 && !reducedMotion) {
        ctx.fillStyle = `rgba(239, 68, 68, ${s.deathFlash * 0.03})`;
        ctx.fillRect(0, 0, SIZE, SIZE);
        s.deathFlash = Math.max(0, s.deathFlash - 0.5);
      }

      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('keydown', handleKey);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [gameKey, resetGame, reducedMotion]);

  // Game tick interval — separate effect so pause works
  useEffect(() => {
    if (isPaused) {
      if (tickRef.current) clearInterval(tickRef.current);
      tickRef.current = null;
      return;
    }

    const runTick = () => {
      tick();
      // Reschedule at current speed (may change mid-game)
      tickRef.current = setTimeout(runTick, stateRef.current.speed);
    };
    tickRef.current = setTimeout(runTick, stateRef.current.speed);

    return () => {
      if (tickRef.current) clearTimeout(tickRef.current);
    };
  }, [isPaused, tick, gameKey]);

  return (
    <div className="flex items-center justify-center bg-background" style={{ padding: '0' }}>
      <canvas
        ref={canvasRef}
        style={{ width: SIZE, height: SIZE, imageRendering: 'pixelated' }}
      />
    </div>
  );
}
