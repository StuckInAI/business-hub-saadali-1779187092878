export type UserRole = 'admin' | 'recruiter' | 'viewer';
export type Department = 'engineering' | 'design' | 'marketing' | 'sales' | 'hr' | 'finance' | 'operations' | 'product';
export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
export type JobStatus = 'active' | 'paused' | 'closed';
export type ApplicationStatus = 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';

export type HRUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
};

export type Job = {
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
};

export type Application = {
  id: string;
  jobId: string;
  jobTitle: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  resumeText: string;
  coverLetter: string;
  status: ApplicationStatus;
  notes: string;
  rating: number;
  appliedAt: string;
  updatedAt: string;
};
