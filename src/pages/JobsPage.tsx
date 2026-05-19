import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs, useCurrentUser } from '@/hooks/useStorage';
import { Job, JobStatus } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { JobForm } from '@/components/jobs/JobForm';
import { EmptyState } from '@/components/ui/EmptyState';
import { Briefcase, MapPin, Users } from 'lucide-react';
import styles from './JobsPage.module.css';

export function JobsPage() {
  const navigate = useNavigate();
  const { jobs, addJob, updateJob, deleteJob } = useJobs();
  const { currentUser } = useCurrentUser();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Job | null>(null);

  const filtered = jobs.filter(j => {
    const matchSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.department.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Job Listings</h1>
          <p>{jobs.length} total job{jobs.length !== 1 ? 's' : ''}</p>
        </div>
        {currentUser.role !== 'viewer' && (
          <Button onClick={() => setShowCreate(true)}>+ New Job</Button>
        )}
      </div>

      <div className={styles.filters}>
        <input
          className={styles.searchInput}
          placeholder="Search jobs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className={styles.select}
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as JobStatus | 'all')}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Briefcase size={40} />}
          title="No jobs found"
          description={jobs.length === 0 ? 'Create your first job listing to get started.' : 'No jobs match your current filters.'}
          action={currentUser.role !== 'viewer' ? <Button onClick={() => setShowCreate(true)}>Create Job</Button> : undefined}
        />
      ) : (
        <div className={styles.grid}>
          {filtered.map(job => (
            <div key={job.id} className={styles.card} onClick={() => navigate(`/job-listings/${job.id}`)}>
              <div className={styles.cardHeader}>
                <div>
                  <div className={styles.cardTitle}>{job.title}</div>
                  <div className={styles.cardMeta}>{job.department} · <MapPin size={11} style={{ display: 'inline' }} /> {job.location}</div>
                </div>
                <Badge variant={job.status === 'active' ? 'success' : job.status === 'paused' ? 'warning' : 'neutral'}>
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </Badge>
              </div>
              <div className={styles.cardFooter}>
                <span className={styles.cardStat}><Users size={13} style={{ display: 'inline' }} /> {job.applicantCount} applicant{job.applicantCount !== 1 ? 's' : ''}</span>
                {currentUser.role !== 'viewer' && (
                  <div className={styles.cardActions} onClick={e => e.stopPropagation()}>
                    <Button size="sm" variant="secondary" onClick={() => setEditing(job)}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => { if (confirm('Delete this job?')) deleteJob(job.id); }}>Delete</Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create New Job" size="lg">
        <JobForm
          onSubmit={data => { addJob(data); setShowCreate(false); }}
          onCancel={() => setShowCreate(false)}
          postedBy={currentUser.name}
        />
      </Modal>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="Edit Job" size="lg">
        {editing && (
          <JobForm
            initial={editing}
            onSubmit={data => { updateJob(editing.id, data); setEditing(null); }}
            onCancel={() => setEditing(null)}
            postedBy={currentUser.name}
          />
        )}
      </Modal>
    </div>
  );
}
