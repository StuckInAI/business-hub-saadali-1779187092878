import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Briefcase, MapPin, Clock, Users } from 'lucide-react';
import { useJobs } from '@/hooks/useStorage';
import { useOutletContext } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { JobForm } from '@/components/jobs/JobForm';
import { EmptyState } from '@/components/ui/EmptyState';
import { HRUser, Job } from '@/types';
import styles from './JobsPage.module.css';

type OutletCtx = { currentUser: HRUser };

const departmentVariant: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'purple' | 'neutral'> = {
  engineering: 'primary',
  design: 'purple',
  marketing: 'warning',
  sales: 'success',
  hr: 'info',
  finance: 'neutral',
  operations: 'neutral',
  product: 'info',
};

const statusVariant: Record<string, 'success' | 'warning' | 'neutral'> = {
  active: 'success',
  paused: 'warning',
  closed: 'neutral',
};

export function JobsPage() {
  const { currentUser } = useOutletContext<OutletCtx>();
  const { jobs, addJob, deleteJob } = useJobs();
  const [showCreate, setShowCreate] = useState(false);

  const canEdit = currentUser.role !== 'viewer';

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Job Listings</h1>
          <p className={styles.subtitle}>{jobs.length} positions</p>
        </div>
        {canEdit && (
          <Button onClick={() => setShowCreate(true)}>
            <Plus size={16} /> New Job
          </Button>
        )}
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          icon={<Briefcase size={40} />}
          title="No job listings yet"
          description="Create your first job listing to start receiving applications."
          action={canEdit ? <Button onClick={() => setShowCreate(true)}>Create Job</Button> : undefined}
        />
      ) : (
        <div className={styles.grid}>
          {jobs.map(job => (
            <Link key={job.id} to={`/job-listings/${job.id}`} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                  <Briefcase size={18} color="var(--color-primary)" />
                </div>
                <div className={styles.cardBadges}>
                  <Badge variant={statusVariant[job.status] ?? 'neutral'} size="sm">
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </Badge>
                  <Badge variant={departmentVariant[job.department] ?? 'neutral'} size="sm">
                    {job.department.charAt(0).toUpperCase() + job.department.slice(1)}
                  </Badge>
                </div>
              </div>
              <h3 className={styles.cardTitle}>{job.title}</h3>
              <div className={styles.cardMeta}>
                <span><MapPin size={12} /> {job.location}</span>
                <span><Clock size={12} /> {job.type}</span>
                <span><Users size={12} /> {job.applicantCount} applicants</span>
              </div>
              {job.salary && <p className={styles.salary}>{job.salary}</p>}
            </Link>
          ))}
        </div>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Job Listing" size="lg">
        <JobForm
          onSubmit={data => { addJob(data); setShowCreate(false); }}
          onCancel={() => setShowCreate(false)}
          postedBy={currentUser.id}
        />
      </Modal>
    </div>
  );
}
