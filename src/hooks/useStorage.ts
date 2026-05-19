import { useState, useEffect } from 'react';
import { Application, ApplicationStatus, HRUser, Job } from '@/types';

const JOBS_KEY = 'talentflow_jobs';
const APPLICATIONS_KEY = 'talentflow_applications';
const USER_KEY = 'talentflow_current_user';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // ignore
  }
  return fallback;
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

const DEFAULT_USERS: HRUser[] = [
  { id: 'u1', name: 'Alice Admin', email: 'alice@company.com', role: 'admin', avatar: 'AA' },
  { id: 'u2', name: 'Bob Recruiter', email: 'bob@company.com', role: 'recruiter', avatar: 'BR' },
  { id: 'u3', name: 'Carol Viewer', email: 'carol@company.com', role: 'viewer', avatar: 'CV' },
];

const SEED_JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Senior Frontend Engineer',
    department: 'engineering',
    location: 'Remote',
    type: 'full-time',
    status: 'active',
    description: 'Build amazing user interfaces with React and TypeScript.',
    salary: '$120,000 - $150,000',
    requirements: ['5+ years React', 'TypeScript', 'CSS expertise'],
    postedBy: 'u1',
    applicantCount: 3,
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
    description: 'Design intuitive product experiences.',
    salary: '$100,000 - $130,000',
    requirements: ['Figma', 'User research', '3+ years experience'],
    postedBy: 'u2',
    applicantCount: 2,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

const SEED_APPLICATIONS: Application[] = [
  {
    id: 'a1',
    jobId: 'j1',
    jobTitle: 'Senior Frontend Engineer',
    applicantName: 'Jane Doe',
    applicantEmail: 'jane@example.com',
    applicantPhone: '555-0100',
    resumeText: 'Experienced frontend developer with 6 years in React.',
    coverLetter: 'I am excited to apply for this position.',
    status: 'new',
    notes: '',
    appliedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'a2',
    jobId: 'j1',
    jobTitle: 'Senior Frontend Engineer',
    applicantName: 'John Smith',
    applicantEmail: 'john@example.com',
    applicantPhone: '555-0101',
    resumeText: 'Full-stack developer pivoting to frontend.',
    coverLetter: 'Looking forward to contributing to your team.',
    status: 'screening',
    notes: 'Strong portfolio.',
    appliedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'a3',
    jobId: 'j2',
    jobTitle: 'Product Designer',
    applicantName: 'Sara Lee',
    applicantEmail: 'sara@example.com',
    applicantPhone: '555-0102',
    resumeText: 'Designer with 4 years of product design experience.',
    coverLetter: 'Design is my passion.',
    status: 'interview',
    notes: 'Great Figma skills.',
    appliedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>(() => loadFromStorage(JOBS_KEY, SEED_JOBS));

  useEffect(() => { saveToStorage(JOBS_KEY, jobs); }, [jobs]);

  function addJob(data: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'applicantCount'>) {
    const now = new Date().toISOString();
    const job: Job = {
      ...data,
      id: `j${Date.now()}`,
      applicantCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    setJobs(prev => [job, ...prev]);
  }

  function updateJob(updated: Job) {
    setJobs(prev => prev.map(j => j.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : j));
  }

  function deleteJob(id: string) {
    setJobs(prev => prev.filter(j => j.id !== id));
  }

  return { jobs, addJob, updateJob, deleteJob };
}

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>(() =>
    loadFromStorage(APPLICATIONS_KEY, SEED_APPLICATIONS)
  );

  useEffect(() => { saveToStorage(APPLICATIONS_KEY, applications); }, [applications]);

  function addApplication(app: Application) {
    setApplications(prev => [app, ...prev]);
  }

  function updateApplication(updated: Application) {
    setApplications(prev =>
      prev.map(a => a.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : a)
    );
  }

  function updateStatus(id: string, status: ApplicationStatus) {
    setApplications(prev =>
      prev.map(a => a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a)
    );
  }

  function deleteApplication(id: string) {
    setApplications(prev => prev.filter(a => a.id !== id));
  }

  return { applications, addApplication, updateApplication, updateStatus, deleteApplication };
}

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<HRUser>(() =>
    loadFromStorage(USER_KEY, DEFAULT_USERS[0])
  );

  useEffect(() => { saveToStorage(USER_KEY, currentUser); }, [currentUser]);

  function switchUser(user: HRUser) {
    setCurrentUser(user);
  }

  return { currentUser, users: DEFAULT_USERS, switchUser };
}
