import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useJobs } from '@/hooks/useStorage';
import { useOutletContext } from 'react-router-dom';
import { Job } from '@/types';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { JobForm } from '@/components/jobs/JobForm';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './JobsPage.module.css';

type OutletCtx = { currentUser: { id: string; name: string; role: string } };

const statusVariant: Record<string, 'success' | 'warning' | 'neutral'> = {
  active: 'success',
  paused: 'warning',
  closed: 'neutral',
};

export function JobsPage() {
  const { currentUser } = useOutletContext<OutletCtx>();
  const { jobs, addJob, updateJob, deleteJob } = useJobs();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Job | null>(null);

  const canEdit = currentUser.role === 'admin' || currentUser.role === 'recruiter';

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Job Listings</h1>
          <p className={styles.subtitle}>{jobs.length} open positions</p>
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
          description="Create your first job listing to start attracting candidates."
          action={canEdit ? <Button onClick={() => setShowCreate(true)}>Create Job</Button> : undefined}
        />
      ) : (
        <div className={styles.grid}>
          {jobs.map(job => (
            <div key={job.id} className={styles.card} onClick={() => navigate(`/job-listings/${job.id}`)}>
              <div className={styles.cardHeader}>
                <h3 className={styles.jobTitle}>{job.title}</h3>
                <Badge variant={statusVariant[job.status]}>{job.status}</Badge>
              </div>
              <p className={styles.department}>{job.department} · {job.location}</p>
              <p className={styles.type}>{job.type} {job.salary ? `· ${job.salary}` : ''}</p>
              <p className={styles.applicants}>{job.applicantCount} applicant{job.applicantCount !== 1 ? 's' : ''}</p>
              {canEdit && (
                <div className={styles.actions} onClick={e => e.stopPropagation()}>
                  <Button variant="secondary" size="sm" onClick={() => setEditing(job)}>Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => deleteJob(job.id)}>Delete</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Job Listing" size="lg">
        <JobForm
          postedBy={currentUser.id}
          onCancel={() => setShowCreate(false)}
          onSubmit={data => { addJob(data); setShowCreate(false); }}
        />
      </Modal>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="Edit Job Listing" size="lg">
        {editing && (
          <JobForm
            initial={editing}
            postedBy={currentUser.id}
            onCancel={() => setEditing(null)}
            onSubmit={data => { updateJob({ ...editing, ...data, updatedAt: new Date().toISOString() }); setEditing(null); }}
          />
        )}
      </Modal>
    </div>
  );
}
