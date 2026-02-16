import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useAtom, useSetAtom } from 'jotai';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { themeAtom, isMenuOpenAtom, cursorVariantAtom } from '../../store/atoms';
import { cn } from '../../lib/utils';

const navItems = [
  { label: 'Home', href: '#home', level: '01', activeColor: 'text-rpg-gold' },
  { label: 'About', href: '#about', level: '02', activeColor: 'text-rpg-mp' },
  { label: 'Projects', href: '#projects', level: '03', activeColor: 'text-rpg-rare' },
  { label: 'Skills', href: '#skills', level: '04', activeColor: 'text-rpg-heal' },
  { label: 'Contact', href: '#contact', level: '05', activeColor: 'text-rpg-hp' },
];

export function Navbar() {
  const [theme, setTheme] = useAtom(themeAtom);
  const [isMenuOpen, setIsMenuOpen] = useAtom(isMenuOpenAtom);
  const setCursorVariant = useSetAtom(cursorVariantAtom);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  // Detect active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.href.slice(1));
      const scrollPosition = window.scrollY + 100;

      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('light', newTheme === 'light');
  };

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled ? 'py-3' : 'py-4'
        )}
      >
        <nav className="container mx-auto px-4">
          <div
            className={cn(
              'flex items-center justify-between px-5 py-3 transition-all duration-300',
              isScrolled ? 'pixel-panel' : 'bg-transparent'
            )}
          >
            {/* Logo — retro pixel font */}
            <motion.a
              href="#home"
              className="font-display text-pixel-xs text-primary tracking-wider"
              onMouseEnter={() => setCursorVariant('link')}
              onMouseLeave={() => setCursorVariant('default')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              XANDER.DEV
            </motion.a>

            {/* Desktop Navigation — HUD style */}
            <div className="hidden md:flex items-center gap-0">
              {navItems.map((item, index) => {
                const isActive = activeSection === item.href.slice(1);
                return (
                  <motion.button
                    key={item.label}
                    onClick={() => handleNavClick(item.href)}
                    className={cn(
                      'relative px-4 pt-2 pb-5 text-sm font-mono transition-colors',
                      isActive
                        ? item.activeColor
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                    onMouseEnter={() => setCursorVariant('link')}
                    onMouseLeave={() => setCursorVariant('default')}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="flex items-center gap-2">
                      {isActive && (
                        <motion.span
                          layoutId="navArrow"
                          className={cn('text-xs', item.activeColor)}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        >
                          ►
                        </motion.span>
                      )}
                      {item.label}
                    </span>
                    {/* Level indicator */}
                    <span className={cn(
                      'absolute bottom-1 left-1/2 -translate-x-1/2 font-display text-[7px] tracking-widest',
                      isActive ? `${item.activeColor} opacity-60` : 'text-muted-foreground/30'
                    )}>
                      LV.{item.level}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="activeSection"
                        className="absolute inset-0 bg-primary/10 border border-primary/20 -z-10"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                className="p-2 pixel-border hover:bg-secondary transition-colors"
                onClick={toggleTheme}
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: theme === 'dark' ? 0 : 180 }}
                  transition={{ duration: 0.3 }}
                >
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </motion.div>
              </button>

              {/* CTA Button - Desktop */}
              <motion.button
                onClick={() => handleNavClick('#contact')}
                className="hidden md:flex items-center gap-2 px-5 py-2 bg-rpg-hp text-white font-display text-[8px] tracking-wider hover:bg-rpg-hp/85 transition-colors"
                style={{ boxShadow: '0 0 8px hsl(var(--rpg-hp) / 0.3), 0 0 16px hsl(var(--rpg-hp) / 0.1)' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                TALK
              </motion.button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 pixel-border hover:bg-secondary transition-colors"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop — solid, no blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/90"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Content — pixel panel */}
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm pixel-panel border-l-2 border-primary/30 p-8 pt-24"
            >
              <div className="flex flex-col gap-1">
                {navItems.map((item, index) => {
                  const isActive = activeSection === item.href.slice(1);
                  return (
                    <motion.button
                      key={item.label}
                      onClick={() => handleNavClick(item.href)}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        'text-left px-4 py-3 font-mono text-lg transition-colors flex items-center gap-3',
                        isActive
                          ? `${item.activeColor} bg-primary/10 border-l-2 border-primary`
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                      )}
                    >
                      <span className="font-display text-[8px] text-muted-foreground/50">
                        {item.level}
                      </span>
                      {isActive && <span className={cn('text-sm', item.activeColor)}>►</span>}
                      {item.label}
                    </motion.button>
                  );
                })}
              </div>

              {/* Mobile CTA */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => handleNavClick('#contact')}
                className="mt-8 w-full py-3 bg-primary text-primary-foreground font-display text-pixel-xs tracking-wider glow"
              >
                START CHAT
              </motion.button>

              {/* Decorative HUD element */}
              <div className="absolute bottom-8 left-8 right-8">
                <div className="h-px bg-primary/20 mb-4" />
                <p className="font-display text-[8px] text-muted-foreground/40 text-center tracking-widest">
                  &copy; {new Date().getFullYear()} XANDER.DEV
                </p>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
