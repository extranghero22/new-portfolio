import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '../../hooks/useInView';
import { skillCategories, experiences, type SkillCategory } from '../../data/skills';

const TOTAL_SEGMENTS = 20;

const categoryColorMap: Record<string, string> = {
  languages: 'rpg-bar-hp',
  backend: 'rpg-bar-mp',
  infrastructure: 'rpg-bar-heal',
  databases: 'rpg-bar-rare',
};

const categoryLabelMap: Record<string, string> = {
  languages: 'WEAPONS',
  backend: 'MAGIC',
  infrastructure: 'SCROLLS',
  databases: 'RELICS',
};

function SkillBar({ name, level, delay, colorClass }: { name: string; level: number; delay: number; colorClass: string }) {
  const { ref, isInView } = useInView({ threshold: 0.5, triggerOnce: true });
  const filledSegments = Math.round((level / 100) * TOTAL_SEGMENTS);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -10 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay }}
      className="flex items-center gap-3 px-3 py-1.5 hover:bg-primary/5 transition-colors"
    >
      <span className="font-display text-[7px] tracking-wider text-foreground/60 w-24 truncate">{name}</span>
      <div className={`rpg-bar flex-1 ${colorClass}`}>
        {Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={isInView ? { opacity: 1, scaleY: 1 } : {}}
            transition={{ duration: 0.08, delay: delay + 0.1 + i * 0.02 }}
            className={`rpg-bar-segment ${i < filledSegments ? 'filled' : 'empty'}`}
          />
        ))}
      </div>
      <span className="font-display text-[7px] text-foreground/40 w-8 text-right">{level}</span>
    </motion.div>
  );
}

function SkillCategory({ category, index }: { category: SkillCategory; index: number }) {
  const colorClass = categoryColorMap[category.id] || 'rpg-bar-gold';
  const label = categoryLabelMap[category.id] || category.title.toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="pixel-panel p-4"
    >
      <h3 className="font-display text-[8px] text-foreground/50 tracking-widest mb-3 pb-2 border-b border-rpg-heal/15">
        {label}
      </h3>
      <div className="space-y-1">
        {category.skills.map((skill, i) => (
          <SkillBar
            key={skill.name}
            name={skill.name}
            level={skill.level}
            delay={i * 0.04}
            colorClass={colorClass}
          />
        ))}
      </div>
    </motion.div>
  );
}

function BattleLogEntry({
  experience,
  index,
}: {
  experience: typeof experiences[0];
  index: number;
}) {
  const { ref, isInView } = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15 }}
      className="rpg-dialog mb-3"
    >
      <div className="space-y-1">
        <p className="text-rpg-gold text-[13px]">
          XANDER joined <span className="text-rpg-heal">{experience.company}</span> as {experience.role}!
        </p>
        <p className="text-foreground/40 text-[12px]">{experience.period}</p>
        <p className="text-foreground/50 text-[13px] mt-1">{experience.description}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {experience.technologies.map((tech) => (
            <span
              key={tech}
              className="text-rpg-heal font-display text-[6px] tracking-wider"
            >
              +{tech}
            </span>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t border-rpg-heal/10">
          {experience.achievements.map((ach, i) => (
            <p key={i} className="text-rpg-xp text-[12px]">
              ★ {ach}
            </p>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function Skills() {
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.1, triggerOnce: true });
  const [activeTab, setActiveTab] = useState<'skills' | 'experience'>('skills');

  return (
    <section id="skills" className="relative py-24 md:py-32 overflow-hidden bg-background" style={{ '--section-accent': 'var(--rpg-heal)' } as React.CSSProperties}>
      {/* Section Header */}
      <motion.div
        ref={sectionRef}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="font-display text-[8px] text-rpg-heal/50 tracking-widest">04</span>
          <div className="w-8 h-px bg-rpg-heal/20" />
          <span className="font-display text-[8px] text-foreground/40 tracking-widest">INVENTORY</span>
        </div>
      </motion.div>

      <div className="container mx-auto px-4">
        {/* Tab Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex gap-1 mb-8"
        >
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-5 py-2 font-display text-[8px] tracking-wider transition-colors ${
              activeTab === 'skills'
                ? 'bg-rpg-heal/15 text-rpg-heal border-b-2 border-rpg-heal'
                : 'text-foreground/40 hover:text-foreground/60 border-b-2 border-transparent'
            }`}
          >
            EQUIPMENT
          </button>
          <button
            onClick={() => setActiveTab('experience')}
            className={`px-5 py-2 font-display text-[8px] tracking-wider transition-colors ${
              activeTab === 'experience'
                ? 'bg-rpg-heal/15 text-rpg-heal border-b-2 border-rpg-heal'
                : 'text-foreground/40 hover:text-foreground/60 border-b-2 border-transparent'
            }`}
          >
            BATTLE LOG
          </button>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'skills' ? (
            <motion.div
              key="skills"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {skillCategories.map((category, index) => (
                <SkillCategory key={category.id} category={category} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="experience"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              <div className="mb-4">
                <span className="font-display text-[7px] text-foreground/30 tracking-widest">
                  ADVENTURE LOG — {experiences.length} ENTRIES
                </span>
              </div>
              {experiences.map((experience, index) => (
                <BattleLogEntry key={experience.id} experience={experience} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
