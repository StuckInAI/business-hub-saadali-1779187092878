import { Job, Application, HRUser } from '@/types';

const KEYS = {
  jobs: 'tf_jobs',
  applications: 'tf_applications',
  currentUserId: 'tf_current_user_id',
};

// ---------- generic helpers ----------

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// ---------- seed data ----------

export const SEED_USERS: HRUser[] = [
  { id: 'u1', name: 'Alex Johnson', role: 'admin', avatar: 'AJ' },
  { id: 'u2', name: 'Sam Rivera', role: 'recruiter', avatar: 'SR' },
  { id: 'u3', name: 'Casey Lee', role: 'viewer', avatar: 'CL' },
];

const SEED_JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Senior Frontend Engineer',
    department: 'engineering',
    location: 'New York, NY',
    type: 'full-time',
    status: 'active',
    description: 'Build world-class UIs.',
    salary: '$130,000 - $160,000',
    requirements: ['5+ years React', 'TypeScript', 'CSS-in-JS'],
    postedBy: 'u1',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
    applicantCount: 0,
  },
  {
    id: 'j2',
    title: 'Product Designer',
    department: 'design',
    location: 'Remote',
    type: 'full-time',
    status: 'active',
    description: 'Shape our product experience.',
    salary: '$110,000 - $140,000',
    requirements: ['Figma', '3+ years product design'],
    postedBy: 'u2',
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString(),
    applicantCount: 0,
  },
];

const SEED_APPLICATIONS: Application[] = [
  {
    id: 'a1',
    jobId: 'j1',
    name: 'Taylor Smith',
    email: 'taylor@example.com',
    phone: '555-0100',
    resumeUrl: '',
    coverLetter: 'Excited to join the team!',
    status: 'review',
    appliedAt: new Date('2024-01-22').toISOString(),
    updatedAt: new Date('2024-01-22').toISOString(),
    notes: '',
    rating: 4,
  },
  {
    id: 'a2',
    jobId: 'j1',
    name: 'Jordan Patel',
    email: 'jordan@example.com',
    phone: '555-0101',
    resumeUrl: '',
    coverLetter: 'Long-time React developer.',
    status: 'interview',
    appliedAt: new Date('2024-01-23').toISOString(),
    updatedAt: new Date('2024-01-24').toISOString(),
    notes: 'Strong candidate',
    rating: 5,
  },
  {
    id: 'a3',
    jobId: 'j2',
    name: 'Morgan Wu',
    email: 'morgan@example.com',
    phone: '555-0102',
    resumeUrl: '',
    coverLetter: 'Passionate about design systems.',
    status: 'applied',
    appliedAt: new Date('2024-01-25').toISOString(),
    updatedAt: new Date('2024-01-25').toISOString(),
    notes: '',
    rating: 3,
  },
];

// ---------- init ----------

export function initStorage(): void {
  if (!localStorage.getItem(KEYS.jobs)) {
    save(KEYS.jobs, SEED_JOBS);
  }
  if (!localStorage.getItem(KEYS.applications)) {
    save(KEYS.applications, SEED_APPLICATIONS);
  }
  if (!localStorage.getItem(KEYS.currentUserId)) {
    save(KEYS.currentUserId, SEED_USERS[0].id);
  }
}

// ---------- jobs ----------

export function getJobs(): Job[] {
  return load<Job[]>(KEYS.jobs, []);
}

export function saveJobs(jobs: Job[]): void {
  save(KEYS.jobs, jobs);
}

// ---------- applications ----------

export function getApplications(): Application[] {
  return load<Application[]>(KEYS.applications, []);
}

export function saveApplications(apps: Application[]): void {
  save(KEYS.applications, apps);
}

// ---------- current user ----------

export function getCurrentUserId(): string {
  return load<string>(KEYS.currentUserId, SEED_USERS[0].id);
}

export function saveCurrentUserId(id: string): void {
  save(KEYS.currentUserId, id);
}
