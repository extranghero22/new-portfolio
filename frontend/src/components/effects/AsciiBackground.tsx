import { useEffect, useRef, useCallback } from 'react';

// Tighter density ramp — single blank so chars appear fast
const DENSITY = ' .·:-~+=*#%@'.split('');

// Code glyphs scattered sparingly for dev personality
const GLYPHS = '{}/()<>=&|;~'.split('');

// Layered sine noise producing organic terrain
function terrain(c: number, r: number, t: number): number {
  let v = 0;
  v += Math.sin(c * 0.03 + t * 0.35) * Math.cos(r * 0.035 + t * 0.25);
  v += Math.sin((c + r) * 0.02 + t * 0.2) * 0.8;
  v += Math.sin(Math.sqrt(c * c + r * r) * 0.025 - t * 0.4) * 0.6;
  v += Math.sin(c * 0.06 + t * 0.65) * Math.sin(r * 0.07 - t * 0.3) * 0.4;
  v += Math.cos(c * 0.045 - r * 0.04 + t * 0.3) * 0.35;

  // Normalize to [0,1]
  const raw = (v + 3.15) / 6.3;

  // S-curve contrast — carves sharp ridgelines from flat valleys
  const s = Math.max(0, Math.min(1, raw));
  return s * s * (3 - 2 * s);
}

export function AsciiBackground({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | null>(null);
  const tRef = useRef(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  const CELL = 14;
  const FONT_SIZE = 12;

  const paint = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.clearRect(0, 0, w, h);

    const cols = Math.ceil(w / CELL) + 1;
    const rows = Math.ceil(h / CELL) + 1;
    const t = tRef.current;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    ctx.font = `${FONT_SIZE}px 'JetBrains Mono', monospace`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const px = c * CELL + CELL * 0.5;
        const py = r * CELL + CELL * 0.5;

        let n = terrain(c, r, t);

        // Mouse ripple — expanding concentric rings
        const dx = px - mx;
        const dy = py - my;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 180) {
          const nd = d / 180;
          n = Math.max(0, Math.min(1, n + Math.sin(nd * Math.PI * 5 - t * 4) * (1 - nd) * 0.5));
        }

        // Map noise → character
        const ci = Math.floor(n * (DENSITY.length - 1));
        let ch = DENSITY[ci];

        // Skip blanks
        if (ch === ' ') continue;

        // Swap in code glyphs ~2% of visible cells
        if (ci > 2 && Math.random() < 0.02) {
          ch = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }

        // Color: sparse → dim brown, dense → hot amber gold
        const hue = 30 + n * 12;
        const sat = 40 + n * 50;
        const lum = 32 + n * 32;
        const alpha = 0.15 + n * 0.45;

        // Glitch flash — rare bright amber flicker
        if (Math.random() < 0.001) {
          ctx.fillStyle = `hsla(38, 90%, 65%, ${Math.min(0.9, alpha + 0.35)})`;
        } else {
          ctx.fillStyle = `hsla(${hue}, ${sat}%, ${lum}%, ${alpha})`;
        }

        ctx.fillText(ch, px, py);
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouse);

    if (reduced) {
      const rect = canvas.getBoundingClientRect();
      paint(ctx, rect.width, rect.height);
    } else {
      let prev = 0;
      const step = 1000 / 18;

      const tick = (ts: number) => {
        if (ts - prev >= step) {
          prev = ts;
          tRef.current += 0.014;
          const rect = canvas.getBoundingClientRect();
          paint(ctx, rect.width, rect.height);
        }
        frameRef.current = requestAnimationFrame(tick);
      };

      frameRef.current = requestAnimationFrame(tick);
    }

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [paint]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{
        pointerEvents: 'none',
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 90%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 90%, transparent 100%)',
      }}
    />
  );
}
