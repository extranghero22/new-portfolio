import { useEffect, useRef, useCallback } from 'react';
import type { GameProps } from './MinigameModal';

const W = 480;
const H = 400;
const PADDLE_W = 80;
const PADDLE_H = 12;
const PADDLE_SPEED = 7;
const BALL_SIZE = 8;
const INITIAL_BALL_SPEED = 4.5;
const BRICK_COLS = 8;
const BRICK_ROWS = 5;
const BRICK_W = 50;
const BRICK_H = 16;
const BRICK_GAP = 4;
const BRICK_OFFSET_X = (W - (BRICK_W + BRICK_GAP) * BRICK_COLS + BRICK_GAP) / 2;
const BRICK_OFFSET_Y = 50;
const MAX_LIVES = 3;

const ROW_COLORS = [
  'hsl(0 85% 55%)',    // hp red
  'hsl(270 70% 60%)',  // rare purple
  'hsl(45 95% 55%)',   // gold
  'hsl(140 70% 45%)',  // heal green
  'hsl(190 90% 55%)',  // mp cyan
];
const ROW_POINTS = [5, 4, 3, 2, 1];

interface Brick {
  x: number;
  y: number;
  row: number;
  hits: number;
  alive: boolean;
}

function createBricks(rows: number): Brick[] {
  const bricks: Brick[] = [];
  const r = Math.min(rows, 8);
  for (let row = 0; row < r; row++) {
    for (let col = 0; col < BRICK_COLS; col++) {
      const reinforced = row < 2 && col % 3 === 1;
      bricks.push({
        x: BRICK_OFFSET_X + col * (BRICK_W + BRICK_GAP),
        y: BRICK_OFFSET_Y + row * (BRICK_H + BRICK_GAP),
        row,
        hits: reinforced ? 2 : 1,
        alive: true,
      });
    }
  }
  return bricks;
}

