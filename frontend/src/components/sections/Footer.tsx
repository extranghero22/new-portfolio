import { motion } from 'framer-motion';
import { Linkedin, Twitter, Mail, Instagram, ArrowUp } from 'lucide-react';

const socialLinks = [
  { icon: Linkedin, href: 'https://www.linkedin.com/in/alexander-venus-338482150/', label: 'LINKEDIN', color: 'group-hover:text-rpg-mp' },
  { icon: Twitter, href: 'https://x.com/extrangxander22', label: 'TWITTER', color: 'group-hover:text-rpg-mp' },
  { icon: Instagram, href: 'https://www.instagram.com/bbaboiiiii/', label: 'INSTAGRAM', color: 'group-hover:text-rpg-rare' },
  { icon: Mail, href: 'mailto:alexandervenus22@gmail.com', label: 'EMAIL', color: 'group-hover:text-rpg-heal' },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative py-16 bg-background border-t border-primary/10" style={{ '--section-accent': 'var(--rpg-gold)' } as React.CSSProperties}>
      <div className="container mx-auto px-4">
        {/* Credits Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-pixel-xs md:text-pixel-sm text-rpg-gold/70 mb-4">
            THANKS FOR PLAYING
          </h2>
          <div className="w-32 h-px bg-rpg-gold/25 mx-auto" />
        </motion.div>

        {/* Credits */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12 space-y-3"
        >
          <p className="font-display text-[7px] text-foreground/30 tracking-widest">DESIGNED & BUILT BY</p>
          <p className="font-display text-[10px] text-foreground/60 tracking-wider">ALEXANDER VENUS</p>
          <p className="font-display text-[7px] text-foreground/20 tracking-widest">USING REACT & TAILWIND CSS</p>
        </motion.div>

        {/* Bonus Content (Social Links) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mb-10"
        >
          <p className="font-display text-[7px] text-rpg-rare/40 tracking-widest mb-4">BONUS CONTENT</p>
          <div className="flex justify-center gap-3">
            {socialLinks.map((social, index) => (
              <motion.button
                key={social.label}
                onClick={() => window.open(social.href, '_blank')}
                initial={{ opacity: 0, y: 5 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.08 }}
                whileHover={{ y: -2 }}
                className="p-3 pixel-border hover:glow transition-all duration-300 group"
              >
                <social.icon className={`w-4 h-4 text-foreground/30 ${social.color} transition-colors`} />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* THE END */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2">
            <p className="font-display text-pixel-xs text-rpg-heal/25 tracking-wider">
              THE END
            </p>
            <motion.span
              className="inline-block w-2 h-3 bg-rpg-heal/25"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="flex justify-between items-center pt-6 border-t border-primary/8">
          <span className="font-display text-[7px] text-foreground/15 tracking-widest">
            &copy; {new Date().getFullYear()} XANDER.DEV
          </span>

          <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -2 }}
            className="flex items-center gap-2 font-display text-[7px] text-foreground/20 hover:text-rpg-mp transition-colors tracking-wider"
          >
            RETURN TO TITLE
            <ArrowUp className="w-3 h-3" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
