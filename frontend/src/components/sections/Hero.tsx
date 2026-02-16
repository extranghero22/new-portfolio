import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';

// Classic space invader pixel sprites (each row is a binary row of pixels)
const INVADER_SPRITES = [
  // Crab
  [
    [0,0,1,0,0,0,0,0,1,0,0],
    [0,0,0,1,0,0,0,1,0,0,0],
    [0,0,1,1,1,1,1,1,1,0,0],
    [0,1,1,0,1,1,1,0,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,1],
    [1,0,1,1,1,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,1,0,1],
    [0,0,0,1,1,0,1,1,0,0,0],
  ],
  // Squid
  [
    [0,0,0,0,1,1,0,0,0,0,0],
    [0,0,0,1,1,1,1,0,0,0,0],
    [0,0,1,1,1,1,1,1,0,0,0],
    [0,1,1,0,1,1,0,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,0,0],
    [0,0,0,1,0,0,1,0,0,0,0],
    [0,0,1,0,1,1,0,1,0,0,0],
    [0,1,0,1,0,0,1,0,1,0,0],
  ],
  // Octopus
  [
    [0,0,0,1,1,1,1,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,0,0],
    [1,1,1,1,1,1,1,1,1,1,0],
    [1,1,1,0,0,1,0,0,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,0],
    [0,0,1,1,0,0,1,1,0,0,0],
    [0,1,1,0,1,1,0,1,1,0,0],
    [1,1,0,0,0,0,0,0,1,1,0],
  ],
];

// Player ship sprite
const SHIP_SPRITE = [
  [0,0,0,0,0,1,0,0,0,0,0],
  [0,0,0,0,1,1,1,0,0,0,0],
  [0,0,0,0,1,1,1,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,0],
  [1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1],
];

function SpaceInvadersCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const px = 4;
    const invW = 11 * px;
    const invH = 8 * px;
    const gapX = 22;
    const gapY = 64;
    const cols = 11;
    const rows = 5;
    const stepDown = 8;
    let dir = 1;
    let offX = 0;
    let offY = 0;
    const speed = 0.3;

    // Bullets: enemy go down, player go up
    const enemyBullets: { x: number; y: number }[] = [];
    const playerBullets: { x: number; y: number }[] = [];

    // Player ship state
    const shipW = 11 * px;
    const shipH = 6 * px;
    let shipX = 0;
    let shipDir = 1;
    const shipSpeed = 0.7;
    let shootTimer = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      shipX = canvas.width / 2 - shipW / 2;
    };
    resize();
    window.addEventListener('resize', resize);

    const formationW = cols * (invW + gapX) - gapX;

    const drawSprite = (sprite: number[][], x: number, y: number) => {
      for (let r = 0; r < sprite.length; r++) {
        for (let c = 0; c < sprite[r].length; c++) {
          if (sprite[r][c]) {
            ctx.fillRect(x + c * px, y + r * px, px, px);
          }
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cw = canvas.width;
      const ch = canvas.height;
      const maxOff = cw - formationW - 40;

      // -- Invader formation (each row a different RPG color like the original) --
      const formationH = rows * (invH + gapY) - gapY;
      const rowColors = [
        'rgba(239, 68, 68, 0.14)',   // red (HP)
        'rgba(168, 85, 247, 0.14)',  // purple (rare)
        'rgba(34, 211, 238, 0.14)',  // cyan (MP)
        'rgba(74, 222, 128, 0.14)', // green (heal)
        'rgba(250, 204, 21, 0.14)', // gold
      ];
      for (let r = 0; r < rows; r++) {
        const sprite = INVADER_SPRITES[r % INVADER_SPRITES.length];
        ctx.fillStyle = rowColors[r % rowColors.length];
        for (let c = 0; c < cols; c++) {
          const x = 20 + offX + c * (invW + gapX);
          const y = 30 + offY + r * (invH + gapY);
          if (y > -invH && y < ch) {
            drawSprite(sprite, x, y);
          }
        }
      }

      // Move formation
      offX += speed * dir;
      if (offX > maxOff || offX < 0) {
        dir *= -1;
        offY += stepDown;
      }
      // Reset when the formation scrolls off the bottom
      if (offY > ch - formationH * 0.3) {
        offY = -formationH;
        offX = Math.random() * Math.max(0, maxOff * 0.5);
      }

      // -- Enemy bullets (downward) --
      ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
      for (let i = enemyBullets.length - 1; i >= 0; i--) {
        const b = enemyBullets[i];
        ctx.fillRect(b.x, b.y, 2, 6);
        b.y += 1.5;
        if (b.y > ch) enemyBullets.splice(i, 1);
      }
      // Random enemy shooting
      if (Math.random() < 0.02) {
        const sc = Math.floor(Math.random() * cols);
        const bx = 20 + offX + sc * (invW + gapX) + invW / 2;
        const by = 60 + offY + (rows - 1) * (invH + gapY) + invH;
        if (by > 0 && by < ch) enemyBullets.push({ x: bx, y: by });
      }

      // -- Player ship (green) --
      const shipY = ch - shipH - 90;
      ctx.fillStyle = 'rgba(74, 222, 128, 0.18)';
      drawSprite(SHIP_SPRITE, shipX, shipY);

      // Move ship back and forth
      shipX += shipSpeed * shipDir;
      if (shipX > cw - shipW - 20) shipDir = -1;
      if (shipX < 20) shipDir = 1;

      // -- Player bullets (upward, cyan) --
      ctx.fillStyle = 'rgba(34, 211, 238, 0.3)';
      for (let i = playerBullets.length - 1; i >= 0; i--) {
        const b = playerBullets[i];
        ctx.fillRect(b.x, b.y, 2, 8);
        b.y -= 2;
        if (b.y < 0) playerBullets.splice(i, 1);
      }
      // Ship shoots periodically
      shootTimer++;
      if (shootTimer > 80) {
        shootTimer = 0;
        playerBullets.push({ x: shipX + shipW / 2, y: shipY });
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

function TypewriterCycle({
  texts,
  delay = 0,
  typeSpeed = 60,
  eraseSpeed = 30,
  pauseTime = 2000,
  className = '',
}: {
  texts: string[];
  delay?: number;
  typeSpeed?: number;
  eraseSpeed?: number;
  pauseTime?: number;
  className?: string;
}) {
  const [textIndex, setTextIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState<'waiting' | 'typing' | 'paused' | 'erasing'>('waiting');

  const currentText = texts[textIndex];

  // Initial delay
  useEffect(() => {
    const timer = setTimeout(() => setPhase('typing'), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (phase === 'typing') {
      if (displayed.length < currentText.length) {
        const timer = setTimeout(() => {
          setDisplayed(currentText.slice(0, displayed.length + 1));
        }, typeSpeed);
        return () => clearTimeout(timer);
      }
      // Done typing — pause before erasing
      const timer = setTimeout(() => setPhase('erasing'), pauseTime);
      return () => clearTimeout(timer);
    }

    if (phase === 'erasing') {
      if (displayed.length > 0) {
        const timer = setTimeout(() => {
          setDisplayed(displayed.slice(0, -1));
        }, eraseSpeed);
        return () => clearTimeout(timer);
      }
      // Done erasing — move to next text
      setTextIndex((prev) => (prev + 1) % texts.length);
      setPhase('typing');
    }
  }, [phase, displayed, currentText, typeSpeed, eraseSpeed, pauseTime, texts.length]);

  return (
    <div className={className}>
      <span>{displayed}</span>
      <motion.span
        className="inline-block w-[0.6em] h-[1.1em] bg-foreground/50 ml-0.5 align-middle"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity }}
      />
    </div>
  );
}

const MENU_COLORS: Record<string, { active: string; arrow: string }> = {
  'NEW GAME': { active: 'text-rpg-heal', arrow: 'hsl(var(--rpg-heal))' },
  'CONTINUE': { active: 'text-rpg-mp', arrow: 'hsl(var(--rpg-mp))' },
  'OPTIONS': { active: 'text-rpg-gold', arrow: 'hsl(var(--rpg-gold))' },
};

function MenuItem({
  label,
  onSelect,
  isSelected,
  delay,
}: {
  label: string;
  onSelect: () => void;
  isSelected: boolean;
  delay: number;
}) {
  const colors = MENU_COLORS[label] || { active: 'text-primary', arrow: 'hsl(var(--primary))' };
  return (
    <motion.button
      onClick={onSelect}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`relative flex items-center gap-3 px-6 py-3 font-display text-[10px] md:text-[12px] tracking-wider transition-colors duration-150 ${
        isSelected
          ? colors.active
          : 'text-foreground/50 hover:text-foreground/80'
      }`}
    >
      {/* Cursor arrow */}
      <motion.span
        className="inline-block w-0 h-0"
        style={{
          borderLeft: '8px solid',
          borderTop: '5px solid transparent',
          borderBottom: '5px solid transparent',
          borderLeftColor: isSelected ? colors.arrow : 'transparent',
        }}
        animate={isSelected ? { x: [0, 4, 0] } : {}}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
      {label}
    </motion.button>
  );
}

export function Hero() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);

  const menuItems = useMemo(() => [
    { label: 'NEW GAME', target: '#projects' },
    { label: 'CONTINUE', target: '#about' },
    { label: 'OPTIONS', target: '#contact' },
  ], []);

  // Show menu after title animation
  useEffect(() => {
    const timer = setTimeout(() => setShowMenu(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!showMenu) return;
    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => (prev + 1) % menuItems.length);
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => (prev - 1 + menuItems.length) % menuItems.length);
    } else if (e.key === 'Enter') {
      const target = menuItems[selectedIndex].target;
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showMenu, selectedIndex, menuItems]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    const target = menuItems[index].target;
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background"
    >
      {/* Space Invaders background */}
      <SpaceInvadersCanvas />

      {/* Subtle grid floor */}
      <div
        className="absolute inset-x-0 bottom-0 h-[40vh] perspective-grid opacity-15"
        style={{
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'center bottom',
          maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4"
        >
          <h1 className="font-display text-pixel-lg md:text-pixel-xl lg:text-pixel-2xl title-glow">
            XANDER.DEV
          </h1>
        </motion.div>

        {/* Subtitle — cycling typewriter */}
        <TypewriterCycle
          texts={[
            'FULL-STACK SOFTWARE ENGINEER',
            'FRONTEND ARCHITECT',
            'GOLANG BACKEND MAGE',
            'BUG SQUASHER',
            'TEAM LEAD',
            'AI-ASSISTED CODER',
          ]}
          delay={0.8}
          className="mb-16 font-display text-[8px] md:text-[10px] text-foreground/50 tracking-[0.3em]"
        />

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="w-48 h-px bg-gradient-to-r from-rpg-hp/30 via-rpg-gold/30 to-rpg-mp/30 mb-12"
        />

        {/* RPG Menu */}
        {showMenu && (
          <div className="flex flex-col items-start">
            {menuItems.map((item, index) => (
              <MenuItem
                key={item.label}
                label={item.label}
                isSelected={selectedIndex === index}
                onSelect={() => handleSelect(index)}
                delay={index * 0.15}
              />
            ))}
          </div>
        )}

        {/* Press Start */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="mt-20"
        >
          <motion.p
            className="font-display text-[8px] text-rpg-mp tracking-[0.2em]"
            animate={{ opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            PRESS START
          </motion.p>
        </motion.div>
      </div>

      {/* HUD Corners */}
      <div className="absolute top-20 left-6 hidden lg:flex items-center gap-2 font-display text-[7px] tracking-widest">
        <span className="text-rpg-heal/40">P1</span>
        <div className="w-8 h-px bg-rpg-heal/20" />
      </div>
      <div className="absolute top-20 right-6 hidden lg:flex items-center gap-2 font-display text-[7px] tracking-widest">
        <span className="text-rpg-gold/40">HI-SCORE</span>
        <div className="w-8 h-px bg-rpg-gold/20" />
        <span className="text-rpg-gold/50">99999</span>
      </div>

      {/* Bottom copyright */}
      <div className="absolute bottom-6 font-display text-[7px] text-foreground/20 tracking-widest">
        &copy; {new Date().getFullYear()} XANDER.DEV
      </div>
    </section>
  );
}
