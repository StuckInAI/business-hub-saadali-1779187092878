import { useState, useEffect } from 'react';
import { Job, Application, HRUser } from '@/types';

// ─── seed data ────────────────────────────────────────────────────────────────

const SEED_USERS: HRUser[] = [
  { id: 'u1', name: 'Alex Johnson', email: 'alex@talentflow.io', role: 'admin', avatar: 'AJ' },
  { id: 'u2', name: 'Maria Garcia', email: 'maria@talentflow.io', role: 'recruiter', avatar: 'MG' },
  { id: 'u3', name: 'Sam Lee', email: 'sam@talentflow.io', role: 'viewer', avatar: 'SL' },
];

const SEED_JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Senior Frontend Engineer',
    department: 'engineering',
    location: 'Remote',
    type: 'full-time',
    status: 'active',
    description: 'Build next-generation web applications with React and TypeScript.',
    requirements: ['5+ years React experience', 'TypeScript proficiency', 'CSS expertise'],
    salary: '$120,000 - $160,000',
    postedBy: 'u1',
    applicantCount: 0,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'j2',
    title: 'Product Designer',
    department: 'design',
    location: 'New York, NY',
    type: 'full-time',
    status: 'active',
    description: 'Shape the look and feel of our products from ideation to launch.',
    requirements: ['Figma mastery', '3+ years product design', 'User research skills'],
    salary: '$95,000 - $130,000',
    postedBy: 'u2',
    applicantCount: 0,
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
  {
    id: 'j3',
    title: 'Marketing Manager',
    department: 'marketing',
    location: 'San Francisco, CA',
    type: 'full-time',
    status: 'paused',
    description: 'Lead our go-to-market strategy and grow our brand presence.',
    requirements: ['5+ years marketing', 'B2B SaaS experience', 'Data-driven mindset'],
    salary: '$100,000 - $140,000',
    postedBy: 'u1',
    applicantCount: 0,
    createdAt: new Date(Date.now() - 21 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 21 * 86400000).toISOString(),
  },
];

const SEED_APPLICATIONS: Application[] = [
  {
    id: 'a1',
    jobId: 'j1',
    applicantName: 'Jordan Smith',
    applicantEmail: 'jordan@example.com',
    applicantPhone: '+1 555 100 2000',
    coverLetter: 'I am very excited to apply for this role...',
    resumeUrl: '',
    status: 'screening',
    appliedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    notes: '',
  },
  {
    id: 'a2',
    jobId: 'j1',
    applicantName: 'Taylor Brown',
    applicantEmail: 'taylor@example.com',
    applicantPhone: '+1 555 200 3000',
    coverLetter: 'With 6 years of React experience...',
    resumeUrl: '',
    status: 'interview',
    appliedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    notes: 'Strong candidate',
  },
  {
    id: 'a3',
    jobId: 'j2',
    applicantName: 'Casey Williams',
    applicantEmail: 'casey@example.com',
    applicantPhone: '',
    coverLetter: 'I have been designing digital products for 4 years...',
    resumeUrl: '',
    status: 'new',
    appliedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    notes: '',
  },
];

// ─── helpers ──────────────────────────────────────────────────────────────────

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full / private browsing — ignore
  }
}

function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ─── useJobs ──────────────────────────────────────────────────────────────────

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>(() => load('tf_jobs', SEED_JOBS));

  useEffect(() => { save('tf_jobs', jobs); }, [jobs]);

  function addJob(data: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'applicantCount'>) {
    const now = new Date().toISOString();
    const job: Job = { ...data, id: uid(), applicantCount: 0, createdAt: now, updatedAt: now };
    setJobs(prev => [job, ...prev]);
    return job;
  }

  function updateJob(id: string, patch: Partial<Job>) {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, ...patch, updatedAt: new Date().toISOString() } : j));
  }

  function deleteJob(id: string) {
    setJobs(prev => prev.filter(j => j.id !== id));
  }

  return { jobs, addJob, updateJob, deleteJob };
}

// ─── useApplications ──────────────────────────────────────────────────────────

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>(() => load('tf_applications', SEED_APPLICATIONS));

  useEffect(() => { save('tf_applications', applications); }, [applications]);

  function addApplication(data: Omit<Application, 'id'>) {
    const application: Application = { ...data, id: uid() };
    setApplications(prev => [application, ...prev]);
    return application;
  }

  function updateApplicationStatus(id: string, status: Application['status']) {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }

  function updateApplication(id: string, patch: Partial<Application>) {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, ...patch } : a));
  }

  function deleteApplication(id: string) {
    setApplications(prev => prev.filter(a => a.id !== id));
  }

  return { applications, addApplication, updateApplicationStatus, updateApplication, deleteApplication };
}

// ─── useCurrentUser ───────────────────────────────────────────────────────────

export function useCurrentUser() {
  const [users] = useState<HRUser[]>(SEED_USERS);
  const [currentUser, setCurrentUser] = useState<HRUser>(() => {
    const saved = load<string | null>('tf_current_user', null);
    return SEED_USERS.find(u => u.id === saved) ?? SEED_USERS[0];
  });

  function switchUser(user: HRUser) {
    setCurrentUser(user);
    save('tf_current_user', user.id);
  }

  return { currentUser, users, switchUser };
}
