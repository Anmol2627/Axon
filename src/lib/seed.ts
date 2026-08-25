// ============================================================
// Axon — Seed Data (Section 13.4 of spec)
// 15-20 realistic candidate profiles + 4 example projects
// UI components NEVER import this directly — only dataService does
// ============================================================

import type {
  User,
  Profile,
  Project,
  Skill,
} from '@/lib/models';

// ── Users ────────────────────────────────────────────────────

export const SEED_USERS: User[] = [
  {
    id: 'u1',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
    bio: 'ML researcher passionate about healthcare AI and responsible tech. Published 3 papers on predictive modeling.',
    createdAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 'u2',
    name: 'Marcus Chen',
    email: 'marcus@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus',
    bio: 'Full-stack engineer with 4 years building scalable Node.js APIs. Love turning complex ideas into elegant systems.',
    createdAt: '2024-01-12T00:00:00Z',
  },
  {
    id: 'u3',
    name: 'Aisha Okonkwo',
    email: 'aisha@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aisha',
    bio: 'UX/UI designer focused on human-centered AI products. Prev: Google, Figma intern.',
    createdAt: '2024-01-14T00:00:00Z',
  },
  {
    id: 'u4',
    name: 'Rohan Patel',
    email: 'rohan@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rohan',
    bio: 'Data scientist specializing in NLP and time-series forecasting. Kaggle master.',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'u5',
    name: 'Elena Vasquez',
    email: 'elena@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elena',
    bio: 'Frontend developer who lives in React and TypeScript. Accessibility advocate.',
    createdAt: '2024-01-16T00:00:00Z',
  },
  {
    id: 'u6',
    name: 'James Oduya',
    email: 'james@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
    bio: 'DevOps and cloud infrastructure engineer. AWS Solutions Architect certified.',
    createdAt: '2024-01-17T00:00:00Z',
  },
  {
    id: 'u7',
    name: 'Mei Lin',
    email: 'mei@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mei',
    bio: 'Computer vision researcher. Built real-time object detection systems for autonomous vehicles.',
    createdAt: '2024-01-18T00:00:00Z',
  },
  {
    id: 'u8',
    name: 'Diego Fernández',
    email: 'diego@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=diego',
    bio: 'Mobile developer (React Native, Flutter). Built 5 apps with 100K+ downloads.',
    createdAt: '2024-01-19T00:00:00Z',
  },
  {
    id: 'u9',
    name: 'Fatima Al-Hassan',
    email: 'fatima@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fatima',
    bio: 'Cybersecurity engineer with expertise in pen testing and secure system design.',
    createdAt: '2024-01-20T00:00:00Z',
  },
  {
    id: 'u10',
    name: 'Kenji Nakamura',
    email: 'kenji@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kenji',
    bio: 'Backend engineer with deep Rust and Go experience. Obsessed with performance.',
    createdAt: '2024-01-21T00:00:00Z',
  },
  {
    id: 'u11',
    name: 'Amara Diallo',
    email: 'amara@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amara',
    bio: 'Product manager turned engineer. Bridges business logic and technical execution.',
    createdAt: '2024-01-22T00:00:00Z',
  },
  {
    id: 'u12',
    name: 'Noah Bergstrom',
    email: 'noah@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=noah',
    bio: 'Robotics and embedded systems engineer. ROS expert, builds things that move.',
    createdAt: '2024-01-23T00:00:00Z',
  },
  {
    id: 'u13',
    name: 'Seo-Yeon Park',
    email: 'seoyeon@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seoyeon',
    bio: 'FinTech developer with blockchain and smart contract experience. ETHGlobal winner.',
    createdAt: '2024-01-24T00:00:00Z',
  },
  {
    id: 'u14',
    name: 'Tariq Hassan',
    email: 'tariq@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tariq',
    bio: 'Database architect. Postgres wizard, also fluent in Cassandra and Redis.',
    createdAt: '2024-01-25T00:00:00Z',
  },
  {
    id: 'u15',
    name: 'Nadia Kowalski',
    email: 'nadia@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nadia',
    bio: 'AI ethics researcher and educator. Writes about responsible AI deployment.',
    createdAt: '2024-01-26T00:00:00Z',
  },
  {
    id: 'u16',
    name: 'Aarav Shah',
    email: 'aarav@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aarav',
    bio: 'CS student with a passion for building AI products that solve real-world problems.',
    createdAt: '2024-01-27T00:00:00Z',
  },
  {
    id: 'u17',
    name: 'Zara Williams',
    email: 'zara@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zara',
    bio: 'Data engineer specializing in ETL pipelines and real-time streaming (Kafka, Spark).',
    createdAt: '2024-01-28T00:00:00Z',
  },
  {
    id: 'u18',
    name: 'Liam O\'Brien',
    email: 'liam@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liam',
    bio: 'Game developer and graphics programmer. Unity, WebGL, and creative coding.',
    createdAt: '2024-01-29T00:00:00Z',
  },
];

