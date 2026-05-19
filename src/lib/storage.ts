import { Job, Application, PipelineStage, HRUser, Comment, Message } from '@/types';

const KEYS = {
  jobs: 'tf_jobs',
  applications: 'tf_applications',
  stages: 'tf_stages',
  users: 'tf_users',
  currentUser: 'tf_current_user',
};

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

function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// --- Default Data ---

const defaultStages: PipelineStage[] = [
  { id: 'applied', label: 'Applied', color: '#6366f1', order: 0 },
  { id: 'screening', label: 'Screening', color: '#f59e0b', order: 1 },
  { id: 'interview', label: 'Interview', color: '#3b82f6', order: 2 },
  { id: 'offer', label: 'Offer', color: '#8b5cf6', order: 3 },
  { id: 'hired', label: 'Hired', color: '#10b981', order: 4 },
  { id: 'rejected', label: 'Rejected', color: '#ef4444', order: 5 },
];

const defaultUsers: HRUser[] = [
  { id: 'u1', name: 'Sarah Johnson', email: 'admin@talentflow.com', role: 'admin', avatar: 'SJ' },
  { id: 'u2', name: 'Mike Chen', email: 'recruiter@talentflow.com', role: 'recruiter', avatar: 'MC' },
  { id: 'u3', name: 'Lisa Park', email: 'viewer@talentflow.com', role: 'viewer', avatar: 'LP' },
];

const defaultJobs: Job[] = [
  {
    id: 'j1',
    title: 'Senior Frontend Engineer',
    department: 'engineering',
    location: 'San Francisco, CA',
    type: 'full-time',
    status: 'active',
    description: 'We are looking for a Senior Frontend Engineer to join our team and build world-class user experiences.',
    requirements: ['5+ years React experience', 'TypeScript proficiency', 'Experience with modern build tools'],
    salary: '$150,000 - $180,000',
    postedBy: 'u1',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    applicantCount: 3,
  },
  {
    id: 'j2',
    title: 'Product Designer',
    department: 'design',
    location: 'New York, NY',
    type: 'full-time',
    status: 'active',
    description: 'Join our design team to create intuitive and beautiful product experiences.',
    requirements: ['3+ years product design', 'Figma expert', 'User research experience'],
    salary: '$120,000 - $145,000',
    postedBy: 'u2',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    applicantCount: 2,
  },
  {
    id: 'j3',
    title: 'Marketing Manager',
    department: 'marketing',
    location: 'Remote',
    type: 'remote',
    status: 'active',
    description: 'Lead our marketing efforts and grow our brand presence across all channels.',
    requirements: ['5+ years marketing experience', 'B2B SaaS background', 'Strong analytical skills'],
    salary: '$110,000 - $130,000',
    postedBy: 'u1',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    applicantCount: 2,
  },
];

