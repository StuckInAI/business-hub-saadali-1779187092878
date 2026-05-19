// ── Enums / union types ────────────────────────────────────────────────────

export type UserRole = 'admin' | 'recruiter' | 'viewer';

export type Department =
  | 'engineering'
  | 'design'
  | 'marketing'
  | 'sales'
  | 'hr'
  | 'finance'
  | 'operations'
  | 'product';

export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';

export type JobStatus = 'active' | 'paused' | 'closed';

export type ApplicationStatus =
  | 'applied'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'hired'
  | 'rejected';

// ── Models ─────────────────────────────────────────────────────────────────

export interface HRUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface Job {
  id: string;
  title: string;
  department: Department;
  location: string;
  type: JobType;
  status: JobStatus;
  description: string;
  salary: string;
  requirements: string[];
  postedBy: string;
  createdAt: string;
  updatedAt: string;
  applicantCount: number;
}

export interface Application {
  id: string;
  jobId: string;
  applicantName: string;
  applicantEmail: string;
  phone: string;
  resumeText: string;
  coverLetter: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  notes: string;
  rating: number;
}
