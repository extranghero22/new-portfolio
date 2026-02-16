# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RPG/SNES-themed personal portfolio website with a retro pixel/CRT aesthetic. Frontend-only project in `frontend/` directory (React + Vite). Deployed on Netlify. Contact form uses Netlify Forms. No backend, no database, no tests configured.

## Commands

### Frontend (`cd frontend`)
- **Dev server**: `npm run dev` (runs on http://localhost:5173 with HMR)
- **Build**: `npm run build` (runs `tsc -b && vite build`, output in `frontend/dist/`)
- **Lint**: `npm run lint` (ESLint flat config with TypeScript + React rules)
- **Preview**: `npm run preview`

## Architecture

### Frontend Stack
- **React 19 + TypeScript** (strict: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `erasableSyntaxOnly`)
- **Vite 7** for bundling (no path aliases — all imports are relative)
- **Tailwind CSS v3** with class-based dark mode and 21 custom keyframe animations in `tailwind.config.js`
- **Framer Motion** for declarative animations and scroll-triggered effects
- **Jotai** for global state (`frontend/src/store/atoms.ts`)
- **React Router v7** — only `BrowserRouter` wrapper is used; navigation is hash-based scroll-into-view (`#home`, `#about`, etc.), not actual routing
- **Shadcn/UI pattern**: Radix primitives (`dialog`, `tooltip`, `slot`) styled with Tailwind + CVA

### App Bootstrap Flow
`main.tsx` → `StrictMode` → `App.tsx` → `JotaiProvider` → `BrowserRouter` → `TooltipProvider` → `PortfolioContent` (checks mobile/reduced-motion, conditionally renders `CustomCursor`, `LoadingScreen` via `AnimatePresence`, then all sections)

### Key Patterns
- **Component organization**: `components/effects/` (animations), `components/layout/` (nav, loading, transitions), `components/sections/` (page content), `components/ui/` (reusable primitives)
- **Barrel exports**: Every component subdirectory has `index.ts` — import from directory, not individual files
- **Static data**: Portfolio content in `data/projects.ts` (6 projects with metrics, challenges, solutions) and `data/skills.ts` (4 skill categories, experience timeline, education)
- **Custom hooks**: `hooks/` — `useMousePosition`, `useScrollProgress`, `useInView`, `useMagneticEffect`
- **`cn()` utility**: `lib/utils.ts` exports `cn()` (clsx + tailwind-merge) for conditional class merging

### Theme System
- **Fonts**: VT323 (body), Press Start 2P (display), JetBrains Mono (mono) — loaded via Google Fonts with `-webkit-font-smoothing: none` for pixel-perfect rendering
- **Colors**: HSL CSS custom properties in `index.css`, toggled via `themeAtom` with class strategy. Includes RPG-specific colors: `hp`, `mp`, `heal`, `gold`, `rare`, `xp`
- **Border radius**: Set to 0px globally for pixel aesthetic
- **CRT effects**: Scanlines and vignette via `body::before`/`::after` pseudo-elements in `index.css`
- **Custom RPG CSS classes**: `.pixel-border`, `.pixel-panel`, `.rpg-dialog`, `.rpg-menu-item`, `.rpg-bar`, `.save-crystal`, `.neon-text`, `.holographic`, `.card-3d`, `.glass-3d`

### Canvas Animations
- `ParticleField.tsx` and `AsciiBackground.tsx` use raw Canvas API at 60fps
- Both handle `devicePixelRatio` for crisp rendering on HiDPI displays
- ParticleField implements mouse repulsion physics; AsciiBackground renders character-based terrain with mouse ripple

### Accessibility
- `reducedMotionAtom` respects `prefers-reduced-motion`
- Custom cursor and heavy animations disabled on touch devices
- All interactive elements have hover/focus states

### Easter Egg
Konami Code (↑↑↓↓←→←→BA) triggers a "+30 LIVES" toast via `KonamiToast` component.

### Adding a New Section
1. Create component in `src/components/sections/`
2. Export from `src/components/sections/index.ts`
3. Add to `src/App.tsx`
4. Add nav link in `src/components/layout/Navbar.tsx`
