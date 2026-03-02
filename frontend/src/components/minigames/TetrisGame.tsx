import { useEffect, useRef, useCallback } from 'react';
import type { GameProps } from './MinigameModal';

const COLS = 10;
const ROWS = 18;
const CELL = 24;
const FIELD_W = COLS * CELL;
const FIELD_H = ROWS * CELL;
const SIDEBAR_W = 120;
const W = FIELD_W + SIDEBAR_W;
const H = FIELD_H;
const INITIAL_SPEED = 800;
const SPEED_STEP = 60;
const MIN_SPEED = 100;

type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

const PIECE_SHAPES: Record<PieceType, number[][][]> = {
  I: [
    [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
    [[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]],
    [[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],
    [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
  ],
  O: [
    [[1,1],[1,1]],
    [[1,1],[1,1]],
    [[1,1],[1,1]],
    [[1,1],[1,1]],
  ],
  T: [
    [[0,1,0],[1,1,1],[0,0,0]],
    [[0,1,0],[0,1,1],[0,1,0]],
    [[0,0,0],[1,1,1],[0,1,0]],
    [[0,1,0],[1,1,0],[0,1,0]],
  ],
  S: [
    [[0,1,1],[1,1,0],[0,0,0]],
    [[0,1,0],[0,1,1],[0,0,1]],
    [[0,0,0],[0,1,1],[1,1,0]],
    [[1,0,0],[1,1,0],[0,1,0]],
  ],
  Z: [
    [[1,1,0],[0,1,1],[0,0,0]],
    [[0,0,1],[0,1,1],[0,1,0]],
    [[0,0,0],[1,1,0],[0,1,1]],
    [[0,1,0],[1,1,0],[1,0,0]],
  ],
  J: [
    [[1,0,0],[1,1,1],[0,0,0]],
    [[0,1,1],[0,1,0],[0,1,0]],
    [[0,0,0],[1,1,1],[0,0,1]],
    [[0,1,0],[0,1,0],[1,1,0]],
  ],
  L: [
    [[0,0,1],[1,1,1],[0,0,0]],
    [[0,1,0],[0,1,0],[0,1,1]],
    [[0,0,0],[1,1,1],[1,0,0]],
    [[1,1,0],[0,1,0],[0,1,0]],
  ],
};

const PIECE_COLORS: Record<PieceType, string> = {
  I: 'hsl(190 90% 55%)',  // mp cyan
  O: 'hsl(45 95% 55%)',   // gold
  T: 'hsl(270 70% 60%)',  // rare purple
  S: 'hsl(140 70% 45%)',  // heal green
  Z: 'hsl(0 85% 55%)',    // hp red
  J: 'hsl(210 80% 55%)',  // blue
  L: 'hsl(30 90% 55%)',   // orange
};

const PIECE_TYPES: PieceType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

function randomPiece(): PieceType {
  return PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
}

interface ActivePiece {
  type: PieceType;
  rotation: number;
  x: number;
  y: number;
}

type Board = (PieceType | null)[][];

function createBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function getShape(piece: ActivePiece): number[][] {
  return PIECE_SHAPES[piece.type][piece.rotation % 4];
}

function collides(board: Board, piece: ActivePiece): boolean {
  const shape = getShape(piece);
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const bx = piece.x + c;
      const by = piece.y + r;
      if (bx < 0 || bx >= COLS || by >= ROWS) return true;
      if (by >= 0 && board[by][bx]) return true;
    }
  }
  return false;
}

function placePiece(board: Board, piece: ActivePiece): Board {
  const newBoard = board.map(row => [...row]);
  const shape = getShape(piece);
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const by = piece.y + r;
      const bx = piece.x + c;
      if (by >= 0 && by < ROWS && bx >= 0 && bx < COLS) {
        newBoard[by][bx] = piece.type;
      }
    }
  }
  return newBoard;
}

function clearLines(board: Board): { board: Board; cleared: number } {
  const newBoard = board.filter(row => row.some(cell => cell === null));
  const cleared = ROWS - newBoard.length;
  while (newBoard.length < ROWS) {
    newBoard.unshift(Array(COLS).fill(null));
  }
  return { board: newBoard, cleared };
}

