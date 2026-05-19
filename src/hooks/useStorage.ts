import { useState, useEffect, useCallback } from 'react';
import { Job, Application, HRUser, ApplicationStatus } from '@/types';

function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

// --- Seed data ---

const SEED_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Frontend Engineer',
    department: 'engineering',
    location: 'New York, NY',
    type: 'full-time',
    status: 'active',
    description: 'We are looking for a Senior Frontend Engineer to join our team.',
    requirements: ['5+ years experience', 'React proficiency', 'TypeScript'],
    salary: '$120,000 - $150,000',
    postedBy: 'user-1',
    applicantCount: 0,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'job-2',
    title: 'Product Designer',
    department: 'design',
    location: 'Remote',
    type: 'full-time',
    status: 'active',
    description: 'We are looking for a Product Designer to join our growing team.',
    requirements: ['3+ years experience', 'Figma', 'User research'],
    salary: '$90,000 - $110,000',
    postedBy: 'user-1',
    applicantCount: 0,
    createdAt: new Date('2024-01-05').toISOString(),
    updatedAt: new Date('2024-01-05').toISOString(),
  },
];

const SEED_USERS: HRUser[] = [
  { id: 'user-1', name: 'Alice Johnson', role: 'admin', avatar: 'AJ', email: 'alice@company.com' },
  { id: 'user-2', name: 'Bob Smith', role: 'recruiter', avatar: 'BS', email: 'bob@company.com' },
  { id: 'user-3', name: 'Carol White', role: 'viewer', avatar: 'CW', email: 'carol@company.com' },
];

// --- Jobs hook ---

export function useJobs() {
  const [jobs, setJobsState] = useState<Job[]>(() => getItem<Job[]>('jobs', SEED_JOBS));

  const persist = useCallback((next: Job[]) => {
    setJobsState(next);
    setItem('jobs', next);
  }, []);

  const addJob = useCallback((data: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'applicantCount'>) => {
    const job: Job = {
      ...data,
      id: `job-${Date.now()}`,
      applicantCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    persist([...jobs, job]);
  }, [jobs, persist]);

  const updateJob = useCallback((updated: Job) => {
    persist(jobs.map(j => j.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : j));
  }, [jobs, persist]);

  const deleteJob = useCallback((id: string) => {
    persist(jobs.filter(j => j.id !== id));
  }, [jobs, persist]);

  return { jobs, addJob, updateJob, deleteJob };
}

// --- Applications hook ---

export function useApplications() {
  const [applications, setApplicationsState] = useState<Application[]>(() =>
    getItem<Application[]>('applications', [])
  );

  const persist = useCallback((next: Application[]) => {
    setApplicationsState(next);
    setItem('applications', next);
  }, []);

  const addApplication = useCallback((app: Application) => {
    persist([...applications, app]);
  }, [applications, persist]);

  const updateApplication = useCallback((updated: Application) => {
    persist(applications.map(a => a.id === updated.id ? updated : a));
  }, [applications, persist]);

  const updateStatus = useCallback((id: string, status: ApplicationStatus) => {
    persist(applications.map(a => a.id === id ? { ...a, status } : a));
  }, [applications, persist]);

  const deleteApplication = useCallback((id: string) => {
    persist(applications.filter(a => a.id !== id));
  }, [applications, persist]);

  return { applications, addApplication, updateApplication, updateStatus, deleteApplication };
}

// --- Current user hook ---

export function useCurrentUser() {
  const [users] = useState<HRUser[]>(SEED_USERS);
  const [currentUser, setCurrentUser] = useState<HRUser>(() => {
    const stored = getItem<HRUser | null>('currentUser', null);
    if (stored && SEED_USERS.find(u => u.id === stored.id)) return stored;
    return SEED_USERS[0];
  });

  const switchUser = useCallback((user: HRUser) => {
    setCurrentUser(user);
    setItem('currentUser', user);
  }, []);

  return { currentUser, users, switchUser };
}
