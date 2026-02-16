import { atom } from 'jotai';

// Theme state
export const themeAtom = atom<'dark' | 'light'>('dark');

// Navigation state
export const isMenuOpenAtom = atom(false);
export const activeNavItemAtom = atom<string>('home');

// Cursor state for custom cursor
export const cursorVariantAtom = atom<'default' | 'text' | 'link' | 'project'>('default');
export const cursorTextAtom = atom<string>('');

// Loading state
export const isLoadingAtom = atom(true);
export const loadingProgressAtom = atom(0);

// Scroll state
export const scrollProgressAtom = atom(0);
export const currentSectionAtom = atom(0);

// Modal state for projects
export const selectedProjectAtom = atom<string | null>(null);
export const isProjectModalOpenAtom = atom(false);

// Contact form state
export const contactFormAtom = atom({
  name: '',
  email: '',
  message: '',
});
export const isSubmittingAtom = atom(false);
export const formStatusAtom = atom<'idle' | 'success' | 'error'>('idle');

// Sound/Music state (optional feature)
export const isSoundEnabledAtom = atom(false);

// Animation preferences
export const reducedMotionAtom = atom(false);
