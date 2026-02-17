import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';

// Pixel cat sprite palette: 0=transparent, 1=body, 2=eyes, 3=nose, 4=belly, 5=inner ear
const CAT_PALETTE: (string | null)[] = [
  null,
  '#D97706',  // 1 body (amber)
  '#1C1917',  // 2 eyes (near-black)
  '#FB7185',  // 3 nose (pink)
  '#FCD34D',  // 4 belly (light amber)
  '#B45309',  // 5 inner ear (dark amber)
];

const CAT_FRAMES = [
  // Frame 0: idle, tail right, eyes open
  [
    [0,0,0,1,0,0,0,0,0,1,0,0,0],
    [0,0,1,5,1,0,0,0,1,5,1,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,2,2,1,1,1,1,2,2,1,1,0],
    [0,1,1,1,1,3,1,3,1,1,1,1,0],
    [0,0,1,1,1,1,3,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,0,0],
    [0,1,1,4,4,4,4,4,4,4,1,1,0],
    [0,1,1,4,4,4,4,4,4,4,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,0,0,0,0,0,0,0,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,1,1],
  ],
  // Frame 1: tail left, eyes open
  [
    [0,0,0,1,0,0,0,0,0,1,0,0,0],
    [0,0,1,5,1,0,0,0,1,5,1,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,2,2,1,1,1,1,2,2,1,1,0],
    [0,1,1,1,1,3,1,3,1,1,1,1,0],
    [0,0,1,1,1,1,3,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,0,0],
    [0,1,1,4,4,4,4,4,4,4,1,1,0],
    [0,1,1,4,4,4,4,4,4,4,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,0,0,0,0,0,0,0,1,1,0],
    [1,1,0,0,0,0,0,0,0,0,0,0,0],
  ],
  // Frame 2: blink, tail right
  [
    [0,0,0,1,0,0,0,0,0,1,0,0,0],
    [0,0,1,5,1,0,0,0,1,5,1,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,2,1,1,1,1,1,2,1,1,0],
    [0,1,1,1,1,3,1,3,1,1,1,1,0],
    [0,0,1,1,1,1,3,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,0,0],
    [0,1,1,4,4,4,4,4,4,4,1,1,0],
    [0,1,1,4,4,4,4,4,4,4,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,0,0,0,0,0,0,0,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,1,1],
  ],
];

// Sequence: mostly idle, periodic tail wag + blink
const FRAME_SEQUENCE = [0,0,0,0,0,1,1,0,0,0,0,2,0,0,1,1,0,0,0,0,0,0,2,0];

function PixelCat() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const px = 5;
    const cols = 13;
    const rows = 13;
    canvas.width = cols * px;
    canvas.height = rows * px;

    const drawFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const seqIdx = FRAME_SEQUENCE[frameRef.current % FRAME_SEQUENCE.length];
      const frame = CAT_FRAMES[seqIdx];

      for (let r = 0; r < frame.length; r++) {
        for (let c = 0; c < frame[r].length; c++) {
          const color = CAT_PALETTE[frame[r][c]];
          if (color) {
            ctx.fillStyle = color;
            ctx.fillRect(c * px, r * px, px, px);
          }
        }
      }
    };

    drawFrame();
    const interval = setInterval(() => {
      frameRef.current++;
      drawFrame();
    }, 350);

    return () => clearInterval(interval);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="mx-auto mt-3"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}

const TOTAL_SEGMENTS = 16;

function StatBar({
  label,
  value,
  max,
  colorClass,
  delay,
}: {
  label: string;
  value: number;
  max: number;
  colorClass: string;
  delay: number;
}) {
  const { ref, isInView } = useInView({ threshold: 0.5, triggerOnce: true });
  const filled = Math.round((value / max) * TOTAL_SEGMENTS);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -10 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay }}
    >
      <div className="flex items-center gap-3 mb-1">
        <span className="font-display text-[9px] tracking-wider text-foreground/60 w-8">{label}</span>
        <div className={`rpg-bar flex-1 ${colorClass}`}>
          {Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={isInView ? { opacity: 1, scaleY: 1 } : {}}
              transition={{ duration: 0.08, delay: delay + 0.1 + i * 0.03 }}
              className={`rpg-bar-segment ${i < filled ? 'filled' : 'empty'}`}
            />
          ))}
        </div>
        <span className="font-display text-[9px] text-foreground/40 w-16 text-right whitespace-nowrap">
          {value}/{max}
        </span>
      </div>
    </motion.div>
  );
}

const characterStats = [
  { label: 'STR', value: 95, description: 'React Mastery' },
  { label: 'DEF', value: 92, description: 'Golang Power' },
  { label: 'INT', value: 88, description: 'TypeScript' },
  { label: 'AGI', value: 90, description: 'Fast Learner' },
  { label: 'LCK', value: 75, description: 'Bug Finding' },
  { label: 'VIT', value: 85, description: 'Team Leading' },
];

const achievements = [
  { icon: '★', name: 'TEAM LEAD', color: 'text-rpg-gold', bg: 'bg-rpg-gold/10 border-rpg-gold/25' },
  { icon: '⚔', name: 'SHIP IT', color: 'text-rpg-heal', bg: 'bg-rpg-heal/10 border-rpg-heal/25' },
  { icon: '✦', name: 'BUG SLAYER', color: 'text-rpg-hp', bg: 'bg-rpg-hp/10 border-rpg-hp/25' },
  { icon: '◆', name: 'POLYGLOT', color: 'text-rpg-rare', bg: 'bg-rpg-rare/10 border-rpg-rare/25' },
  { icon: '▲', name: 'FULL CLEAR', color: 'text-rpg-mp', bg: 'bg-rpg-mp/10 border-rpg-mp/25' },
  { icon: '●', name: '4YR VETERAN', color: 'text-rpg-xp', bg: 'bg-rpg-xp/10 border-rpg-xp/25' },
];