export function BreakoutGame({ isPaused, onGameOver, onScoreChange, onLivesChange, reducedMotion, gameKey }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const stateRef = useRef({
    paddleX: W / 2 - PADDLE_W / 2,
    ballX: W / 2,
    ballY: H - 40,
    ballDX: INITIAL_BALL_SPEED,
    ballDY: -INITIAL_BALL_SPEED,
    bricks: createBricks(BRICK_ROWS),
    score: 0,
    lives: MAX_LIVES,
    level: 1,
    ballSpeed: INITIAL_BALL_SPEED,
    launched: false,
    shakeX: 0,
    shakeY: 0,
  });

  const resetBall = useCallback(() => {
    const s = stateRef.current;
    s.ballX = s.paddleX + PADDLE_W / 2;
    s.ballY = H - 40;
    s.ballDX = s.ballSpeed * (Math.random() > 0.5 ? 1 : -1);
    s.ballDY = -s.ballSpeed;
    s.launched = false;
  }, []);

  const resetGame = useCallback(() => {
    const s = stateRef.current;
    s.paddleX = W / 2 - PADDLE_W / 2;
    s.score = 0;
    s.lives = MAX_LIVES;
    s.level = 1;
    s.ballSpeed = INITIAL_BALL_SPEED;
    s.bricks = createBricks(BRICK_ROWS);
    s.shakeX = 0;
    s.shakeY = 0;
    onScoreChange(0);
    onLivesChange(MAX_LIVES);
    resetBall();
  }, [onScoreChange, onLivesChange, resetBall]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;

    resetGame();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'a', 'd', 'A', 'D', ' '].includes(e.key)) {
        e.preventDefault();
        keysRef.current.add(e.key);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [gameKey, resetGame]);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = 0;
    const targetDt = 1000 / 60;

    const loop = (time: number) => {
      rafRef.current = requestAnimationFrame(loop);

      if (time - lastTime < targetDt * 0.8) return;
      lastTime = time;

      const s = stateRef.current;
      const keys = keysRef.current;

      // --- Update ---
      if (!isPaused) {
        // Paddle movement
        if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A')) {
          s.paddleX = Math.max(0, s.paddleX - PADDLE_SPEED);
        }
        if (keys.has('ArrowRight') || keys.has('d') || keys.has('D')) {
          s.paddleX = Math.min(W - PADDLE_W, s.paddleX + PADDLE_SPEED);
        }

        // Launch ball on space
        if (!s.launched) {
          s.ballX = s.paddleX + PADDLE_W / 2;
          s.ballY = H - 40;
          if (keys.has(' ')) {
            s.launched = true;
            keys.delete(' ');
          }
        }

        if (s.launched) {
          // Move ball
          s.ballX += s.ballDX;
          s.ballY += s.ballDY;

          // Wall bounces
          if (s.ballX <= 0 || s.ballX + BALL_SIZE >= W) {
            s.ballDX = -s.ballDX;
            s.ballX = Math.max(0, Math.min(W - BALL_SIZE, s.ballX));
          }
          if (s.ballY <= 0) {
            s.ballDY = -s.ballDY;
            s.ballY = 0;
          }

          // Paddle collision
          if (
            s.ballY + BALL_SIZE >= H - PADDLE_H - 10 &&
            s.ballY + BALL_SIZE <= H - 10 + 4 &&
            s.ballX + BALL_SIZE >= s.paddleX &&
            s.ballX <= s.paddleX + PADDLE_W &&
            s.ballDY > 0
          ) {
            s.ballDY = -s.ballDY;
            // Angle based on where ball hits paddle
            const hitPos = (s.ballX + BALL_SIZE / 2 - s.paddleX) / PADDLE_W;
            s.ballDX = s.ballSpeed * (hitPos - 0.5) * 2.5;
            // Normalize speed
            const mag = Math.sqrt(s.ballDX * s.ballDX + s.ballDY * s.ballDY);
            s.ballDX = (s.ballDX / mag) * s.ballSpeed;
            s.ballDY = (s.ballDY / mag) * s.ballSpeed;
          }

          // Brick collision
          for (const brick of s.bricks) {
            if (!brick.alive) continue;
            if (
              s.ballX + BALL_SIZE > brick.x &&
              s.ballX < brick.x + BRICK_W &&
              s.ballY + BALL_SIZE > brick.y &&
              s.ballY < brick.y + BRICK_H
            ) {
              brick.hits--;
              if (brick.hits <= 0) {
                brick.alive = false;
                const pts = ROW_POINTS[Math.min(brick.row, ROW_POINTS.length - 1)];
                s.score += pts;
                onScoreChange(s.score);
              }

              // Determine bounce direction
              const overlapLeft = s.ballX + BALL_SIZE - brick.x;
              const overlapRight = brick.x + BRICK_W - s.ballX;
              const overlapTop = s.ballY + BALL_SIZE - brick.y;
              const overlapBottom = brick.y + BRICK_H - s.ballY;
              const minOverlapX = Math.min(overlapLeft, overlapRight);
              const minOverlapY = Math.min(overlapTop, overlapBottom);

              if (minOverlapX < minOverlapY) {
                s.ballDX = -s.ballDX;
              } else {
                s.ballDY = -s.ballDY;
              }

              if (!reducedMotion) {
                s.shakeX = (Math.random() - 0.5) * 4;
                s.shakeY = (Math.random() - 0.5) * 4;
              }
              break;
            }
          }

          // Ball falls below
          if (s.ballY > H + 10) {
            s.lives--;
            onLivesChange(s.lives);
            if (s.lives <= 0) {
              onGameOver(s.score);
              return;
            }
            resetBall();
          }

          // Level clear
          if (s.bricks.every(b => !b.alive)) {
            s.level++;
            s.ballSpeed += 0.5;
            s.bricks = createBricks(Math.min(BRICK_ROWS + s.level - 1, 8));
            resetBall();
          }
        }

        // Decay shake
        s.shakeX *= 0.8;
        s.shakeY *= 0.8;
        if (Math.abs(s.shakeX) < 0.1) s.shakeX = 0;
        if (Math.abs(s.shakeY) < 0.1) s.shakeY = 0;
      }

      // --- Render ---
      ctx.save();
      ctx.translate(s.shakeX, s.shakeY);

      // Background
      ctx.fillStyle = 'hsl(30 12% 6%)';
      ctx.fillRect(-4, -4, W + 8, H + 8);

      // Bricks
      for (const brick of s.bricks) {
        if (!brick.alive) continue;
        const color = ROW_COLORS[Math.min(brick.row, ROW_COLORS.length - 1)];
        ctx.fillStyle = brick.hits > 1 ? 'hsl(30 10% 25%)' : color;
        ctx.fillRect(brick.x, brick.y, BRICK_W, BRICK_H);
        // Bevel highlight
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillRect(brick.x, brick.y, BRICK_W, 2);
        ctx.fillRect(brick.x, brick.y, 2, BRICK_H);
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(brick.x, brick.y + BRICK_H - 2, BRICK_W, 2);
        ctx.fillRect(brick.x + BRICK_W - 2, brick.y, 2, BRICK_H);
      }

      // Paddle
      ctx.fillStyle = 'hsl(38 90% 50%)';
      ctx.fillRect(s.paddleX, H - PADDLE_H - 10, PADDLE_W, PADDLE_H);
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.fillRect(s.paddleX, H - PADDLE_H - 10, PADDLE_W, 2);

      // Ball
      ctx.fillStyle = 'hsl(40 100% 80%)';
      ctx.shadowColor = 'hsl(45 95% 55%)';
      ctx.shadowBlur = 6;
      ctx.fillRect(s.ballX, s.ballY, BALL_SIZE, BALL_SIZE);
      ctx.shadowBlur = 0;

      // Launch hint
      if (!s.launched) {
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.font = '10px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('PRESS SPACE', W / 2, H / 2 + 40);
      }

      ctx.restore();
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPaused, gameKey, resetBall, onGameOver, onScoreChange, onLivesChange, reducedMotion]);

  return (
    <div className="flex items-center justify-center bg-background">
      <canvas
        ref={canvasRef}
        style={{ width: W, height: H, imageRendering: 'pixelated' }}
      />
    </div>
  );
}
