import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Briefcase, Clock, Users, ExternalLink } from 'lucide-react';
import { useJobs } from '@/hooks/useStorage';
import { useApplications } from '@/hooks/useStorage';
import { useStages } from '@/hooks/useStorage';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import styles from './JobDetailPage.module.css';

export function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const { jobs } = useJobs();
  const { applications } = useApplications();
  const { stages } = useStages();

  const job = jobs.find(j => j.id === jobId);
  if (!job) return <div className={styles.notFound}>Job not found.</div>;

  const jobApps = applications.filter(a => a.jobId === jobId);

  return (
    <div className={styles.page}>
      <div className={styles.backRow}>
        <Link to="/job-listings">
          <Button variant="ghost" size="sm"><ArrowLeft size={14} /> Back to Jobs</Button>
        </Link>
      </div>

      <div className={styles.hero}>
        <div className={styles.heroLeft}>
          <h1 className={styles.jobTitle}>{job.title}</h1>
          <div className={styles.heroMeta}>
            <span className={styles.metaItem}><Briefcase size={14} /> {job.department.charAt(0).toUpperCase() + job.department.slice(1)}</span>
            <span className={styles.metaItem}><MapPin size={14} /> {job.location}</span>
            <span className={styles.metaItem}><Clock size={14} /> {job.type}</span>
            <span className={styles.metaItem}><Users size={14} /> {jobApps.length} applicants</span>
          </div>
          <div className={styles.badges}>
            <Badge variant={job.status === 'active' ? 'success' : job.status === 'paused' ? 'warning' : 'danger'}>
              {job.status}
            </Badge>
            {job.salary && <span className={styles.salary}>{job.salary}</span>}
          </div>
        </div>
        <a href={`/jobs/${jobId}/apply`} target="_blank" rel="noopener noreferrer">
          <Button><ExternalLink size={14} /> Public Apply Link</Button>
        </a>
      </div>

      <div className={styles.content}>
        <div className={styles.mainCol}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Description</h2>
            <p className={styles.descText}>{job.description}</p>
          </section>
          {job.requirements.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Requirements</h2>
              <ul className={styles.reqList}>
                {job.requirements.map((req, i) => (
                  <li key={i} className={styles.reqItem}>• {req}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className={styles.sideCol}>
          <div className={styles.stagesCard}>
            <h3 className={styles.sectionTitle}>Pipeline Overview</h3>
            {stages.map(stage => {
              const count = jobApps.filter(a => a.stageId === stage.id).length;
              return (
                <div key={stage.id} className={styles.stageRow}>
                  <span className={styles.stageDot} style={{ background: stage.color }} />
                  <span className={styles.stageLabel}>{stage.label}</span>
                  <span className={styles.stageCount}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
