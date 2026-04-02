// Shared data store - dashboard saves here, portfolio reads from here

export type SocialLinks = {
  github: string;
  linkedin: string;
  twitter: string;
  whatsapp: string;
};

export type AboutData = {
  full_name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  years_experience: string;
  projects_completed: string;
  technologies: string;
  resume_url: string;
  social_links: SocialLinks;
};

export type ResumeItem = {
  id: string;
  type: 'work' | 'education' | 'certification';
  title: string;
  organization: string;
  period: string;
  description: string;
};

export type SkillItem = {
  id: string;
  name: string;
  category: string;
  level: number;
};

const ABOUT_KEY = 'portfolio_about';
const RESUME_KEY = 'portfolio_resume';
const SKILLS_KEY = 'portfolio_skills';

const defaultAbout: AboutData = {
  full_name: 'Ahmad Wais Sarwari',
  title: 'Full Stack Developer',
  bio: "I'm Ahmad Wais (Son of Mohammad Ismail Sarwari), a passionate Full-Stack Web Developer specializing in the MERN stack (MongoDB, Express.js, React.js, Node.js) and Mobile Application Developer proficient in Flutter.\n\nCurrently studying at Kabul Polytechnic University, Computer Science Faculty, Information System Department. With over 5 years of experience, I've helped businesses and startups build scalable, high-performance web and mobile applications.",
  email: 'ahmadwaissarwari@gmail.com',
  phone: '+93 776 415 307',
  location: 'Kabul, Afghanistan',
  years_experience: '5+',
  projects_completed: '50+',
  technologies: '15+',
  resume_url: '/resume.pdf',
  social_links: {
    github: 'https://github.com/ahmadwais12',
    linkedin: 'https://linkedin.com/in/ahmadwaissarwari',
    twitter: 'https://twitter.com/ahmadwais',
    whatsapp: 'https://wa.me/93776415307',
  },
};

const defaultResume: ResumeItem[] = [
  {
    id: '1',
    type: 'work',
    title: 'Full Stack Web Developer',
    organization: 'Freelance / Remote',
    period: '2021 - Present',
    description: 'Designing and developing full-stack web applications using the MERN stack (MongoDB, Express.js, React.js, Node.js). Delivering scalable, high-performance solutions for clients across various industries.',
  },
  {
    id: '2',
    type: 'work',
    title: 'Flutter Mobile App Developer',
    organization: 'Freelance / Remote',
    period: '2022 - Present',
    description: 'Building cross-platform mobile applications using Flutter and Dart. Integrating Firebase for backend services, real-time databases, and push notifications.',
  },
  {
    id: '3',
    type: 'work',
    title: 'WordPress & PHP Developer',
    organization: 'Freelance',
    period: '2020 - 2022',
    description: 'Developed and customized WordPress themes and plugins. Built dynamic websites using PHP, MySQL, and JavaScript for small businesses and startups.',
  },
  {
    id: '4',
    type: 'education',
    title: "Bachelor's in Computer Science",
    organization: 'Kabul Polytechnic University',
    period: '2021 - Present',
    description: 'Computer Science Faculty, Information System Department. Studying software engineering, algorithms, databases, and modern web technologies.',
  },
  {
    id: '5',
    type: 'certification',
    title: 'MERN Stack Development',
    organization: 'Online Certification',
    period: '2022',
    description: 'Completed advanced certification in full-stack development with MongoDB, Express.js, React.js, and Node.js.',
  },
  {
    id: '6',
    type: 'certification',
    title: 'Flutter & Dart Development',
    organization: 'Online Certification',
    period: '2022',
    description: 'Certified in cross-platform mobile app development using Flutter framework and Dart programming language.',
  },
];

