import { useState, useEffect } from 'react';
import { HRUser, Job, Application } from '@/types';

function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

const DEFAULT_USERS: HRUser[] = [
  { id: 'u1', name: 'Alice Admin', email: 'alice@company.com', role: 'admin', avatar: 'AA' },
  { id: 'u2', name: 'Bob Recruiter', email: 'bob@company.com', role: 'recruiter', avatar: 'BR' },
  { id: 'u3', name: 'Carol Viewer', email: 'carol@company.com', role: 'viewer', avatar: 'CV' },
];

const DEFAULT_JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Senior Frontend Engineer',
    department: 'engineering',
    location: 'New York, NY',
    type: 'full-time',
    status: 'active',
    description: 'We are looking for a Senior Frontend Engineer to join our team.',
    salary: '$120,000 - $150,000',
    requirements: ['5+ years experience', 'React proficiency', 'TypeScript'],
    postedBy: 'u1',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    applicantCount: 3,
  },
  {
    id: 'j2',
    title: 'Product Designer',
    department: 'design',
    location: 'Remote',
    type: 'full-time',
    status: 'active',
    description: 'Join our design team to craft beautiful user experiences.',
    salary: '$90,000 - $120,000',
    requirements: ['3+ years experience', 'Figma', 'User research'],
    postedBy: 'u2',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    applicantCount: 0,
  },
];

const DEFAULT_APPLICATIONS: Application[] = [
  {
    id: 'a1',
    jobId: 'j1',
    jobTitle: 'Senior Frontend Engineer',
    applicantName: 'Jane Smith',
    applicantEmail: 'jane@example.com',
    applicantPhone: '555-0101',
    resumeText: 'Experienced frontend engineer with 6 years in React.',
    coverLetter: 'I am excited to apply for this role.',
    status: 'new',
    notes: '',
    rating: 0,
    appliedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'a2',
    jobId: 'j1',
    jobTitle: 'Senior Frontend Engineer',
    applicantName: 'John Doe',
    applicantEmail: 'john@example.com',
    applicantPhone: '555-0102',
    resumeText: 'Full-stack developer with strong TypeScript skills.',
    coverLetter: 'I would love to join your team.',
    status: 'screening',
    notes: 'Strong candidate',
    rating: 4,
    appliedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'a3',
    jobId: 'j1',
    jobTitle: 'Senior Frontend Engineer',
    applicantName: 'Emily Chen',
    applicantEmail: 'emily@example.com',
    applicantPhone: '555-0103',
    resumeText: 'Frontend specialist with React and Vue experience.',
    coverLetter: 'This role aligns perfectly with my background.',
    status: 'interview',
    notes: 'Scheduled for technical interview',
    rating: 5,
    appliedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

export function useJobs() {
  const [jobs, setJobsState] = useState<Job[]>(() => getItem('hr_jobs', DEFAULT_JOBS));

  const setJobs = (updated: Job[]) => {
    setJobsState(updated);
    setItem('hr_jobs', updated);
  };

  const addJob = (job: Job) => setJobs([...jobs, job]);
  const updateJob = (job: Job) => setJobs(jobs.map(j => j.id === job.id ? job : j));
  const deleteJob = (id: string) => setJobs(jobs.filter(j => j.id !== id));

  return { jobs, addJob, updateJob, deleteJob };
}

export function useApplications() {
  const [applications, setApplicationsState] = useState<Application[]>(() =>
    getItem('hr_applications', DEFAULT_APPLICATIONS)
  );

  const setApplications = (updated: Application[]) => {
    setApplicationsState(updated);
    setItem('hr_applications', updated);
  };

  const addApplication = (app: Application) => setApplications([...applications, app]);
  const updateApplication = (app: Application) =>
    setApplications(applications.map(a => a.id === app.id ? app : a));
  const deleteApplication = (id: string) =>
    setApplications(applications.filter(a => a.id !== id));

  return { applications, addApplication, updateApplication, deleteApplication };
}

export function useCurrentUser() {
  const [users] = useState<HRUser[]>(DEFAULT_USERS);
  const [currentUser, setCurrentUserState] = useState<HRUser>(() => {
    const stored = getItem<string | null>('hr_current_user_id', null);
    return DEFAULT_USERS.find(u => u.id === stored) ?? DEFAULT_USERS[0];
  });

  const switchUser = (user: HRUser) => {
    setCurrentUserState(user);
    setItem('hr_current_user_id', user.id);
  };

  return { currentUser, users, switchUser };
}
