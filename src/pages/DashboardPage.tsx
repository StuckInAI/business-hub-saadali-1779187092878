import { useNavigate } from 'react-router-dom';
import { useJobs, useApplications } from '@/hooks/useStorage';
import { ApplicationStatus } from '@/types';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Briefcase, Users, TrendingUp, Clock } from 'lucide-react';
import styles from './DashboardPage.module.css';

const statusLabel: Record<ApplicationStatus, string> = {
  new: 'New',
  screening: 'Screening',
  interview: 'Interview',
  offer: 'Offer',
  hired: 'Hired',
  rejected: 'Rejected',
};

const statusVariant: Record<ApplicationStatus, 'purple' | 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral'> = {
  new: 'neutral',
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

  const activeJobs = jobs.filter(j => j.status === 'active').length;
  const totalApps = applications.length;
  const hiredCount = applications.filter(a => a.status === 'hired').length;
  const newApps = applications.filter(a => a.status === 'new').length;

  const recent = [...applications]
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
    .slice(0, 5);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <p className={styles.pageSubtitle}>Welcome back! Here's what's happening with your hiring pipeline.</p>
      </div>

      <div className={styles.statsGrid}>
        <StatCard
          title="Active Jobs"
          value={activeJobs}
          icon={<Briefcase size={22} />}
          color="primary"
          onClick={() => navigate('/job-listings')}
        />
        <StatCard
          title="Total Applications"
          value={totalApps}
          icon={<Users size={22} />}
          color="info"
          onClick={() => navigate('/applications')}
        />
        <StatCard
          title="Hired This Cycle"
          value={hiredCount}
          icon={<TrendingUp size={22} />}
          color="success"
        />
        <StatCard
          title="New (Unreviewed)"
          value={newApps}
          icon={<Clock size={22} />}
          color="warning"
          onClick={() => navigate('/applications')}
        />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Applications</h2>
        {recent.length === 0 ? (
          <p className={styles.empty}>No applications yet.</p>
        ) : (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Applicant</span>
              <span>Job</span>
              <span>Status</span>
              <span>Applied</span>
            </div>
            {recent.map(app => (
              <div
                key={app.id}
                className={styles.tableRow}
                onClick={() => navigate(`/applications/${app.id}`)}
              >
                <span className={styles.name}>{app.applicantName}</span>
                <span className={styles.job}>{app.jobTitle}</span>
                <Badge variant={statusVariant[app.status]}>{statusLabel[app.status]}</Badge>
                <span className={styles.date}>{new Date(app.appliedAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
