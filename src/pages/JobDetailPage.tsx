import { useParams, useNavigate } from 'react-router-dom';
import { useJobs, useApplications } from '@/hooks/useStorage';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MapPin, Briefcase, DollarSign, Calendar, ArrowLeft } from 'lucide-react';
import styles from './JobDetailPage.module.css';

export function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { jobs, deleteJob } = useJobs();
  const { applications } = useApplications();

  const job = jobs.find(j => j.id === jobId);
  if (!job) return <div style={{ padding: 'var(--spacing-6)' }}>Job not found.</div>;

  const jobApplications = applications.filter(a => a.jobId === jobId);

  function handleDelete() {
    if (confirm('Delete this job listing?')) {
      deleteJob(job!.id);
      navigate('/job-listings');
    }
  }

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate('/job-listings')}>
        <ArrowLeft size={16} /> Back to Jobs
      </button>

      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.titleArea}>
            <h1>{job.title}</h1>
            <Badge variant={job.status === 'active' ? 'success' : job.status === 'paused' ? 'warning' : 'neutral'}>
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </Badge>
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
            <Button variant="danger" size="sm" onClick={handleDelete}>Delete Job</Button>
          </div>
        </div>
        <div className={styles.meta}>
          <span className={styles.metaItem}><MapPin size={14} />{job.location}</span>
          <span className={styles.metaItem}><Briefcase size={14} />{job.type}</span>
          {job.salary && <span className={styles.metaItem}><DollarSign size={14} />{job.salary}</span>}
          <span className={styles.metaItem}><Calendar size={14} />Posted {new Date(job.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Description</h2>
        <p className={styles.description}>{job.description}</p>
      </div>

      {job.requirements.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Requirements</h2>
          <div className={styles.reqList}>
            {job.requirements.map((req, i) => (
              <div key={i} className={styles.reqItem}>
                <div className={styles.reqDot} />
                <span>{req}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.applicantsSection}>
        <div className={styles.applicantsHeader}>
          <h2 className={styles.applicantsTitle}>Applicants ({jobApplications.length})</h2>
        </div>
        {jobApplications.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>No applications yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            {jobApplications.map(app => (
              <div
                key={app.id}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-md)',
                  padding: 'var(--spacing-4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/applications/${app.id}`)}
              >
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{app.applicantName}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{app.applicantEmail}</div>
                </div>
                <Badge variant={app.status === 'hired' ? 'success' : app.status === 'rejected' ? 'danger' : 'primary'}>
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