const equipment = [
  { slot: 'WEAPON', item: 'React', detail: 'ATK +98' },
  { slot: 'ARMOR', item: 'Golang', detail: 'DEF +95' },
  { slot: 'SHIELD', item: 'TypeScript', detail: 'VIT +92' },
  { slot: 'HELM', item: 'Redux Saga', detail: 'AGI +92' },
  { slot: 'RELIC', item: 'PostgreSQL', detail: 'INT +80' },
];

export function About() {
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden bg-background"
      style={{ '--section-accent': 'var(--rpg-mp)' } as React.CSSProperties}
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="font-display text-[10px] text-rpg-mp/50 tracking-widest">02</span>
          <div className="w-8 h-px bg-rpg-mp/20" />
          <span className="font-display text-[10px] text-foreground/40 tracking-widest">CHARACTER STATUS</span>
        </div>
      </motion.div>

      <div className="container mx-auto px-4">
        {/* Main two-column layout */}
        <div className="grid lg:grid-cols-[320px_1fr] gap-8">
          {/* Left Panel — Character Portrait + Identity */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="pixel-panel p-6">
              {/* Portrait */}
              <div className="aspect-square bg-card border-2 border-rpg-mp/20 flex items-center justify-center mb-2 relative overflow-hidden">
                <img src="/images/profilepic.jpg" alt="Alexander Venus" className="w-full h-full object-cover" />
              </div>

              {/* Pixel pet companion */}
              <PixelCat />

              {/* Name plate */}
              <div className="text-center mb-4">
                <h2 className="font-display text-pixel-sm text-rpg-mp mb-1">XANDER</h2>
                <p className="font-display text-[9px] text-rpg-mp tracking-wider">FULL-STACK BATTLEMAGE</p>
              </div>

              {/* Level */}
              <div className="flex justify-between items-center px-2 py-2 border-t border-b border-rpg-mp/15">
                <span className="font-display text-[9px] text-foreground/50">LEVEL</span>
                <span className="font-display text-[12px] text-rpg-gold">26</span>
              </div>

              {/* HP / MP / EXP bars */}
              <div className="mt-4 space-y-2">
                <StatBar label="HP" value={950} max={999} colorClass="rpg-bar-hp" delay={0.3} />
                <StatBar label="MP" value={420} max={500} colorClass="rpg-bar-mp" delay={0.4} />
                <StatBar label="EXP" value={7800} max={10000} colorClass="rpg-bar-xp" delay={0.5} />
              </div>

              {/* Achievements */}
              <div className="mt-5 pt-4 border-t border-rpg-mp/15">
                <span className="font-display text-[9px] text-foreground/40 tracking-widest block mb-3">
                  ACHIEVEMENTS
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {achievements.map((a, i) => (
                    <motion.div
                      key={a.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.6 + i * 0.08 }}
                      className={`flex items-center gap-1.5 px-2 py-1.5 border ${a.bg}`}
                    >
                      <span className={`${a.color} text-[12px]`}>{a.icon}</span>
                      <span className={`font-display text-[8px] ${a.color} tracking-wider`}>{a.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Panel — Stats + Equipment + Bio */}
          <div className="space-y-6">
            {/* Stat Grid */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="pixel-panel p-5">
                <h3 className="font-display text-[10px] text-foreground/50 tracking-widest mb-4 pb-2 border-b border-rpg-mp/15">
                  ATTRIBUTES
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {characterStats.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.4 + i * 0.08 }}
                      className="text-center p-3 border border-rpg-mp/10 hover:border-rpg-mp/30 transition-colors"
                    >
                      <span className="font-display text-[9px] text-foreground/40 tracking-wider block mb-1">
                        {stat.label}
                      </span>
                      <span className="font-display text-pixel-sm text-rpg-mp block mb-1">
                        {stat.value}
                      </span>
                      <span className="text-[13px] text-foreground/30">
                        {stat.description}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Bio + Equipment side by side */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Character Background */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="pixel-panel p-5 h-full">
                  <h3 className="font-display text-[10px] text-foreground/50 tracking-widest mb-4 pb-2 border-b border-rpg-mp/15">
                    CHARACTER BACKGROUND
                  </h3>
                  <p className="text-foreground/70 leading-relaxed text-base inline">
                    Full Stack Developer from the Philippines with a passion for building software that
                    actually works. React and Golang are my main weapons — I've led teams, shipped
                    platforms from scratch, and turned complex requirements into clean code. Quick
                    learner who thrives under pressure. When I'm not coding, you'll find me gaming
                    Wuthering Waves, riding motorcycles, or exploring Southeast Asia.
                  </p>
                  <motion.span
                    className="inline-block w-2.5 h-4 bg-rpg-mp/60 ml-1 align-middle"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  />
                </div>
              </motion.div>

              {/* Equipment */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="pixel-panel p-5 h-full">
                  <h3 className="font-display text-[10px] text-foreground/50 tracking-widest mb-4 pb-2 border-b border-rpg-mp/15">
                    EQUIPMENT
                  </h3>
                  <div className="space-y-2">
                    {equipment.map((item, i) => (
                      <motion.div
                        key={item.slot}
                        initial={{ opacity: 0, x: 10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.7 + i * 0.08 }}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-rpg-mp/5 transition-colors"
                      >
                        <span className="font-display text-[10px] text-foreground/30 w-16 tracking-wider">
                          {item.slot}
                        </span>
                        <span className="text-base text-foreground/80 flex-1">
                          {item.item}
                        </span>
                        <span className="font-display text-[10px] text-rpg-heal tracking-wider">
                          {item.detail}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
