export type UserRole = 'admin' | 'recruiter' | 'viewer';

export type HRUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
};

export type JobStatus = 'active' | 'paused' | 'closed';
export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
export type Department = 'engineering' | 'design' | 'marketing' | 'sales' | 'hr' | 'finance' | 'operations' | 'product';

export type Job = {
  id: string;
  title: string;
  department: Department;
  location: string;
  type: JobType;
  status: JobStatus;
  description: string;
  requirements: string[];
  salary?: string;
  postedBy: string;
  createdAt: string;
  updatedAt: string;
  applicantCount: number;
};

export type PipelineStage = {
  id: string;
  label: string;
  color: string;
  order: number;
};

export type ApplicationStatus = 'approved' | 'rejected' | 'pending';

export type Application = {
  id: string;
  jobId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  resumeUrl: string;
  resumeName: string;
  coverLetter?: string;
  portfolioUrl?: string;
  yearsOfExperience: number;
  stageId: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  comments: Comment[];
  messages: Message[];
};

export type Comment = {
  id: string;
  applicationId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
};

export type Message = {
  id: string;
  applicationId: string;
  fromHR: boolean;
  senderName: string;
  content: string;
  sentAt: string;
};

export type DashboardMetrics = {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  avgTimeToHire: number;
  applicationsByJob: { jobTitle: string; count: number }[];
  applicationsByStage: { stage: string; count: number }[];
};