export function TetrisGame({ isPaused, onGameOver, onScoreChange, onLivesChange, reducedMotion, gameKey }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const dropRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef({
    board: createBoard(),
    current: { type: randomPiece(), rotation: 0, x: 3, y: -2 } as ActivePiece,
    next: randomPiece(),
    score: 0,
    level: 1,
    lines: 0,
    speed: INITIAL_SPEED,
    gameOver: false,
    shakeY: 0,
  });

  const spawnPiece = useCallback((): boolean => {
    const s = stateRef.current;
    s.current = { type: s.next, rotation: 0, x: 3, y: -2 };
    s.next = randomPiece();
    if (collides(s.board, s.current)) {
      s.gameOver = true;
      return false;
    }
    return true;
  }, []);

  const dropPiece = useCallback(() => {
    const s = stateRef.current;
    if (s.gameOver) return;

    const moved = { ...s.current, y: s.current.y + 1 };
    if (!collides(s.board, moved)) {
      s.current = moved;
    } else {
      // Place piece
      s.board = placePiece(s.board, s.current);
      const result = clearLines(s.board);
      s.board = result.board;

      if (result.cleared > 0) {
        s.lines += result.cleared;
        const lineScores = [0, 100, 300, 500, 800];
        s.score += lineScores[result.cleared] * s.level;
        onScoreChange(s.score);

        const newLevel = Math.floor(s.lines / 10) + 1;
        if (newLevel > s.level) {
          s.level = newLevel;
          s.speed = Math.max(MIN_SPEED, INITIAL_SPEED - (s.level - 1) * SPEED_STEP);
        }

        if (!reducedMotion) {
          s.shakeY = result.cleared * 2;
        }
      }

      if (!spawnPiece()) {
        onGameOver(s.score);
      }
    }
  }, [onScoreChange, onGameOver, spawnPiece, reducedMotion]);

  const resetGame = useCallback(() => {
    const s = stateRef.current;
    s.board = createBoard();
    s.current = { type: randomPiece(), rotation: 0, x: 3, y: -2 };
    s.next = randomPiece();
    s.score = 0;
    s.level = 1;
    s.lines = 0;
    s.speed = INITIAL_SPEED;
    s.gameOver = false;
    s.shakeY = 0;
    onScoreChange(0);
    onLivesChange(1); // Tetris doesn't really use lives
  }, [onScoreChange, onLivesChange]);

  // Main setup + render
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

    // Input
    const handleKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (s.gameOver || isPaused) return;

      switch (e.key) {
        case 'ArrowLeft': {
          e.preventDefault();
          const moved = { ...s.current, x: s.current.x - 1 };
          if (!collides(s.board, moved)) s.current = moved;
          break;
        }
        case 'ArrowRight': {
          e.preventDefault();
          const moved = { ...s.current, x: s.current.x + 1 };
          if (!collides(s.board, moved)) s.current = moved;
          break;
        }
        case 'ArrowDown': {
          e.preventDefault();
          const moved = { ...s.current, y: s.current.y + 1 };
          if (!collides(s.board, moved)) {
            s.current = moved;
            s.score += 1;
            onScoreChange(s.score);
          }
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          // Hard drop
          let dropY = s.current.y;
          while (!collides(s.board, { ...s.current, y: dropY + 1 })) {
            dropY++;
            s.score += 2;
          }
          s.current.y = dropY;
          onScoreChange(s.score);
          dropPiece();
          break;
        }
        case 'z':
        case 'Z': {
          e.preventDefault();
          const rotated = { ...s.current, rotation: (s.current.rotation + 3) % 4 };
          // Try wall kicks
          for (const dx of [0, -1, 1, -2, 2]) {
            const kicked = { ...rotated, x: rotated.x + dx };
            if (!collides(s.board, kicked)) {
              s.current = kicked;
              break;
            }
          }
          break;
        }
        case 'x':
        case 'X': {
          e.preventDefault();
          const rotated = { ...s.current, rotation: (s.current.rotation + 1) % 4 };
          for (const dx of [0, -1, 1, -2, 2]) {
            const kicked = { ...rotated, x: rotated.x + dx };
            if (!collides(s.board, kicked)) {
              s.current = kicked;
              break;
            }
          }
          break;
        }
      }
    };
    window.addEventListener('keydown', handleKey);

    // Render loop
    const render = () => {
      const s = stateRef.current;

      ctx.save();
      ctx.translate(0, s.shakeY);

      // Background
      ctx.fillStyle = 'hsl(30 12% 6%)';
      ctx.fillRect(0, -4, W, H + 8);

      // Play field background
      ctx.fillStyle = 'hsl(30 10% 4%)';
      ctx.fillRect(0, 0, FIELD_W, FIELD_H);

      // Grid lines
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 0.5;
      for (let c = 0; c <= COLS; c++) {
        ctx.beginPath();
        ctx.moveTo(c * CELL, 0);
        ctx.lineTo(c * CELL, FIELD_H);
        ctx.stroke();
      }
      for (let r = 0; r <= ROWS; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * CELL);
        ctx.lineTo(FIELD_W, r * CELL);
        ctx.stroke();
      }

      // Placed blocks
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const cell = s.board[r][c];
          if (cell) {
            drawBlock(ctx, c * CELL, r * CELL, CELL, PIECE_COLORS[cell]);
          }
        }
      }

      // Ghost piece
      let ghostY = s.current.y;
      while (!collides(s.board, { ...s.current, y: ghostY + 1 })) ghostY++;
      if (ghostY !== s.current.y) {
        const shape = getShape(s.current);
        ctx.globalAlpha = 0.2;
        for (let r = 0; r < shape.length; r++) {
          for (let c = 0; c < shape[r].length; c++) {
            if (!shape[r][c]) continue;
            const bx = (s.current.x + c) * CELL;
            const by = (ghostY + r) * CELL;
            if (ghostY + r >= 0) {
              ctx.fillStyle = PIECE_COLORS[s.current.type];
              ctx.fillRect(bx + 2, by + 2, CELL - 4, CELL - 4);
            }
          }
        }
        ctx.globalAlpha = 1;
      }

      // Current piece
      const shape = getShape(s.current);
      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (!shape[r][c]) continue;
          const by = s.current.y + r;
          if (by < 0) continue;
          drawBlock(ctx, (s.current.x + c) * CELL, by * CELL, CELL, PIECE_COLORS[s.current.type]);
        }
      }

      // Sidebar
      const sx = FIELD_W + 12;
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = '8px "Press Start 2P"';
      ctx.textAlign = 'left';
      ctx.fillText('NEXT', sx, 24);

      // Next piece preview
      const nextShape = PIECE_SHAPES[s.next][0];
      const previewCell = 16;
      const previewY = 36;
      for (let r = 0; r < nextShape.length; r++) {
        for (let c = 0; c < nextShape[r].length; c++) {
          if (!nextShape[r][c]) continue;
          drawBlock(ctx, sx + c * previewCell, previewY + r * previewCell, previewCell, PIECE_COLORS[s.next]);
        }
      }

      // Stats
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '7px "Press Start 2P"';
      ctx.fillText('LEVEL', sx, 140);
      ctx.fillStyle = 'hsl(45 95% 55%)';
      ctx.font = '10px "Press Start 2P"';
      ctx.fillText(String(s.level), sx, 158);

      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '7px "Press Start 2P"';
      ctx.fillText('LINES', sx, 190);
      ctx.fillStyle = 'hsl(140 70% 45%)';
      ctx.font = '10px "Press Start 2P"';
      ctx.fillText(String(s.lines), sx, 208);

      ctx.restore();

      // Decay shake
      s.shakeY *= 0.85;
      if (Math.abs(s.shakeY) < 0.1) s.shakeY = 0;

      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('keydown', handleKey);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (dropRef.current) clearTimeout(dropRef.current);
    };
  }, [gameKey, resetGame, dropPiece, onScoreChange, isPaused, reducedMotion]);

  // Drop timer
  useEffect(() => {
    if (isPaused || stateRef.current.gameOver) {
      if (dropRef.current) clearTimeout(dropRef.current);
      return;
    }

    const scheduleDrop = () => {
      dropRef.current = setTimeout(() => {
        dropPiece();
        scheduleDrop();
      }, stateRef.current.speed);
    };
    scheduleDrop();

    return () => {
      if (dropRef.current) clearTimeout(dropRef.current);
    };
  }, [isPaused, dropPiece, gameKey]);

  return (
    <div className="flex items-center justify-center bg-background">
      <canvas
        ref={canvasRef}
        style={{ width: W, height: H, imageRendering: 'pixelated' }}
      />
    </div>
  );
}

function drawBlock(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(x + 2, y + 2, size - 4, size - 4);
  // Bevel
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.fillRect(x + 2, y + 2, size - 4, 2);
  ctx.fillRect(x + 2, y + 2, 2, size - 4);
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(x + 2, y + size - 4, size - 4, 2);
  ctx.fillRect(x + size - 4, y + 2, 2, size - 4);
}