const defaultApplications: Application[] = [
  {
    id: 'a1', jobId: 'j1', applicantName: 'Alex Rivera', applicantEmail: 'alex@example.com',
    applicantPhone: '+1-555-0101', resumeUrl: '#', resumeName: 'alex_rivera_cv.pdf',
    coverLetter: 'I am very excited about this opportunity...', portfolioUrl: 'https://alexrivera.dev',
    yearsOfExperience: 6, stageId: 'interview', status: 'pending',
    appliedAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    comments: [{ id: 'c1', applicationId: 'a1', authorId: 'u2', authorName: 'Mike Chen', content: 'Strong candidate, portfolio is impressive.', createdAt: new Date(Date.now() - 4 * 86400000).toISOString() }],
    messages: [{ id: 'm1', applicationId: 'a1', fromHR: true, senderName: 'Mike Chen', content: 'Hi Alex, we would like to schedule a technical interview. Are you available next week?', sentAt: new Date(Date.now() - 3 * 86400000).toISOString() }],
  },
  {
    id: 'a2', jobId: 'j1', applicantName: 'Jordan Lee', applicantEmail: 'jordan@example.com',
    applicantPhone: '+1-555-0102', resumeUrl: '#', resumeName: 'jordan_lee_cv.pdf',
    yearsOfExperience: 4, stageId: 'screening', status: 'pending',
    appliedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    comments: [], messages: [],
  },
  {
    id: 'a3', jobId: 'j1', applicantName: 'Sam Williams', applicantEmail: 'sam@example.com',
    applicantPhone: '+1-555-0103', resumeUrl: '#', resumeName: 'sam_williams_cv.pdf',
    yearsOfExperience: 7, stageId: 'offer', status: 'approved',
    appliedAt: new Date(Date.now() - 9 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    comments: [], messages: [],
  },
  {
    id: 'a4', jobId: 'j2', applicantName: 'Taylor Morgan', applicantEmail: 'taylor@example.com',
    applicantPhone: '+1-555-0104', resumeUrl: '#', resumeName: 'taylor_morgan_cv.pdf',
    yearsOfExperience: 4, stageId: 'applied', status: 'pending',
    appliedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    comments: [], messages: [],
  },
  {
    id: 'a5', jobId: 'j2', applicantName: 'Casey Brown', applicantEmail: 'casey@example.com',
    applicantPhone: '+1-555-0105', resumeUrl: '#', resumeName: 'casey_brown_cv.pdf',
    yearsOfExperience: 2, stageId: 'rejected', status: 'rejected',
    appliedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    comments: [{ id: 'c2', applicationId: 'a5', authorId: 'u1', authorName: 'Sarah Johnson', content: 'Not enough experience for this role.', createdAt: new Date(Date.now() - 2 * 86400000).toISOString() }],
    messages: [],
  },
  {
    id: 'a6', jobId: 'j3', applicantName: 'Morgan Davis', applicantEmail: 'morgan@example.com',
    applicantPhone: '+1-555-0106', resumeUrl: '#', resumeName: 'morgan_davis_cv.pdf',
    yearsOfExperience: 6, stageId: 'screening', status: 'pending',
    appliedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    comments: [], messages: [],
  },
  {
    id: 'a7', jobId: 'j3', applicantName: 'Riley Thompson', applicantEmail: 'riley@example.com',
    applicantPhone: '+1-555-0107', resumeUrl: '#', resumeName: 'riley_thompson_cv.pdf',
    yearsOfExperience: 8, stageId: 'hired', status: 'approved',
    appliedAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    comments: [], messages: [],
  },
];

// --- Initialization ---

export function initStorage(): void {
  if (!localStorage.getItem(KEYS.stages)) save(KEYS.stages, defaultStages);
  if (!localStorage.getItem(KEYS.users)) save(KEYS.users, defaultUsers);
  if (!localStorage.getItem(KEYS.jobs)) save(KEYS.jobs, defaultJobs);
  if (!localStorage.getItem(KEYS.applications)) save(KEYS.applications, defaultApplications);
  if (!localStorage.getItem(KEYS.currentUser)) save(KEYS.currentUser, defaultUsers[0]);
}

// --- Jobs ---

export function getJobs(): Job[] {
  return load<Job[]>(KEYS.jobs, []);
}

export function saveJob(job: Job): void {
  const jobs = getJobs();
  const idx = jobs.findIndex(j => j.id === job.id);
  if (idx >= 0) jobs[idx] = job;
  else jobs.push(job);
  save(KEYS.jobs, jobs);
}

export function deleteJob(id: string): void {
  const jobs = getJobs().filter(j => j.id !== id);
  save(KEYS.jobs, jobs);
}

export function createJob(data: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'applicantCount'>): Job {
  const job: Job = { ...data, id: generateId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), applicantCount: 0 };
  const jobs = getJobs();
  jobs.push(job);
  save(KEYS.jobs, jobs);
  return job;
}

// --- Applications ---

export function getApplications(): Application[] {
  return load<Application[]>(KEYS.applications, []);
}

export function saveApplication(app: Application): void {
  const apps = getApplications();
  const idx = apps.findIndex(a => a.id === app.id);
  if (idx >= 0) apps[idx] = app;
  else apps.push(app);
  save(KEYS.applications, apps);
  // Update job applicant count
  const jobs = getJobs();
  const jobIdx = jobs.findIndex(j => j.id === app.jobId);
  if (jobIdx >= 0) {
    jobs[jobIdx].applicantCount = apps.filter(a => a.jobId === app.jobId).length;
    save(KEYS.jobs, jobs);
  }
}

export function createApplication(data: Omit<Application, 'id' | 'appliedAt' | 'updatedAt' | 'comments' | 'messages' | 'status' | 'stageId'>): Application {
  const app: Application = { ...data, id: generateId(), stageId: 'applied', status: 'pending', appliedAt: new Date().toISOString(), updatedAt: new Date().toISOString(), comments: [], messages: [] };
  saveApplication(app);
  return app;
}

export function addComment(applicationId: string, author: HRUser, content: string): Comment {
  const apps = getApplications();
  const idx = apps.findIndex(a => a.id === applicationId);
  if (idx < 0) throw new Error('Application not found');
  const comment: Comment = { id: generateId(), applicationId, authorId: author.id, authorName: author.name, content, createdAt: new Date().toISOString() };
  apps[idx].comments.push(comment);
  apps[idx].updatedAt = new Date().toISOString();
  save(KEYS.applications, apps);
  return comment;
}

export function addMessage(applicationId: string, senderName: string, content: string, fromHR: boolean): Message {
  const apps = getApplications();
  const idx = apps.findIndex(a => a.id === applicationId);
  if (idx < 0) throw new Error('Application not found');
  const msg: Message = { id: generateId(), applicationId, fromHR, senderName, content, sentAt: new Date().toISOString() };
  apps[idx].messages.push(msg);
  apps[idx].updatedAt = new Date().toISOString();
  save(KEYS.applications, apps);
  return msg;
}

// --- Stages ---

export function getStages(): PipelineStage[] {
  return load<PipelineStage[]>(KEYS.stages, []).sort((a, b) => a.order - b.order);
}

export function saveStages(stages: PipelineStage[]): void {
  save(KEYS.stages, stages);
}

// --- Users ---

export function getUsers(): HRUser[] {
  return load<HRUser[]>(KEYS.users, []);
}

export function getCurrentUser(): HRUser {
  return load<HRUser>(KEYS.currentUser, defaultUsers[0]);
}

export function setCurrentUser(user: HRUser): void {
  save(KEYS.currentUser, user);
}

export function generateIdExport(): string {
  return generateId();
}
