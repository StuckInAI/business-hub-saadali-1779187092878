import { Job, Application, HRUser } from '@/types';

const KEYS = {
  jobs: 'tf_jobs',
  applications: 'tf_applications',
  currentUser: 'tf_current_user',
};

const SEED_USERS: HRUser[] = [
  { id: 'u1', name: 'Alice Admin', role: 'admin', avatar: 'AA', email: 'alice@company.com' },
  { id: 'u2', name: 'Bob Recruiter', role: 'recruiter', avatar: 'BR', email: 'bob@company.com' },
  { id: 'u3', name: 'Carol Viewer', role: 'viewer', avatar: 'CV', email: 'carol@company.com' },
];

const SEED_JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Senior Frontend Engineer',
    department: 'engineering',
    location: 'San Francisco, CA',
    type: 'full-time',
    status: 'active',
    description: 'We are looking for a Senior Frontend Engineer to join our growing team. You will work on building beautiful, performant user interfaces using React and TypeScript.',
    salary: '$130,000 - $160,000',
    requirements: ['5+ years of React experience', 'TypeScript proficiency', 'Experience with CSS-in-JS or CSS Modules', 'Strong understanding of web performance'],
    postedBy: 'Alice Admin',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    applicantCount: 0,
  },
  {
    id: 'j2',
    title: 'Product Designer',
    department: 'design',
    location: 'Remote',
    type: 'full-time',
    status: 'active',
    description: 'Join our design team to craft exceptional user experiences. You will collaborate closely with product and engineering to ship high-quality features.',
    salary: '$110,000 - $140,000',
    requirements: ['3+ years product design experience', 'Figma expertise', 'Strong portfolio', 'Experience with design systems'],
    postedBy: 'Alice Admin',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    applicantCount: 0,
  },
  {
    id: 'j3',
    title: 'Marketing Manager',
    department: 'marketing',
    location: 'New York, NY',
    type: 'full-time',
    status: 'active',
    description: 'Drive our marketing strategy and campaigns. You will own the full marketing funnel and collaborate with sales to drive revenue growth.',
    salary: '$90,000 - $115,000',
    requirements: ['5+ years marketing experience', 'B2B SaaS background', 'Data-driven mindset', 'Experience with HubSpot or similar'],
    postedBy: 'Bob Recruiter',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    applicantCount: 0,
  },
];

const SEED_APPLICATIONS: Application[] = [
  {
    id: 'a1',
    jobId: 'j1',
    jobTitle: 'Senior Frontend Engineer',
    applicantName: 'David Chen',
    applicantEmail: 'david.chen@email.com',
    applicantPhone: '+1 (415) 555-0101',
    coverLetter: 'I am excited to apply for the Senior Frontend Engineer position. With 6 years of React experience and a deep passion for performance optimization, I believe I would be a great fit for your team.',
    resumeUrl: '',
    status: 'interview',
    appliedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    notes: 'Strong candidate, excellent portfolio',
  },
  {
    id: 'a2',
    jobId: 'j1',
    jobTitle: 'Senior Frontend Engineer',
    applicantName: 'Sarah Johnson',
    applicantEmail: 'sarah.j@email.com',
    applicantPhone: '+1 (628) 555-0202',
    coverLetter: 'As a TypeScript specialist with 5 years of experience building large-scale React applications, I am thrilled to apply for this role.',
    resumeUrl: '',
    status: 'screening',
    appliedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    notes: '',
  },
  {
    id: 'a3',
    jobId: 'j2',
    jobTitle: 'Product Designer',
    applicantName: 'Maria Garcia',
    applicantEmail: 'maria.g@email.com',
    applicantPhone: '+1 (212) 555-0303',
    coverLetter: 'I am a product designer with 4 years of experience working at fast-paced startups. I love solving complex UX problems through research and iteration.',
    resumeUrl: '',
    status: 'offer',
    appliedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    notes: 'Outstanding portfolio, team loved her presentation',
  },
  {
    id: 'a4',
    jobId: 'j3',
    jobTitle: 'Marketing Manager',
    applicantName: 'James Wilson',
    applicantEmail: 'j.wilson@email.com',
    applicantPhone: '+1 (646) 555-0404',
    coverLetter: 'With 7 years in B2B SaaS marketing, I have consistently driven pipeline growth through data-driven campaigns.',
    resumeUrl: '',
    status: 'applied',
    appliedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    notes: '',
  },
];

function parse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

export function getJobs(): Job[] {
  return parse(localStorage.getItem(KEYS.jobs), SEED_JOBS);
}

export function saveJobs(jobs: Job[]): void {
  localStorage.setItem(KEYS.jobs, JSON.stringify(jobs));
}

export function getApplications(): Application[] {
  return parse(localStorage.getItem(KEYS.applications), SEED_APPLICATIONS);
}

export function saveApplications(applications: Application[]): void {
  localStorage.setItem(KEYS.applications, JSON.stringify(applications));
}

export function getUsers(): HRUser[] {
  return SEED_USERS;
}

export function getCurrentUserId(): string {
  return localStorage.getItem(KEYS.currentUser) ?? SEED_USERS[0].id;
}

export function saveCurrentUserId(id: string): void {
  localStorage.setItem(KEYS.currentUser, id);
}