// ── Profiles ─────────────────────────────────────────────────

function skill(name: string, proficiency: Skill['proficiency']): Skill {
  return { id: name.toLowerCase().replace(/\s+/g, '-'), name, proficiency };
}

export const SEED_PROFILES: Profile[] = [
  // u1 — Priya Sharma — ML/Healthcare
  {
    userId: 'u1',
    skills: [
      skill('Python', 'Advanced'),
      skill('Machine Learning', 'Advanced'),
      skill('Data Analysis', 'Advanced'),
      skill('TensorFlow', 'Intermediate'),
      skill('SQL', 'Intermediate'),
      skill('Research', 'Advanced'),
    ],
    interests: [
      { id: 'ai', name: 'AI' },
      { id: 'healthcare', name: 'Healthcare' },
      { id: 'data-science', name: 'Data Science' },
    ],
    experience: [
      { id: 'e1', type: 'project', title: 'Hospital Readmission Predictor', description: 'ML model predicting 30-day hospital readmissions using EHR data, 87% accuracy.', date: '2023-09' },
      { id: 'e2', type: 'hackathon', title: 'MIT Healthcare Hack 2023', description: 'Built an AI triage assistant, won Best Healthcare Innovation.', date: '2023-10' },
      { id: 'e3', type: 'internship', title: 'AI Research Intern — Google DeepMind', description: 'Worked on protein folding prediction models.', date: '2023-06' },
    ],
    availability: { hoursPerWeek: 25, daysAvailable: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], preferredTime: 'Morning' },
    preferredRoles: ['ML Engineer', 'Data Scientist'],
    experienceLevel: 'Advanced',
  },
  // u2 — Marcus Chen — Backend/FullStack
  {
    userId: 'u2',
    skills: [
      skill('Node.js', 'Advanced'),
      skill('TypeScript', 'Advanced'),
      skill('PostgreSQL', 'Advanced'),
      skill('Docker', 'Intermediate'),
      skill('AWS', 'Intermediate'),
      skill('REST APIs', 'Advanced'),
      skill('GraphQL', 'Intermediate'),
    ],
    interests: [
      { id: 'web-dev', name: 'Web Development' },
      { id: 'fintech', name: 'FinTech' },
      { id: 'ai', name: 'AI' },
    ],
    experience: [
      { id: 'e4', type: 'project', title: 'Real-time Analytics Dashboard', description: 'Built a scalable event-streaming platform processing 50K events/sec.', date: '2023-08' },
      { id: 'e5', type: 'internship', title: 'Backend Engineer Intern — Stripe', description: 'Worked on payment reconciliation APIs.', date: '2023-05' },
      { id: 'e6', type: 'hackathon', title: 'HackMIT 2022', description: 'API platform for college financial aid optimization.', date: '2022-11' },
    ],
    availability: { hoursPerWeek: 30, daysAvailable: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], preferredTime: 'Afternoon' },
    preferredRoles: ['Backend Developer', 'Full Stack Developer'],
    experienceLevel: 'Advanced',
  },
  // u3 — Aisha Okonkwo — UX/UI
  {
    userId: 'u3',
    skills: [
      skill('Figma', 'Advanced'),
      skill('UX Research', 'Advanced'),
      skill('React', 'Intermediate'),
      skill('CSS', 'Advanced'),
      skill('Prototyping', 'Advanced'),
      skill('User Testing', 'Advanced'),
    ],
    interests: [
      { id: 'ai', name: 'AI' },
      { id: 'healthcare', name: 'Healthcare' },
      { id: 'education', name: 'Education' },
    ],
    experience: [
      { id: 'e7', type: 'internship', title: 'UX Design Intern — Google', description: 'Redesigned onboarding flow for Google Workspace, improving retention 23%.', date: '2023-06' },
      { id: 'e8', type: 'project', title: 'Mental Health App UI', description: 'End-to-end design for a mood tracking and CBT app.', date: '2023-03' },
      { id: 'e9', type: 'internship', title: 'Product Design Intern — Figma', description: 'Contributed to the DevMode panel redesign.', date: '2022-06' },
    ],
    availability: { hoursPerWeek: 20, daysAvailable: ['Mon', 'Wed', 'Fri'], preferredTime: 'Flexible' },
    preferredRoles: ['UI/UX Designer', 'Product Designer'],
    experienceLevel: 'Advanced',
  },
  // u4 — Rohan Patel — Data Science/NLP
  {
    userId: 'u4',
    skills: [
      skill('Python', 'Advanced'),
      skill('NLP', 'Advanced'),
      skill('Machine Learning', 'Advanced'),
      skill('Data Analysis', 'Advanced'),
      skill('PyTorch', 'Advanced'),
      skill('SQL', 'Advanced'),
      skill('Statistics', 'Advanced'),
    ],
    interests: [
      { id: 'ai', name: 'AI' },
      { id: 'data-science', name: 'Data Science' },
      { id: 'education', name: 'Education' },
    ],
    experience: [
      { id: 'e10', type: 'project', title: 'Student Performance Predictor', description: 'NLP + tabular ML model predicting academic outcomes, 91% accuracy.', date: '2023-10' },
      { id: 'e11', type: 'hackathon', title: 'Kaggle NLP Competition', description: 'Top 2% globally in toxic comment classification.', date: '2023-08' },
      { id: 'e12', type: 'project', title: 'Automated Essay Grading System', description: 'BERT-based grading assistant for large-scale assessments.', date: '2023-04' },
    ],
    availability: { hoursPerWeek: 35, daysAvailable: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], preferredTime: 'Evening' },
    preferredRoles: ['Data Scientist', 'ML Engineer'],
    experienceLevel: 'Advanced',
  },
  // u5 — Elena Vasquez — Frontend
  {
    userId: 'u5',
    skills: [
      skill('React', 'Advanced'),
      skill('TypeScript', 'Advanced'),
      skill('CSS', 'Advanced'),
      skill('Next.js', 'Advanced'),
      skill('Testing', 'Intermediate'),
      skill('Accessibility', 'Advanced'),
    ],
    interests: [
      { id: 'web-dev', name: 'Web Development' },
      { id: 'education', name: 'Education' },
      { id: 'sustainability', name: 'Sustainability' },
    ],
    experience: [
      { id: 'e13', type: 'project', title: 'Open Source Component Library', description: 'Accessible React component library with 2K+ GitHub stars.', date: '2023-07' },
      { id: 'e14', type: 'hackathon', title: 'TreeHacks 2023', description: 'Built an interactive learning platform for climate science.', date: '2023-02' },
      { id: 'e15', type: 'internship', title: 'Frontend Intern — Vercel', description: 'Contributed to Next.js documentation and example apps.', date: '2022-06' },
    ],
    availability: { hoursPerWeek: 25, daysAvailable: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], preferredTime: 'Morning' },
    preferredRoles: ['Frontend Developer'],
    experienceLevel: 'Advanced',
  },
  // u6 — James Oduya — DevOps/Cloud
  {
    userId: 'u6',
    skills: [
      skill('AWS', 'Advanced'),
      skill('Docker', 'Advanced'),
      skill('Kubernetes', 'Advanced'),
      skill('CI/CD', 'Advanced'),
      skill('Terraform', 'Intermediate'),
      skill('Linux', 'Advanced'),
      skill('Python', 'Intermediate'),
    ],
    interests: [
      { id: 'web-dev', name: 'Web Development' },
      { id: 'cybersecurity', name: 'Cybersecurity' },
      { id: 'ai', name: 'AI' },
    ],
    experience: [
      { id: 'e16', type: 'internship', title: 'DevOps Intern — Amazon', description: 'Automated CI/CD pipelines cutting deployment time by 60%.', date: '2023-06' },
      { id: 'e17', type: 'project', title: 'Self-healing Infrastructure', description: 'Kubernetes operator that auto-recovers failing services.', date: '2023-09' },
      { id: 'e18', type: 'hackathon', title: 'AWS GameDay 2023', description: 'Won Best Architecture award for multi-region resilient design.', date: '2023-11' },
    ],
    availability: { hoursPerWeek: 20, daysAvailable: ['Tue', 'Wed', 'Thu', 'Sat'], preferredTime: 'Afternoon' },
    preferredRoles: ['DevOps Engineer', 'Cloud Architect'],
    experienceLevel: 'Advanced',
  },
  // u7 — Mei Lin — Computer Vision
  {
    userId: 'u7',
    skills: [
      skill('Python', 'Advanced'),
      skill('Computer Vision', 'Advanced'),
      skill('Machine Learning', 'Advanced'),
      skill('OpenCV', 'Advanced'),
      skill('PyTorch', 'Advanced'),
      skill('CUDA', 'Intermediate'),
    ],
    interests: [
      { id: 'ai', name: 'AI' },
      { id: 'robotics', name: 'Robotics' },
      { id: 'healthcare', name: 'Healthcare' },
    ],
    experience: [
      { id: 'e19', type: 'project', title: 'Traffic Flow Monitor', description: 'YOLO-based real-time vehicle counting and speed estimation.', date: '2023-08' },
      { id: 'e20', type: 'internship', title: 'CV Engineer Intern — Tesla Autopilot', description: 'Worked on lane detection model improvements.', date: '2023-05' },
      { id: 'e21', type: 'hackathon', title: 'HackDavis 2023', description: 'Agricultural plant disease detection from drone imagery.', date: '2023-04' },
    ],
    availability: { hoursPerWeek: 30, daysAvailable: ['Mon', 'Tue', 'Wed', 'Thu'], preferredTime: 'Morning' },
    preferredRoles: ['ML Engineer', 'Research Engineer'],
    experienceLevel: 'Expert',
  },
  // u8 — Diego Fernández — Mobile
  {
    userId: 'u8',
    skills: [
      skill('React Native', 'Advanced'),
      skill('Flutter', 'Advanced'),
      skill('TypeScript', 'Intermediate'),
      skill('iOS', 'Intermediate'),
      skill('Android', 'Intermediate'),
      skill('Firebase', 'Advanced'),
    ],
    interests: [
      { id: 'healthcare', name: 'Healthcare' },
      { id: 'education', name: 'Education' },
      { id: 'fintech', name: 'FinTech' },
    ],
    experience: [
      { id: 'e22', type: 'project', title: 'Fitness Tracker App', description: 'Cross-platform fitness app with 150K downloads on iOS and Android.', date: '2023-06' },
      { id: 'e23', type: 'project', title: 'Language Learning App', description: 'Gamified mobile app for Spanish learners, 4.8 App Store rating.', date: '2022-11' },
      { id: 'e24', type: 'hackathon', title: 'HackIllinois 2023', description: 'Telemedicine app connecting rural patients with specialists.', date: '2023-03' },
    ],
    availability: { hoursPerWeek: 15, daysAvailable: ['Wed', 'Thu', 'Fri', 'Sat', 'Sun'], preferredTime: 'Evening' },
    preferredRoles: ['Mobile Developer'],
    experienceLevel: 'Advanced',
  },
  // u9 — Fatima Al-Hassan — Cybersecurity
  {
    userId: 'u9',
    skills: [
      skill('Cybersecurity', 'Advanced'),
      skill('Penetration Testing', 'Advanced'),
      skill('Python', 'Advanced'),
      skill('Network Security', 'Advanced'),
      skill('Cryptography', 'Advanced'),
      skill('Linux', 'Advanced'),
    ],
    interests: [
      { id: 'cybersecurity', name: 'Cybersecurity' },
      { id: 'fintech', name: 'FinTech' },
      { id: 'ai', name: 'AI' },
    ],
    experience: [
      { id: 'e25', type: 'internship', title: 'Security Engineer Intern — Cloudflare', description: 'DDoS mitigation system improvements.', date: '2023-06' },
      { id: 'e26', type: 'project', title: 'Vulnerability Scanner', description: 'Automated CVE scanner for web applications.', date: '2023-09' },
      { id: 'e27', type: 'hackathon', title: 'CSAW CTF 2023', description: 'Placed 3rd globally in cybersecurity competition.', date: '2023-09' },
    ],
    availability: { hoursPerWeek: 20, daysAvailable: ['Mon', 'Fri', 'Sat', 'Sun'], preferredTime: 'Evening' },
    preferredRoles: ['Security Engineer'],
    experienceLevel: 'Advanced',
  },
  // u10 — Kenji Nakamura — Backend/Rust
  {
    userId: 'u10',
    skills: [
      skill('Rust', 'Advanced'),
      skill('Go', 'Advanced'),
      skill('Backend Development', 'Advanced'),
      skill('PostgreSQL', 'Advanced'),
      skill('Redis', 'Advanced'),
      skill('System Design', 'Advanced'),
    ],
    interests: [
      { id: 'web-dev', name: 'Web Development' },
      { id: 'fintech', name: 'FinTech' },
      { id: 'ai', name: 'AI' },
    ],
    experience: [
      { id: 'e28', type: 'internship', title: 'Systems Engineer Intern — Cloudflare Workers', description: 'Implemented edge caching strategies reducing p99 latency by 35%.', date: '2023-05' },
      { id: 'e29', type: 'project', title: 'High-Performance HTTP Server', description: 'Rust-based server handling 500K req/s on a single core.', date: '2023-07' },
    ],
    availability: { hoursPerWeek: 25, daysAvailable: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], preferredTime: 'Morning' },
    preferredRoles: ['Backend Developer', 'Systems Engineer'],
    experienceLevel: 'Expert',
  },
  // u11 — Amara Diallo — Product/Engineering
  {
    userId: 'u11',
    skills: [
      skill('Product Management', 'Advanced'),
      skill('Python', 'Intermediate'),
      skill('SQL', 'Advanced'),
      skill('Data Analysis', 'Advanced'),
      skill('Agile', 'Advanced'),
      skill('React', 'Intermediate'),
    ],
    interests: [
      { id: 'ai', name: 'AI' },
      { id: 'education', name: 'Education' },
      { id: 'sustainability', name: 'Sustainability' },
    ],
    experience: [
      { id: 'e30', type: 'internship', title: 'APM Intern — Meta', description: 'Drove A/B tests on feed ranking, +4% engagement lift.', date: '2023-06' },
      { id: 'e31', type: 'hackathon', title: 'Y Combinator Hackathon', description: 'EdTech platform for personalized K-12 learning paths.', date: '2023-08' },
    ],
    availability: { hoursPerWeek: 20, daysAvailable: ['Mon', 'Tue', 'Wed', 'Thu'], preferredTime: 'Afternoon' },
    preferredRoles: ['Product Manager', 'Full Stack Developer'],
    experienceLevel: 'Intermediate',
  },
  // u12 — Noah Bergstrom — Robotics
  {
    userId: 'u12',
    skills: [
      skill('Robotics', 'Advanced'),
      skill('C++', 'Advanced'),
      skill('Python', 'Intermediate'),
      skill('ROS', 'Advanced'),
      skill('Computer Vision', 'Intermediate'),
      skill('Embedded Systems', 'Advanced'),
    ],
    interests: [
      { id: 'robotics', name: 'Robotics' },
      { id: 'ai', name: 'AI' },
      { id: 'hardware', name: 'Hardware/IoT' },
    ],
    experience: [
      { id: 'e32', type: 'project', title: 'Autonomous Navigation Robot', description: 'ROS-based robot navigating complex indoor environments autonomously.', date: '2023-09' },
      { id: 'e33', type: 'hackathon', title: 'RobotX 2023', description: 'Autonomous surface vehicle mission — 2nd place.', date: '2023-10' },
    ],
    availability: { hoursPerWeek: 15, daysAvailable: ['Mon', 'Wed', 'Fri'], preferredTime: 'Morning' },
    preferredRoles: ['Robotics Engineer', 'Embedded Systems Engineer'],
    experienceLevel: 'Advanced',
  },
  // u13 — Seo-Yeon Park — FinTech/Blockchain
  {
    userId: 'u13',
    skills: [
      skill('Solidity', 'Advanced'),
      skill('Blockchain', 'Advanced'),
      skill('TypeScript', 'Advanced'),
      skill('React', 'Intermediate'),
      skill('Node.js', 'Intermediate'),
      skill('Smart Contracts', 'Advanced'),
    ],
    interests: [
      { id: 'fintech', name: 'FinTech' },
      { id: 'web-dev', name: 'Web Development' },
      { id: 'ai', name: 'AI' },
    ],
    experience: [
      { id: 'e34', type: 'hackathon', title: 'ETHGlobal New York 2023', description: 'DeFi yield optimizer — won Best DeFi Protocol.', date: '2023-09' },
      { id: 'e35', type: 'project', title: 'NFT Marketplace', description: 'Fully decentralized NFT trading platform on Polygon.', date: '2023-06' },
    ],
    availability: { hoursPerWeek: 20, daysAvailable: ['Mon', 'Tue', 'Thu', 'Sat', 'Sun'], preferredTime: 'Evening' },
    preferredRoles: ['Blockchain Developer', 'Frontend Developer'],
    experienceLevel: 'Advanced',
  },
  // u14 — Tariq Hassan — Database
  {
    userId: 'u14',
    skills: [
      skill('PostgreSQL', 'Advanced'),
      skill('Database Design', 'Advanced'),
      skill('Redis', 'Advanced'),
      skill('SQL', 'Advanced'),
      skill('Python', 'Intermediate'),
      skill('Data Modeling', 'Advanced'),
      skill('AWS RDS', 'Intermediate'),
    ],
    interests: [
      { id: 'data-science', name: 'Data Science' },
      { id: 'fintech', name: 'FinTech' },
      { id: 'web-dev', name: 'Web Development' },
    ],
    experience: [
      { id: 'e36', type: 'internship', title: 'Database Engineer — Neon Tech', description: 'Worked on serverless Postgres performance optimizations.', date: '2023-06' },
      { id: 'e37', type: 'project', title: 'Distributed Cache System', description: 'Redis Cluster implementation handling 1M+ ops/sec.', date: '2023-08' },
    ],
    availability: { hoursPerWeek: 25, daysAvailable: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], preferredTime: 'Morning' },
    preferredRoles: ['Database Engineer', 'Backend Developer'],
    experienceLevel: 'Expert',
  },
  // u15 — Nadia Kowalski — AI Ethics
  {
    userId: 'u15',
    skills: [
      skill('Research', 'Advanced'),
      skill('Python', 'Intermediate'),
      skill('Data Analysis', 'Intermediate'),
      skill('Technical Writing', 'Advanced'),
      skill('Machine Learning', 'Intermediate'),
      skill('Ethics', 'Advanced'),
    ],
    interests: [
      { id: 'ai', name: 'AI' },
      { id: 'education', name: 'Education' },
      { id: 'sustainability', name: 'Sustainability' },
    ],
    experience: [
      { id: 'e38', type: 'project', title: 'AI Bias Audit Toolkit', description: 'Open-source library for detecting and mitigating bias in ML models.', date: '2023-07' },
      { id: 'e39', type: 'hackathon', title: 'AI Safety Camp 2023', description: 'Research on alignment in reward modeling.', date: '2023-08' },
    ],
    availability: { hoursPerWeek: 15, daysAvailable: ['Tue', 'Thu', 'Sat'], preferredTime: 'Afternoon' },
    preferredRoles: ['AI Researcher', 'Technical Writer'],
    experienceLevel: 'Intermediate',
  },
  // u17 — Zara Williams — Data Engineering
  {
    userId: 'u17',
    skills: [
      skill('Apache Spark', 'Advanced'),
      skill('Kafka', 'Advanced'),
      skill('Python', 'Advanced'),
      skill('SQL', 'Advanced'),
      skill('AWS', 'Intermediate'),
      skill('Data Pipelines', 'Advanced'),
      skill('Airflow', 'Intermediate'),
    ],
    interests: [
      { id: 'data-science', name: 'Data Science' },
      { id: 'fintech', name: 'FinTech' },
      { id: 'ai', name: 'AI' },
    ],
    experience: [
      { id: 'e40', type: 'internship', title: 'Data Engineer Intern — Databricks', description: 'Built streaming data pipelines for real-time analytics at petabyte scale.', date: '2023-05' },
      { id: 'e41', type: 'project', title: 'Real-time Event Streaming', description: 'Kafka + Spark pipeline processing 10M events/hour for IoT sensors.', date: '2023-09' },
    ],
    availability: { hoursPerWeek: 30, daysAvailable: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], preferredTime: 'Morning' },
    preferredRoles: ['Data Engineer'],
    experienceLevel: 'Advanced',
  },
  // u18 — Liam O'Brien — Creative/Frontend
  {
    userId: 'u18',
    skills: [
      skill('WebGL', 'Advanced'),
      skill('Three.js', 'Advanced'),
      skill('JavaScript', 'Advanced'),
      skill('Creative Coding', 'Advanced'),
      skill('React', 'Intermediate'),
      skill('CSS Animations', 'Advanced'),
    ],
    interests: [
      { id: 'web-dev', name: 'Web Development' },
      { id: 'education', name: 'Education' },
      { id: 'sustainability', name: 'Sustainability' },
    ],
    experience: [
      { id: 'e42', type: 'project', title: 'Interactive Data Visualization', description: 'WebGL-powered globe visualization of global climate data.', date: '2023-10' },
      { id: 'e43', type: 'hackathon', title: 'Climate Tech Hackathon', description: 'Built an immersive VR experience showing ocean acidification.', date: '2023-06' },
    ],
    availability: { hoursPerWeek: 20, daysAvailable: ['Mon', 'Wed', 'Fri', 'Sat', 'Sun'], preferredTime: 'Evening' },
    preferredRoles: ['Creative Developer', 'Frontend Developer'],
    experienceLevel: 'Intermediate',
  },
];

