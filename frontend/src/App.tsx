import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider as JotaiProvider, useAtomValue } from 'jotai';
import { motion, AnimatePresence } from 'framer-motion';

// Layout Components
import { Navbar, LoadingScreen } from './components/layout';

// Section Components
import { Hero, About, Projects, Skills, Contact, Footer } from './components/sections';

// Effects Components
import { CustomCursor, ScrollProgress, GradientBackground, KonamiToast } from './components/effects';

// Store
import { isLoadingAtom } from './store/atoms';

// Tooltip Provider
import { TooltipProvider } from './components/ui/tooltip';

function PortfolioContent() {
  const isLoading = useAtomValue(isLoadingAtom);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check for mobile/tablet
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      document.documentElement.classList.add('reduce-motion');
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {/* Custom Cursor - Desktop only - Must be outside AnimatePresence */}
      {!isMobile && !isLoading && <CustomCursor />}

      {/* Loading Screen */}
      <AnimatePresence>{isLoading && <LoadingScreen />}</AnimatePresence>

      {/* Main Content */}
      <AnimatePresence>
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Scroll Progress */}
            <ScrollProgress />

            {/* Gradient Background */}
            <GradientBackground />

            {/* Navigation */}
            <Navbar />

            {/* Main Content Sections */}
            <main className={!isMobile ? 'cursor-none' : ''}>
              <Hero />
              <About />
              <Projects />
              <Skills />
              <Contact />
            </main>

            {/* Footer */}
            <Footer />

            {/* Easter Egg */}
            <KonamiToast />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <JotaiProvider>
      <BrowserRouter>
        <TooltipProvider>
          <PortfolioContent />
        </TooltipProvider>
      </BrowserRouter>
    </JotaiProvider>
  );
}

export default App;
