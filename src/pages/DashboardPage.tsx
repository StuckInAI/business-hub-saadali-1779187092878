import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, Clock, TrendingUp } from 'lucide-react';
import { useJobs, useApplications } from '@/hooks/useStorage';
import { StatCard } from '@/components/ui/StatCard';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const navigate = useNavigate();
  const { jobs } = useJobs();
  const { applications } = useApplications();

  const activeJobs = jobs.filter(j => j.status === 'active').length;
  const totalApplications = applications.length;
  const pendingReview = applications.filter(a => a.status === 'new' || a.status === 'screening').length;
  const inInterview = applications.filter(a => a.status === 'interview').length;

  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
    .slice(0, 5);

  const recentJobs = [...jobs]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <p className={styles.pageSubtitle}>Welcome back! Here's what's happening.</p>
      </div>

      <div className={styles.statsGrid}>
        <StatCard
          title="Active Job Listings"
          value={activeJobs}
          icon={<Briefcase size={22} />}
          color="primary"
          onClick={() => navigate('/job-listings')}
        />
        <StatCard
          title="Total Applications"
          value={totalApplications}
          icon={<Users size={22} />}
          color="info"
          onClick={() => navigate('/applications')}
        />
        <StatCard
          title="Pending Review"
          value={pendingReview}
          icon={<Clock size={22} />}
          color="warning"
          onClick={() => navigate('/applications')}
        />
        <StatCard
          title="In Interview"
          value={inInterview}
          icon={<TrendingUp size={22} />}
          color="success"
        />
      </div>

      <div className={styles.grid}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Recent Applications</h2>
          </div>
          <div className={styles.cardBody}>
            {recentApplications.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>No applications yet.</p>
            ) : (
              <ul className={styles.list}>
                {recentApplications.map(app => (
                  <li key={app.id} className={styles.listItem} onClick={() => navigate(`/applications/${app.id}`)}>
                    <div>
                      <p className={styles.listItemTitle}>{app.applicantName}</p>
                      <p className={styles.listItemSub}>{app.jobTitle}</p>
                    </div>
                    <span className={styles.statusBadge} data-status={app.status}>{app.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Recent Job Listings</h2>
          </div>
          <div className={styles.cardBody}>
            {recentJobs.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>No jobs yet.</p>
            ) : (
              <ul className={styles.list}>
                {recentJobs.map(job => (
                  <li key={job.id} className={styles.listItem} onClick={() => navigate(`/job-listings/${job.id}`)}>
                    <div>
                      <p className={styles.listItemTitle}>{job.title}</p>
                      <p className={styles.listItemSub}>{job.department} &bull; {job.location}</p>
                    </div>
                    <span className={styles.statusBadge} data-status={job.status}>{job.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
