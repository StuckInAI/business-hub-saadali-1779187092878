import { Job, Application, HRUser, ApplicationStatus } from '@/types';

const JOBS_KEY = 'tf_jobs';
const APPS_KEY = 'tf_applications';
const USER_KEY = 'tf_current_user';

// ── Seed Data ──────────────────────────────────────────────────────────────

const DEFAULT_USERS: HRUser[] = [
  { id: 'u1', name: 'Alex Johnson', email: 'alex@company.com', role: 'admin', avatar: 'AJ' },
  { id: 'u2', name: 'Sam Rivera', email: 'sam@company.com', role: 'recruiter', avatar: 'SR' },
  { id: 'u3', name: 'Casey Lee', email: 'casey@company.com', role: 'viewer', avatar: 'CL' },
];

const DEFAULT_JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Senior Frontend Engineer',
    department: 'engineering',
    location: 'New York, NY',
    type: 'full-time',
    status: 'active',
    description: 'We are looking for a Senior Frontend Engineer to join our growing team.',
    salary: '$120,000 - $150,000',
    requirements: ['5+ years React experience', 'TypeScript proficiency', 'CSS/design skills'],
    postedBy: 'u1',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
    applicantCount: 12,
  },
  {
    id: 'j2',
    title: 'Product Designer',
    department: 'design',
    location: 'Remote',
    type: 'full-time',
    status: 'active',
    description: 'Join our design team to shape the future of our product.',
    salary: '$90,000 - $120,000',
    requirements: ['Figma expertise', '3+ years product design', 'UX research skills'],
    postedBy: 'u2',
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString(),
    applicantCount: 8,
  },
  {
    id: 'j3',
    title: 'Marketing Manager',
    department: 'marketing',
    location: 'San Francisco, CA',
    type: 'full-time',
    status: 'paused',
    description: 'Lead our marketing initiatives and grow our brand presence.',
    salary: '$95,000 - $115,000',
    requirements: ['5+ years marketing experience', 'B2B SaaS background', 'Data-driven mindset'],
    postedBy: 'u1',
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-25').toISOString(),
    applicantCount: 5,
  },
];

const DEFAULT_APPLICATIONS: Application[] = [
  {
    id: 'a1',
    jobId: 'j1',
    applicantName: 'Jordan Patel',
    applicantEmail: 'jordan@email.com',
    phone: '555-0101',
    resumeText: 'Experienced frontend developer with 6 years working with React and TypeScript.',
    coverLetter: 'I am excited to apply for this position...',
    status: 'interview' as ApplicationStatus,
    appliedAt: new Date('2024-01-18').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString(),
    notes: 'Strong candidate, schedule technical interview',
    rating: 4,
  },
  {
    id: 'a2',
    jobId: 'j1',
    applicantName: 'Morgan Wu',
    applicantEmail: 'morgan@email.com',
    phone: '555-0102',
    resumeText: 'Frontend engineer with expertise in React, Vue, and modern CSS.',
    coverLetter: 'Your company mission aligns with my values...',
    status: 'applied' as ApplicationStatus,
    appliedAt: new Date('2024-01-19').toISOString(),
    updatedAt: new Date('2024-01-19').toISOString(),
    notes: '',
    rating: 0,
  },
  {
    id: 'a3',
    jobId: 'j2',
    applicantName: 'Riley Chen',
    applicantEmail: 'riley@email.com',
    phone: '555-0103',
    resumeText: 'Product designer with 4 years creating intuitive user experiences.',
    coverLetter: 'I have been following your product journey...',
    status: 'screening' as ApplicationStatus,
    appliedAt: new Date('2024-01-22').toISOString(),
    updatedAt: new Date('2024-01-23').toISOString(),
    notes: 'Good portfolio',
    rating: 3,
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// ── Public API ─────────────────────────────────────────────────────────────

export function getUsers(): HRUser[] {
  return DEFAULT_USERS;
}

export function getJobs(): Job[] {
  return read<Job[]>(JOBS_KEY, DEFAULT_JOBS);
}

export function saveJobs(jobs: Job[]): void {
  write(JOBS_KEY, jobs);
}

export function getApplications(): Application[] {
  return read<Application[]>(APPS_KEY, DEFAULT_APPLICATIONS);
}

export function saveApplications(apps: Application[]): void {
  write(APPS_KEY, apps);
}

export function getCurrentUserId(): string {
  return read<string>(USER_KEY, DEFAULT_USERS[0].id);
}

export function saveCurrentUserId(id: string): void {
  write(USER_KEY, id);
}