// ── Projects ─────────────────────────────────────────────────

export const SEED_PROJECTS: Project[] = [
  {
    id: 'p1',
    ownerId: 'u16',
    title: 'Student Dropout Risk Predictor',
    description: 'I want to build an AI-powered system that predicts student dropout risk using attendance and academic performance data. The system will analyze patterns in student behavior to identify at-risk students early and provide actionable insights to educators.',
    category: 'AI/ML',
    teamSize: 4,
    deadline: '2024-05-01',
    requiredAvailabilityHours: 20,
    manualSkills: [],
    status: 'analyzed',
    createdAt: '2024-01-28T00:00:00Z',
  },
  {
    id: 'p2',
    ownerId: 'u16',
    title: 'EcoTrack — Sustainability Dashboard',
    description: 'A platform that helps companies track, analyze, and report their carbon footprint using real-time data from IoT sensors and supply chain APIs. Includes AI-powered recommendations for reducing emissions.',
    category: 'Web App',
    teamSize: 3,
    deadline: '2024-06-01',
    requiredAvailabilityHours: 15,
    manualSkills: [],
    status: 'building',
    createdAt: '2024-01-20T00:00:00Z',
  },
  {
    id: 'p3',
    ownerId: 'u11',
    title: 'MediConnect — Telemedicine Platform',
    description: 'Mobile-first telemedicine app connecting rural patients with urban specialists. AI-powered symptom checker, real-time video consultations, and smart appointment scheduling.',
    category: 'Mobile App',
    teamSize: 5,
    deadline: '2024-07-01',
    requiredAvailabilityHours: 25,
    manualSkills: [],
    status: 'building',
    createdAt: '2024-01-18T00:00:00Z',
  },
  {
    id: 'p4',
    ownerId: 'u4',
    title: 'FinSight — AI Financial Advisor',
    description: 'An AI-powered personal finance advisor that analyzes spending patterns, predicts future expenses, and provides personalized investment recommendations based on risk profile and goals.',
    category: 'FinTech',
    teamSize: 4,
    deadline: '2024-08-01',
    requiredAvailabilityHours: 20,
    manualSkills: [],
    status: 'draft',
    createdAt: '2024-01-25T00:00:00Z',
  },
];
