import { useNavigate } from 'react-router-dom';
import { useJobs, useApplications, useCurrentUser } from '@/hooks/useStorage';
import { ApplicationStatus } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/ui/StatCard';
import { Briefcase, Users, TrendingUp, CheckCircle } from 'lucide-react';
import styles from './DashboardPage.module.css';

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: 'Applied',
  screening: 'Screening',
  interview: 'Interview',
  offer: 'Offer',
  hired: 'Hired',
  rejected: 'Rejected',
};

const STATUS_VARIANTS: Record<ApplicationStatus, 'neutral' | 'primary' | 'danger' | 'success' | 'warning' | 'info' | 'purple'> = {
  applied: 'neutral',
  screening: 'info',
  interview: 'primary',
  offer: 'warning',
  hired: 'success',
  rejected: 'danger',
};

export function DashboardPage() {
  const navigate = useNavigate();
  const { jobs } = useJobs();
  const { applications } = useApplications();
  const { currentUser } = useCurrentUser();

  const activeJobs = jobs.filter(j => j.status === 'active').length;
  const totalApps = applications.length;
  const hired = applications.filter(a => a.status === 'hired').length;
  const inInterview = applications.filter(a => a.status === 'interview').length;

  const statusCounts = (Object.keys(STATUS_LABELS) as ApplicationStatus[]).map(s => ({
    status: s,
    label: STATUS_LABELS[s],
    count: applications.filter(a => a.status === s).length,
  }));

  const recentJobs = [...jobs]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Welcome back, {currentUser.name.split(' ')[0]}!</h1>
        <p>Here's what's happening with your hiring pipeline.</p>
      </div>

      <div className={styles.statsGrid}>
        <StatCard title="Active Jobs" value={activeJobs} icon={<Briefcase size={20} />} color="primary" />
        <StatCard title="Total Applications" value={totalApps} icon={<Users size={20} />} color="info" />
        <StatCard title="In Interview" value={inInterview} icon={<TrendingUp size={20} />} color="warning" />
        <StatCard title="Hired" value={hired} icon={<CheckCircle size={20} />} color="success" />
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Pipeline Overview</h2>
        </div>
        <div className={styles.pipelineGrid}>
          {statusCounts.map(({ status, label, count }) => (
            <div key={status} className={styles.pipelineCard}>
              <div className={styles.pipelineCount}>{count}</div>
              <div className={styles.pipelineLabel}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent Job Listings</h2>
          <Button size="sm" variant="secondary" onClick={() => navigate('/job-listings')}>View All</Button>
        </div>
        <div className={styles.card}>
          <div className={styles.tableHeader}>
            <span className={styles.th}>Job Title</span>
            <span className={styles.th}>Department</span>
            <span className={styles.th}>Status</span>
            <span className={styles.th}>Applicants</span>
          </div>
          {recentJobs.map(job => (
            <div
              key={job.id}
              className={styles.tableRow}
              onClick={() => navigate(`/job-listings/${job.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div>
                <div className={styles.jobTitle}>{job.title}</div>
                <div className={styles.jobMeta}>{job.department} · {job.location}</div>
              </div>
              <div className={styles.cell} style={{ textTransform: 'capitalize' }}>{job.department}</div>
              <div>
                <Badge variant={job.status === 'active' ? 'success' : job.status === 'paused' ? 'warning' : 'neutral'}>
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </Badge>
              </div>
              <div className={styles.cell}>{job.applicantCount}</div>
            </div>
          ))}
          {recentJobs.length === 0 && (
            <div style={{ padding: 'var(--spacing-6)', textAlign: 'center', color: 'var(--text-muted)' }}>
              No jobs yet. <button style={{ color: 'var(--color-primary)', background: 'none', fontWeight: 600 }} onClick={() => navigate('/job-listings')}>Create your first job</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
