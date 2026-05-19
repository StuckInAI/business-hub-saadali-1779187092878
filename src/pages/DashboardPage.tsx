import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Users, Briefcase, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { useJobs } from '@/hooks/useStorage';
import { useApplications } from '@/hooks/useStorage';
import { useStages } from '@/hooks/useStorage';
import { StatCard } from '@/components/ui/StatCard';
import { HRUser } from '@/types';
import styles from './DashboardPage.module.css';

type OutletContext = { currentUser: HRUser };

export function DashboardPage() {
  const { currentUser } = useOutletContext<OutletContext>();
  const { jobs } = useJobs();
  const { applications } = useApplications();
  const { stages } = useStages();

  const metrics = useMemo(() => {
    const total = applications.length;
    const approved = applications.filter(a => a.status === 'approved').length;
    const rejected = applications.filter(a => a.status === 'rejected').length;
    const pending = applications.filter(a => a.status === 'pending').length;

    const hired = applications.filter(a => a.stageId === 'hired');
    let avgTimeToHire = 0;
    if (hired.length > 0) {
      const totalDays = hired.reduce((sum, a) => {
        const days = (new Date(a.updatedAt).getTime() - new Date(a.appliedAt).getTime()) / 86400000;
        return sum + days;
      }, 0);
      avgTimeToHire = Math.round(totalDays / hired.length);
    }

    const byJob = jobs.map(j => ({
      jobTitle: j.title,
      count: applications.filter(a => a.jobId === j.id).length,
    })).filter(x => x.count > 0).sort((a, b) => b.count - a.count);

    const byStage = stages.map(s => ({
      stage: s.label,
      count: applications.filter(a => a.stageId === s.id).length,
      color: s.color,
    }));

    return { total, approved, rejected, pending, avgTimeToHire, byJob, byStage };
  }, [applications, jobs, stages]);

  const maxJobCount = Math.max(...metrics.byJob.map(j => j.count), 1);
  const maxStageCount = Math.max(...metrics.byStage.map(s => s.count), 1);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Welcome back, {currentUser.name}</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <StatCard label="Total Applications" value={metrics.total} icon={<Users size={22} />} color="var(--color-primary)" />
        <StatCard label="Active Jobs" value={jobs.filter(j => j.status === 'active').length} icon={<Briefcase size={22} />} color="var(--color-info)" />
        <StatCard label="Approved" value={metrics.approved} icon={<CheckCircle size={22} />} color="var(--color-secondary)" />
        <StatCard label="Rejected" value={metrics.rejected} icon={<XCircle size={22} />} color="var(--color-danger)" />
        <StatCard label="Pending Review" value={metrics.pending} icon={<Clock size={22} />} color="var(--color-warning)" />
        <StatCard label="Avg. Time to Hire" value={`${metrics.avgTimeToHire}d`} icon={<TrendingUp size={22} />} color="var(--color-purple)" subtitle="from application to hired" />
      </div>

      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Applications by Job</h3>
          {metrics.byJob.length === 0 ? (
            <p className={styles.empty}>No data yet</p>
          ) : (
            <div className={styles.barList}>
              {metrics.byJob.map(item => (
                <div key={item.jobTitle} className={styles.barItem}>
                  <span className={styles.barLabel}>{item.jobTitle}</span>
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ width: `${(item.count / maxJobCount) * 100}%`, background: 'var(--color-primary)' }} />
                  </div>
                  <span className={styles.barValue}>{item.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Pipeline Stage Breakdown</h3>
          <div className={styles.barList}>
            {metrics.byStage.map((item) => (
              <div key={item.stage} className={styles.barItem}>
                <span className={styles.barLabel}>{item.stage}</span>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${(item.count / maxStageCount) * 100}%`, background: item.color }} />
                </div>
                <span className={styles.barValue}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.rateCard}>
        <h3 className={styles.chartTitle}>Approve / Reject Rate</h3>
        <div className={styles.rateRow}>
          <div className={styles.rateItem}>
            <div className={styles.rateBar}>
              <div
                className={styles.rateBarFill}
                style={{
                  width: metrics.total > 0 ? `${(metrics.approved / metrics.total) * 100}%` : '0%',
                  background: 'var(--color-secondary)',
                }}
              />
            </div>
            <span className={styles.rateLabel}>Approved</span>
            <span className={styles.ratePercent} style={{ color: 'var(--color-secondary)' }}>
              {metrics.total > 0 ? Math.round((metrics.approved / metrics.total) * 100) : 0}%
            </span>
          </div>
          <div className={styles.rateItem}>
            <div className={styles.rateBar}>
              <div
                className={styles.rateBarFill}
                style={{
                  width: metrics.total > 0 ? `${(metrics.rejected / metrics.total) * 100}%` : '0%',
                  background: 'var(--color-danger)',
                }}
              />
            </div>
            <span className={styles.rateLabel}>Rejected</span>
            <span className={styles.ratePercent} style={{ color: 'var(--color-danger)' }}>
              {metrics.total > 0 ? Math.round((metrics.rejected / metrics.total) * 100) : 0}%
            </span>
          </div>
          <div className={styles.rateItem}>
            <div className={styles.rateBar}>
              <div
                className={styles.rateBarFill}
                style={{
                  width: metrics.total > 0 ? `${(metrics.pending / metrics.total) * 100}%` : '0%',
                  background: 'var(--color-warning)',
                }}
              />
            </div>
            <span className={styles.rateLabel}>Pending</span>
            <span className={styles.ratePercent} style={{ color: 'var(--color-warning)' }}>
              {metrics.total > 0 ? Math.round((metrics.pending / metrics.total) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