const defaultSkills: SkillItem[] = [
  { id: '1', name: 'React.js', category: 'Frontend', level: 95 },
  { id: '2', name: 'JavaScript', category: 'Frontend', level: 93 },
  { id: '3', name: 'TypeScript', category: 'Frontend', level: 88 },
  { id: '4', name: 'Tailwind CSS', category: 'Frontend', level: 92 },
  { id: '5', name: 'HTML/CSS', category: 'Frontend', level: 95 },
  { id: '6', name: 'Node.js', category: 'Backend', level: 90 },
  { id: '7', name: 'MongoDB', category: 'Backend', level: 88 },
  { id: '8', name: 'PHP', category: 'Backend', level: 85 },
  { id: '9', name: 'MySQL', category: 'Backend', level: 87 },
  { id: '10', name: 'Flutter', category: 'Mobile', level: 92 },
  { id: '11', name: 'Dart', category: 'Mobile', level: 90 },
  { id: '12', name: 'React Native', category: 'Mobile', level: 80 },
  { id: '13', name: 'Python', category: 'Languages', level: 85 },
  { id: '14', name: 'Java', category: 'Languages', level: 88 },
  { id: '15', name: 'Docker', category: 'DevOps', level: 75 },
];

export const getAbout = (): AboutData => {
  try {
    const stored = localStorage.getItem(ABOUT_KEY);
    return stored ? JSON.parse(stored) : defaultAbout;
  } catch { return defaultAbout; }
};

export const saveAbout = (data: AboutData) => {
  localStorage.setItem(ABOUT_KEY, JSON.stringify(data));
};

export const getResume = (): ResumeItem[] => {
  try {
    const stored = localStorage.getItem(RESUME_KEY);
    return stored ? JSON.parse(stored) : defaultResume;
  } catch { return defaultResume; }
};

export const saveResume = (data: ResumeItem[]) => {
  localStorage.setItem(RESUME_KEY, JSON.stringify(data));
};

export const getSkills = (): SkillItem[] => {
  try {
    const stored = localStorage.getItem(SKILLS_KEY);
    return stored ? JSON.parse(stored) : defaultSkills;
  } catch { return defaultSkills; }
};

export const saveSkills = (data: SkillItem[]) => {
  localStorage.setItem(SKILLS_KEY, JSON.stringify(data));
};

export type ServiceItem = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

export type TestimonialItem = {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
};

export type ProjectItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  category: string;
  favorite: boolean;
  github: string;
  demo: string;
  longDescription: string;
};

const SERVICES_KEY = 'portfolio_services';
const TESTIMONIALS_KEY = 'portfolio_testimonials';
const PROJECTS_KEY = 'portfolio_projects';

const defaultServices: ServiceItem[] = [
  { id: '1', icon: 'Code', title: 'Web Development', description: 'Custom websites and web applications built with modern technologies like React, Node.js, and MongoDB.' },
  { id: '2', icon: 'Smartphone', title: 'Mobile Apps', description: 'Cross-platform mobile applications developed with Flutter for both iOS and Android platforms.' },
  { id: '3', icon: 'Palette', title: 'UI/UX Design', description: 'Beautiful and intuitive user interfaces designed with user experience principles in mind.' },
  { id: '4', icon: 'Database', title: 'Database Design', description: 'Efficient database architectures using SQL and NoSQL solutions tailored to your needs.' },
  { id: '5', icon: 'Globe', title: 'SEO Optimization', description: "Improve your website's visibility on search engines and drive more organic traffic." },
  { id: '6', icon: 'Shield', title: 'Security Auditing', description: 'Comprehensive security assessments to protect your digital assets from vulnerabilities.' },
];

