export interface Skill {
  name: string;
  level: number; // 0-100
  icon: string;
  category: 'languages' | 'backend' | 'infrastructure' | 'databases';
  color: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'languages',
    title: 'Languages & Frontend',
    description: 'Core programming languages and frontend tools',
    skills: [
      { name: 'React', level: 98, icon: '⚛️', category: 'languages', color: '#61DAFB' },
      { name: 'TypeScript', level: 92, icon: '📘', category: 'languages', color: '#3178C6' },
      { name: 'JavaScript', level: 95, icon: '💛', category: 'languages', color: '#F7DF1E' },
      { name: 'HTML/CSS', level: 90, icon: '🎨', category: 'languages', color: '#E34F26' },
      { name: 'Next.js', level: 45, icon: '▲', category: 'languages', color: '#000000' },
      { name: 'Tailwind CSS', level: 88, icon: '💨', category: 'languages', color: '#06B6D4' },
    ]
  },
  {
    id: 'backend',
    title: 'Backend & APIs',
    description: 'Server-side development and API design',
    skills: [
      { name: 'Golang', level: 95, icon: '🔵', category: 'backend', color: '#00ADD8' },
      { name: 'Node.js', level: 45, icon: '💚', category: 'backend', color: '#339933' },
      { name: 'REST APIs', level: 90, icon: '🔗', category: 'backend', color: '#FF6B6B' },
      { name: 'VB .NET', level: 50, icon: '🟣', category: 'backend', color: '#512BD4' },
      { name: 'PostgreSQL', level: 80, icon: '🐘', category: 'backend', color: '#4169E1' },
      { name: 'NoSQL', level: 70, icon: '📦', category: 'backend', color: '#47A248' },
    ]
  },
  {
    id: 'infrastructure',
    title: 'State Management',
    description: 'React state management expertise',
    skills: [
      { name: 'Redux Saga', level: 92, icon: '🔄', category: 'infrastructure', color: '#764ABC' },
      { name: 'Tanstack Query', level: 85, icon: '⚡', category: 'infrastructure', color: '#FF4154' },
      { name: 'Jotai', level: 75, icon: '👻', category: 'infrastructure', color: '#000000' },
      { name: 'Redux', level: 88, icon: '📋', category: 'infrastructure', color: '#764ABC' },
      { name: 'Git', level: 85, icon: '🌿', category: 'infrastructure', color: '#F05032' },
      { name: 'Terraform', level: 40, icon: '🏗️', category: 'infrastructure', color: '#7B42BC' },
    ]
  },
  {
    id: 'databases',
    title: 'Tools & UI Libraries',
    description: 'Development tools and UI frameworks',
    skills: [
      { name: 'Mantine', level: 82, icon: '💎', category: 'databases', color: '#339AF0' },
      { name: 'shadcn/ui', level: 82, icon: '🎨', category: 'databases', color: '#18181B' },
      { name: 'Bootstrap', level: 78, icon: '🅱️', category: 'databases', color: '#7952B3' },
      { name: 'Jira', level: 85, icon: '📊', category: 'databases', color: '#0052CC' },
      { name: 'GCP/AWS', level: 40, icon: '☁️', category: 'databases', color: '#FF9900' },
      { name: 'Accessibility', level: 72, icon: '♿', category: 'databases', color: '#0056B3' },
    ]
  }
];

export const experiences = [
  {
    id: 1,
    role: 'Full Stack Developer - Team Lead',
    company: 'Hooli Software Inc',
    period: '2022 - Present',
    description: 'Leading a team of developers, creating projects from scratch and helping other projects finish development. Building full-stack solutions with React and Golang.',
    technologies: ['React', 'TypeScript', 'Golang', 'PostgreSQL'],
    achievements: [
      'Led development of Zentive - field service management platform',
      'Built Vecos Locker Access Platform from scratch',
      'Promoted to Team Lead, mentoring junior developers'
    ]
  },
  {
    id: 2,
    role: 'Junior Full Stack Developer',
    company: 'Hooli Software',
    period: '2021 - 2022',
    description: 'Worked on frontend development with React and built backend tools with GoLang. Also gained experience with Terraform for infrastructure.',
    technologies: ['React', 'Redux Saga', 'Golang', 'Terraform'],
    achievements: [
      'Built SaaSConsole user management platform',
      'Developed LoanWatch fintech calculation engine',
      'Created GrubMarket Connect audit platform'
    ]
  },
  {
    id: 3,
    role: 'Intern Software Engineer',
    company: 'Hooli Software',
    period: 'Mar 2021 - May 2021',
    description: 'Trained for 2 months on the basics of software development then started contributing to frontend projects.',
    technologies: ['React', 'JavaScript', 'HTML', 'CSS'],
    achievements: [
      'Completed intensive software development training',
      'Started contributing to production frontend code',
      'Learned team workflows with Git, Jira, and code reviews'
    ]
  }
];

export const education = [
  {
    degree: 'Bachelor of Science in Computer Engineering',
    school: 'STI College Balagtas',
    year: '2020',
    achievements: ['Balagtas, Bulacan']
  }
];
