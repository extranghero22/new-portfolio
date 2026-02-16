export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  tags: string[];
  category: 'web' | 'backend' | 'devops' | 'fullstack';
  link?: string;
  github?: string;
  featured: boolean;
  year: string;
  role: string;
  challenges: string[];
  solutions: string[];
  metrics?: {
    label: string;
    value: string;
  }[];
}

export const projects: Project[] = [
  {
    id: 'zentive',
    title: 'Zentive',
    description: 'An all-in-one Field Service Management Software for the green industry.',
    longDescription: 'Zentive is an all-in-one Field Service Management Software designed specifically for the green industry. It automates daily business operations for landscaping, lawn care, tree service, and snow removal businesses. Features job scheduling, financial management, customer tracking, and reporting dashboards.',
    image: '/images/portfolio/zentive.png',
    tags: ['React', 'TypeScript', 'Golang', 'PostgreSQL', 'Tailwind'],
    category: 'fullstack',
    featured: true,
    year: '2025',
    role: 'Mid Level Full Stack Developer',
    challenges: [
      'Building a comprehensive job scheduling system with real-time updates',
      'Implementing financial management with invoicing and revenue tracking',
      'Creating an intuitive UI for non-technical field service workers'
    ],
    solutions: [
      'React with TypeScript for a type-safe, maintainable frontend',
      'Golang backend with PostgreSQL for reliable data processing',
      'Tailwind CSS for rapid, responsive UI development'
    ],
    metrics: [
      { label: 'Modules', value: '6+' },
      { label: 'Role', value: 'Lead' },
      { label: 'Status', value: 'Active' }
    ]
  },
  {
    id: 'vecos',
    title: 'Vecos Locker Platform',
    description: 'A digital locker access management platform with reservation and access control.',
    longDescription: 'Vecos Locker Access Platform is a digital locker access management platform that provides secure access control and user management for locker systems. Users can reserve, access, and manage lockers through a web-based interface with real-time availability, email/SMS access codes, and admin management dashboards.',
    image: '/images/portfolio/vecos.png',
    tags: ['React', 'TypeScript', '.NET', 'REST API', 'Jotai'],
    category: 'fullstack',
    featured: true,
    year: '2024',
    role: 'Solo Dev - Senior Full Stack Developer',
    challenges: [
      'Real-time locker availability tracking across multiple locations',
      'Secure access code generation and delivery via email/SMS',
      'Building an intuitive reservation flow for end users'
    ],
    solutions: [
      'Jotai for lightweight state management of locker states',
      '.NET microservices for access code generation and validation',
      'Responsive grid layout showing locker availability at a glance'
    ],
    metrics: [
      { label: 'Client', value: 'Microsoft' },
      { label: 'Lockers', value: '21+' },
      { label: 'Role', value: 'Lead' }
    ]
  },
  {
    id: 'saasconsole',
    title: 'SaaSConsole',
    description: 'A platform for managing groups of users and collections of SaaS applications.',
    longDescription: 'SaaSConsole is a platform that manages groups of users and collections of SaaS apps. It helps organizations manage their users and groups, assign them to multiple SaaS applications with common rights, and monitor activity through a centralized dashboard with priority-based notifications.',
    image: '/images/portfolio/saasconsole.png',
    tags: ['React', 'TypeScript', 'Redux Saga', 'REST API', 'Tailwind'],
    category: 'fullstack',
    featured: true,
    year: '2021',
    role: 'Junior Full Stack Developer',
    challenges: [
      'Complex user/group permission management across multiple SaaS apps',
      'Building a real-time notification system with priority filtering',
      'Managing complex state across deeply nested user hierarchies'
    ],
    solutions: [
      'Redux Saga for managing complex async flows and side effects',
      'Priority-based notification engine with filtering and search',
      'Modular component architecture for reusable permission controls'
    ],
    metrics: [
      { label: 'Apps Managed', value: 'Multi' },
      { label: 'Users', value: 'Groups' },
      { label: 'Notifications', value: 'Real-time' }
    ]
  },
  {
    id: 'loanwatch',
    title: 'LoanWatch',
    description: 'A fintech platform automating Asset-Based Lending calculations for financial institutions.',
    longDescription: 'LoanWatch is a financial technology platform that specializes in Asset-Based Lending (ABL) automation. It serves as a calculation engine that automates ineligibles and borrowing base calculations for financial institutions, streamlining the lending process with secure authentication and comprehensive reporting.',
    image: '/images/portfolio/loanwatch.png',
    tags: ['React', 'TypeScript', 'Golang', 'PostgreSQL', 'REST API'],
    category: 'fullstack',
    featured: false,
    year: '2022',
    role: 'Junior Full Stack Developer',
    challenges: [
      'Implementing complex financial calculation engines accurately',
      'Ensuring data security for sensitive financial information',
      'Building intuitive interfaces for complex lending workflows'
    ],
    solutions: [
      'Golang backend for precise, performant financial calculations',
      'Secure authentication with session management',
      'Step-by-step wizard UI for complex borrowing base workflows'
    ],
    metrics: [
      { label: 'Client', value: 'JP Morgan' },
      { label: 'Calculations', value: 'ABL' },
      { label: 'Sector', value: 'FinTech' }
    ]
  },
  {
    id: 'snaptoapp',
    title: 'SnaptoApp',
    description: 'A no-code platform enabling users to create their own PWA apps without coding.',
    longDescription: 'SnaptoApp is a platform that helps users create their own Progressive Web Apps without the need to code. Features a visual editor for customizing appearance, themes, navigation, colors, fonts, and images, with live preview and one-click publishing to make app creation accessible to everyone.',
    image: '/images/portfolio/snaptoapp.png',
    tags: ['React', 'JavaScript', 'PWA', 'REST API', 'CSS'],
    category: 'web',
    featured: false,
    year: '2025',
    role: 'Team Lead - Full Stack Developer',
    challenges: [
      'Building a visual editor that generates valid PWA configurations',
      'Implementing live preview that accurately reflects published apps',
      'Making complex app customization accessible to non-technical users'
    ],
    solutions: [
      'Component-based visual editor with drag-and-drop sections',
      'Real-time preview rendering matching actual PWA output',
      'Guided wizard flow breaking down app creation into simple steps'
    ],
    metrics: [
      { label: 'Type', value: 'No-Code' },
      { label: 'Output', value: 'PWA' },
      { label: 'UX', value: 'Visual' }
    ]
  },
  {
    id: 'grubmarket',
    title: 'GrubMarket Connect',
    description: 'A proprietary platform built specifically for the GrubMarket Group.',
    longDescription: 'GrubMarket Connect is a proprietary platform made specifically for the GrubMarket Group. It handles external auditing workflows with branch management, period tracking, completion percentage monitoring, and reporting tools. Built to streamline operations across multiple branches with actionable data insights.',
    image: '/images/portfolio/grubmarket.png',
    tags: ['React', 'TypeScript', 'Golang', 'PostgreSQL', 'Tailwind'],
    category: 'fullstack',
    featured: false,
    year: '2023',
    role: 'Junior Full Stack Developer',
    challenges: [
      'Managing multi-branch audit data with period-based tracking',
      'Building exportable reports with completion percentage analytics',
      'Integrating with existing GrubMarket infrastructure'
    ],
    solutions: [
      'Branch-based data partitioning for organized audit management',
      'Exportable tables with CSV and attachment downloads',
      'Period-based filtering with status tracking across branches'
    ],
    metrics: [
      { label: 'Branches', value: 'Multi' },
      { label: 'Audits', value: 'Tracked' },
      { label: 'Reports', value: 'Export' }
    ]
  }
];

export const categories = [
  { id: 'all', label: 'All Projects' },
  { id: 'fullstack', label: 'Full Stack' },
  { id: 'web', label: 'Frontend' },
];