const defaultTestimonials: TestimonialItem[] = [
  { id: '1', name: 'John Doe', role: 'CEO, TechCorp', content: 'Working with Ahmad was an incredible experience. His attention to detail and technical expertise helped us deliver our project ahead of schedule.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
  { id: '2', name: 'Jane Smith', role: 'Marketing Director, InnovateCo', content: "Ahmad's ability to translate our business requirements into elegant technical solutions exceeded our expectations. Highly recommended!", avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' },
  { id: '3', name: 'Michael Johnson', role: 'CTO, StartupXYZ', content: 'The website Ahmad built for us has significantly improved our online presence and customer engagement. His work is both beautiful and functional.', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop' },
];

const defaultProjects: ProjectItem[] = [
  { id: '1', title: 'E-Commerce Platform', description: 'Full-stack e-commerce solution with React, Node.js, and MongoDB', image: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?w=800&h=600&fit=crop', tags: ['React', 'Node.js', 'MongoDB', 'Stripe'], category: 'web', favorite: true, github: 'https://github.com/ahmadwais12', demo: 'https://demo.com', longDescription: 'A comprehensive e-commerce platform featuring user authentication, product management, shopping cart functionality, payment integration with Stripe, and an admin dashboard for managing orders and inventory.' },
  { id: '2', title: 'Task Management App', description: 'Collaborative task management tool built with MERN stack', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop', tags: ['React', 'Express', 'MongoDB', 'Socket.io'], category: 'web', favorite: false, github: 'https://github.com/ahmadwais12', demo: 'https://demo.com', longDescription: 'Real-time collaborative task management application with features like team workspaces, real-time updates using Socket.io, task assignments, progress tracking, and deadline reminders.' },
  { id: '3', title: 'Fitness Tracking Mobile App', description: 'Flutter-based fitness tracker with workout plans and progress monitoring', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop', tags: ['Flutter', 'Dart', 'Firebase', 'Material Design'], category: 'mobile', favorite: true, github: 'https://github.com/ahmadwais12', demo: 'https://demo.com', longDescription: 'Cross-platform mobile fitness application with customizable workout plans, exercise tracking, nutrition logging, progress visualization with charts, and social features for sharing achievements.' },
  { id: '4', title: 'Real Estate Portal', description: 'Property listing platform with advanced search and filters', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop', tags: ['Next.js', 'PostgreSQL', 'Tailwind', 'Google Maps API'], category: 'web', favorite: false, github: 'https://github.com/ahmadwais12', demo: 'https://demo.com', longDescription: 'Modern real estate platform featuring property listings with image galleries, advanced search filters, interactive maps, virtual tours, contact forms, and agent dashboards for property management.' },
  { id: '5', title: 'Social Media Dashboard', description: 'Analytics dashboard for social media management and insights', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop', tags: ['React', 'D3.js', 'Node.js', 'REST APIs'], category: 'web', favorite: true, github: 'https://github.com/ahmadwais12', demo: 'https://demo.com', longDescription: 'Comprehensive social media analytics dashboard with data visualization, engagement metrics, scheduling features, multi-platform integration, and automated reporting capabilities.' },
  { id: '6', title: 'Weather Forecast App', description: 'Mobile weather app with real-time forecasts and beautiful UI', image: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=600&fit=crop', tags: ['Flutter', 'OpenWeather API', 'BLoC', 'Animations'], category: 'mobile', favorite: false, github: 'https://github.com/ahmadwais12', demo: 'https://demo.com', longDescription: 'Beautiful weather forecast application featuring real-time weather data, 7-day forecasts, location-based weather, severe weather alerts, and smooth animations with an intuitive user interface.' },
  { id: '7', title: 'Food Delivery App', description: 'Full-featured mobile food ordering and delivery application', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop', tags: ['Flutter', 'Firebase', 'Google Maps', 'Stripe'], category: 'mobile', favorite: true, github: 'https://github.com/ahmadwais12', demo: 'https://demo.com', longDescription: 'Comprehensive food delivery application with restaurant browsing, menu viewing, cart management, real-time order tracking, payment integration, and rider assignment system.' },
];

export const getServices = (): ServiceItem[] => {
  try { const s = localStorage.getItem(SERVICES_KEY); return s ? JSON.parse(s) : defaultServices; } catch { return defaultServices; }
};
export const saveServices = (data: ServiceItem[]) => localStorage.setItem(SERVICES_KEY, JSON.stringify(data));

export const getTestimonials = (): TestimonialItem[] => {
  try { const s = localStorage.getItem(TESTIMONIALS_KEY); return s ? JSON.parse(s) : defaultTestimonials; } catch { return defaultTestimonials; }
};
export const saveTestimonials = (data: TestimonialItem[]) => localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(data));

export const getProjects = (): ProjectItem[] => {
  try { const s = localStorage.getItem(PROJECTS_KEY); return s ? JSON.parse(s) : defaultProjects; } catch { return defaultProjects; }
};
export const saveProjects = (data: ProjectItem[]) => localStorage.setItem(PROJECTS_KEY, JSON.stringify(data));
