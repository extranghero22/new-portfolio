# Portfolio Website

A stunning, award-winning inspired portfolio website built with modern web technologies. Features flamboyant animations, smooth transitions, and an immersive user experience.

![Portfolio Preview](https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=600&fit=crop)

## Features

- **Stunning Hero Section** with particle field animation and typewriter effect
- **Custom Cursor** with magnetic interactions (desktop only)
- **Smooth Scroll Animations** using Framer Motion
- **Interactive Project Showcase** with modal views and filtering
- **Animated Skill Bars** with category tabs
- **Timeline Experience Section** with expandable cards
- **Contact Form** with validation via Netlify Forms
- **Dark/Light Theme** toggle with smooth transitions
- **Fully Responsive** design for all devices
- **Loading Screen** with animated progress indicator
- **Glassmorphism Effects** throughout the UI
- **Gradient Text Animations** and glow effects

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for blazing fast development
- **Tailwind CSS v3** for styling
- **Framer Motion** for animations
- **Jotai** for state management
- **React Router** for navigation
- **Shadcn/UI** inspired components
- **Lucide React** for icons

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd Portfolio
```

2. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

### Development

```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173`

### Production Build

```bash
cd frontend
npm run build
```

The build output will be in the `frontend/dist` folder.

## Project Structure

```
Portfolio/
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── effects/          # Animation components
│   │   │   │   ├── CustomCursor.tsx
│   │   │   │   ├── ParticleField.tsx
│   │   │   │   ├── GradientBlob.tsx
│   │   │   │   ├── TextReveal.tsx
│   │   │   │   ├── MagneticButton.tsx
│   │   │   │   └── ScrollProgress.tsx
│   │   │   ├── layout/           # Layout components
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── LoadingScreen.tsx
│   │   │   │   └── PageTransition.tsx
│   │   │   ├── sections/         # Page sections
│   │   │   │   ├── Hero.tsx
│   │   │   │   ├── About.tsx
│   │   │   │   ├── Projects.tsx
│   │   │   │   ├── Skills.tsx
│   │   │   │   ├── Contact.tsx
│   │   │   │   └── Footer.tsx
│   │   │   └── ui/               # Shadcn-style components
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       ├── input.tsx
│   │   │       ├── textarea.tsx
│   │   │       ├── badge.tsx
│   │   │       ├── dialog.tsx
│   │   │       └── tooltip.tsx
│   │   ├── data/                 # Static data
│   │   │   ├── projects.ts
│   │   │   └── skills.ts
│   │   ├── hooks/                # Custom React hooks
│   │   │   ├── useMousePosition.ts
│   │   │   ├── useScrollProgress.ts
│   │   │   ├── useInView.ts
│   │   │   └── useMagneticEffect.ts
│   │   ├── lib/
│   │   │   └── utils.ts
│   │   ├── store/
│   │   │   └── atoms.ts          # Jotai state atoms
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
```

## Customization

### Updating Personal Information

1. **Hero Section**: Edit `src/components/sections/Hero.tsx`
   - Change name, roles, and description

2. **About Section**: Edit `src/components/sections/About.tsx`
   - Update bio, stats, and highlights

3. **Projects**: Edit `src/data/projects.ts`
   - Add/modify your projects with images, descriptions, and links

4. **Skills**: Edit `src/data/skills.ts`
   - Update skill categories and experience timeline

5. **Contact**: Edit `src/components/sections/Contact.tsx`
   - Update contact information

### Styling

- Colors and theme variables: `src/index.css`
- Tailwind configuration: `tailwind.config.js`
- Component styles: Individual component files

### Adding New Sections

1. Create a new component in `src/components/sections/`
2. Export it from `src/components/sections/index.ts`
3. Add it to `src/App.tsx`
4. Add navigation link in `src/components/layout/Navbar.tsx`

## Animation Features

The portfolio includes numerous animation effects:

- **Particle Field**: Interactive canvas-based particle system
- **Text Reveal**: Character-by-character and word-by-word animations
- **Magnetic Buttons**: Cursor attraction effect
- **Scroll Progress**: Top progress bar
- **Gradient Blobs**: Animated background elements
- **Hover Effects**: Image zoom, gradient overlays
- **Page Transitions**: Smooth fade and slide animations
- **Loading Screen**: Animated progress indicator
- **Parallax**: Scroll-based parallax effects

## Performance Optimization

- Lazy loading for images
- Canvas-based particle system for smooth 60fps
- Optimized re-renders with Jotai
- Code splitting ready
- CSS animations where possible

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this for your own portfolio!

## Credits

- Design inspiration from [Awwwards](https://www.awwwards.com/websites/portfolio/)
- Icons by [Lucide](https://lucide.dev/)
- Fonts from [Google Fonts](https://fonts.google.com/)
