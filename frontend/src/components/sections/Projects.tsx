import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { projects, type Project } from '../../data/projects';
import { useInView } from '../../hooks/useInView';

function getQuestStatus(project: Project) {
  if (project.featured) return { label: 'LEGENDARY', color: 'text-rpg-rare', bg: 'bg-rpg-rare/15 border-rpg-rare/30' };
  if (project.year >= '2023') return { label: 'ACTIVE', color: 'text-rpg-gold', bg: 'bg-rpg-gold/15 border-rpg-gold/30' };
  return { label: 'COMPLETE', color: 'text-rpg-heal', bg: 'bg-rpg-heal/15 border-rpg-heal/30' };
}

function QuestListItem({
  project,
  isSelected,
  onSelect,
  index,
}: {
  project: Project;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}) {
  const status = getQuestStatus(project);

  return (
    <motion.button
      onClick={onSelect}
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className={`w-full text-left px-4 py-3 transition-colors duration-150 border-b border-rpg-rare/8 ${
        isSelected
          ? 'bg-rpg-rare/10 border-l-2 border-l-rpg-rare'
          : 'hover:bg-rpg-rare/5 border-l-2 border-l-transparent'
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        {/* Cursor arrow */}
        {isSelected && (
          <motion.span
            className="text-rpg-rare font-display text-[8px]"
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            ►
          </motion.span>
        )}
        <span className={`font-display text-[8px] tracking-wider ${isSelected ? 'text-rpg-rare' : 'text-foreground/70'}`}>
          {project.title.toUpperCase()}
        </span>
      </div>
      <div className="flex items-center gap-2 pl-4">
        <span className={`font-display text-[6px] px-2 py-0.5 border ${status.bg} ${status.color} tracking-wider`}>
          {status.label}
        </span>
        <span className="text-[11px] text-foreground/30 truncate">{project.description.slice(0, 40)}...</span>
      </div>
    </motion.button>
  );
}

function QuestDetail({ project }: { project: Project }) {
  const status = getQuestStatus(project);

  return (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="h-full overflow-y-auto"
    >
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <span className={`font-display text-[7px] px-2 py-0.5 border ${status.bg} ${status.color} tracking-wider`}>
            {status.label}
          </span>
          <span className="font-display text-[7px] text-foreground/30 tracking-wider">{project.year}</span>
        </div>
        <h3 className="font-display text-pixel-xs md:text-pixel-sm text-rpg-rare mb-1">
          {project.title.toUpperCase()}
        </h3>
        <p className="text-[12px] text-foreground/40 font-display tracking-wider">{project.role}</p>
      </div>

      {/* Image + Info side by side */}
      <div className="grid md:grid-cols-[1fr_1fr] gap-4 mb-4">
        {/* Project Image */}
        <div className="border-2 border-rpg-rare/20 overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover pixelate"
          />
        </div>

        {/* Description + Rewards */}
        <div className="flex flex-col gap-3">
          {/* Description as RPG dialog */}
          <div className="rpg-dialog flex-1">
            <p className="text-foreground/70 text-[13px] leading-relaxed">
              {project.longDescription}
            </p>
          </div>

          {/* Rewards (tech tags) */}
          <div>
            <h4 className="font-display text-[7px] text-foreground/40 tracking-widest mb-2">REWARDS</h4>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 border border-rpg-gold/30 bg-rpg-gold/10 text-rpg-gold font-display text-[7px] tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats + Actions row */}
      <div className="flex items-end gap-4">
        {/* Metrics */}
        {project.metrics && (
          <div className="flex-1">
            <h4 className="font-display text-[7px] text-foreground/40 tracking-widest mb-2">STATS</h4>
            <div className="flex gap-2">
              {project.metrics.map((metric) => (
                <div key={metric.label} className="text-center px-3 py-1.5 border border-rpg-rare/10">
                  <span className="font-display text-[9px] text-rpg-rare block">{metric.value}</span>
                  <span className="text-[9px] text-foreground/30">{metric.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          {project.link && (
            <motion.button
              onClick={() => window.open(project.link, '_blank')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2 bg-rpg-rare text-white font-display text-[8px] tracking-wider"
              style={{ boxShadow: '0 0 8px hsl(var(--rpg-rare) / 0.3)' }}
            >
              <ExternalLink className="w-3 h-3" />
              VIEW QUEST
            </motion.button>
          )}
          {project.github && (
            <motion.button
              onClick={() => window.open(project.github, '_blank')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2 pixel-border font-display text-[8px] tracking-wider text-foreground/70 hover:text-rpg-rare transition-colors"
            >
              <Github className="w-3 h-3" />
              SOURCE
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function Projects() {
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id);
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.1, triggerOnce: true });

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  return (
    <section id="projects" className="relative py-24 md:py-32 overflow-hidden bg-background" style={{ '--section-accent': 'var(--rpg-rare)' } as React.CSSProperties}>
      {/* Section Header */}
      <motion.div
        ref={sectionRef}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="font-display text-[8px] text-rpg-rare/50 tracking-widest">03</span>
          <div className="w-8 h-px bg-rpg-rare/20" />
          <span className="font-display text-[8px] text-foreground/40 tracking-widest">QUEST LOG</span>
        </div>
      </motion.div>

      <div className="container mx-auto px-4">
        {/* Two-panel layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="grid lg:grid-cols-[280px_1fr] gap-0 pixel-panel overflow-hidden h-[700px]"
        >
          {/* Left: Quest List */}
          <div className="border-r border-rpg-rare/15 h-full overflow-y-auto">
            <div className="px-4 py-3 border-b border-rpg-rare/15 bg-rpg-rare/5">
              <span className="font-display text-[7px] text-foreground/40 tracking-widest">
                QUESTS — {projects.length}
              </span>
            </div>
            {projects.map((project, index) => (
              <QuestListItem
                key={project.id}
                project={project}
                isSelected={selectedProject?.id === project.id}
                onSelect={() => setSelectedProjectId(project.id)}
                index={index}
              />
            ))}
          </div>

          {/* Right: Quest Detail */}
          <div className="p-6 h-full overflow-y-auto">
            <AnimatePresence mode="wait">
              {selectedProject && (
                <QuestDetail key={selectedProject.id} project={selectedProject} />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
