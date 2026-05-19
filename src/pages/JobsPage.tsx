import { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Plus, Search, Briefcase, Edit2, Trash2, Eye } from 'lucide-react';
import { useJobs } from '@/hooks/useStorage';
import { Job, HRUser } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { JobForm } from '@/components/jobs/JobForm';
import { EmptyState } from '@/components/ui/EmptyState';
import styles from './JobsPage.module.css';

type OutletContext = { currentUser: HRUser };

function jobTypeBadge(type: string): 'primary' | 'success' | 'warning' | 'info' | 'neutral' {
  const map: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'neutral'> = {
    'full-time': 'primary', 'part-time': 'info', 'contract': 'warning', 'internship': 'neutral', 'remote': 'success',
  };
  return map[type] ?? 'neutral';
}

function jobStatusBadge(status: string): 'success' | 'warning' | 'danger' {
  const map: Record<string, 'success' | 'warning' | 'danger'> = {
    'active': 'success', 'paused': 'warning', 'closed': 'danger',
  };
  return map[status] ?? 'neutral' as 'success';
}

export function JobsPage() {
  const { currentUser } = useOutletContext<OutletContext>();
  const { jobs, add, update, remove } = useJobs();
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const canEdit = currentUser.role === 'admin' || currentUser.role === 'recruiter';

  const filtered = jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.department.toLowerCase().includes(search.toLowerCase()) ||
    j.location.toLowerCase().includes(search.toLowerCase())
  );

  function handleCreate(data: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'applicantCount'>) {
    add(data);
    setShowCreate(false);
  }

  function handleEdit(data: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'applicantCount'>) {
    if (!editJob) return;
    update({ ...editJob, ...data });
    setEditJob(null);
  }

  function handleDelete(id: string) {
    remove(id);
    setDeleteConfirm(null);
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Job Listings</h1>
          <p className={styles.subtitle}>{jobs.length} total positions</p>
        </div>
        {canEdit && (
          <Button onClick={() => setShowCreate(true)}>
            <Plus size={16} /> New Job
          </Button>
        )}
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search jobs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Briefcase size={40} />}
          title="No jobs found"
          description="Create your first job listing to get started."
          action={canEdit ? <Button onClick={() => setShowCreate(true)}><Plus size={16} /> Create Job</Button> : undefined}
        />
      ) : (
        <div className={styles.grid}>
          {filtered.map(job => (
            <div key={job.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>{job.title}</div>
                <div className={styles.badges}>
                  <Badge variant={jobStatusBadge(job.status)}>{job.status}</Badge>
                  <Badge variant={jobTypeBadge(job.type)}>{job.type}</Badge>
                </div>
              </div>
              <div className={styles.cardMeta}>
                <span>{job.department.charAt(0).toUpperCase() + job.department.slice(1)}</span>
                <span>·</span>
                <span>{job.location}</span>
              </div>
              {job.salary && <p className={styles.salary}>{job.salary}</p>}
              <p className={styles.desc}>{job.description.slice(0, 100)}{job.description.length > 100 ? '...' : ''}</p>
              <div className={styles.cardFooter}>
                <span className={styles.applicantCount}>{job.applicantCount} applicant{job.applicantCount !== 1 ? 's' : ''}</span>
                <div className={styles.cardActions}>
                  <Link to={`/job-listings/${job.id}`}>
                    <Button variant="ghost" size="sm"><Eye size={14} /> View</Button>
                  </Link>
                  {canEdit && (
                    <>
                      <Button variant="ghost" size="sm" onClick={() => setEditJob(job)}><Edit2 size={14} /> Edit</Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(job.id)}><Trash2 size={14} /> Delete</Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create New Job" size="lg">
        <JobForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} postedBy={currentUser.id} />
      </Modal>

      <Modal isOpen={!!editJob} onClose={() => setEditJob(null)} title="Edit Job" size="lg">
        {editJob && <JobForm initial={editJob} onSubmit={handleEdit} onCancel={() => setEditJob(null)} postedBy={currentUser.id} />}
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Job" size="sm">
        <p style={{ marginBottom: 'var(--spacing-5)', color: 'var(--text-secondary)' }}>Are you sure you want to delete this job? All related applications will remain but the job will be removed.</p>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
