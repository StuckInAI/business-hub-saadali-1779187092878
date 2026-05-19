import { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Search, Users, Eye, CheckCircle, XCircle, Filter } from 'lucide-react';
import { useApplications } from '@/hooks/useStorage';
import { useJobs } from '@/hooks/useStorage';
import { useStages } from '@/hooks/useStorage';
import { Application, HRUser } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import styles from './ApplicationsPage.module.css';

type OutletContext = { currentUser: HRUser };

function statusBadge(status: string): 'success' | 'danger' | 'warning' {
  if (status === 'approved') return 'success';
  if (status === 'rejected') return 'danger';
  return 'warning';
}

export function ApplicationsPage() {
  const { currentUser } = useOutletContext<OutletContext>();
  const { applications, update } = useApplications();
  const { jobs } = useJobs();
  const { stages } = useStages();

  const [search, setSearch] = useState('');
  const [filterJob, setFilterJob] = useState('');
  const [filterStage, setFilterStage] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const canEdit = currentUser.role === 'admin' || currentUser.role === 'recruiter';

  const filtered = applications.filter(app => {
    const job = jobs.find(j => j.id === app.jobId);
    const matchSearch =
      app.applicantName.toLowerCase().includes(search.toLowerCase()) ||
      app.applicantEmail.toLowerCase().includes(search.toLowerCase()) ||
      (job?.title.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchJob = !filterJob || app.jobId === filterJob;
    const matchStage = !filterStage || app.stageId === filterStage;
    const matchStatus = !filterStatus || app.status === filterStatus;
    return matchSearch && matchJob && matchStage && matchStatus;
  });

  function handleApprove(app: Application) {
    update({ ...app, status: 'approved', updatedAt: new Date().toISOString() });
  }

  function handleReject(app: Application) {
    update({ ...app, status: 'rejected', updatedAt: new Date().toISOString() });
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Applications</h1>
          <p className={styles.subtitle}>{applications.length} total applications</p>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search applicants..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filters}>
          <Filter size={14} style={{ color: 'var(--text-muted)' }} />
          <select className={styles.select} value={filterJob} onChange={e => setFilterJob(e.target.value)}>
            <option value="">All Jobs</option>
            {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
          </select>
          <select className={styles.select} value={filterStage} onChange={e => setFilterStage(e.target.value)}>
            <option value="">All Stages</option>
            {stages.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <select className={styles.select} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Users size={40} />} title="No applications found" description="Applications will appear here when candidates apply." />
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Job</th>
                <th>Stage</th>
                <th>Status</th>
                <th>Applied</th>
                <th>Experience</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(app => {
                const job = jobs.find(j => j.id === app.jobId);
                const stage = stages.find(s => s.id === app.stageId);
                return (
                  <tr key={app.id}>
                    <td>
                      <div className={styles.applicantCell}>
                        <div className={styles.applicantAvatar}>{app.applicantName.charAt(0)}</div>
                        <div>
                          <div className={styles.applicantName}>{app.applicantName}</div>
                          <div className={styles.applicantEmail}>{app.applicantEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={styles.jobTitle}>{job?.title ?? 'Unknown'}</span>
                    </td>
                    <td>
                      {stage && (
                        <span className={styles.stageChip} style={{ background: stage.color + '20', color: stage.color }}>
                          {stage.label}
                        </span>
                      )}
                    </td>
                    <td>
                      <Badge variant={statusBadge(app.status)}>{app.status}</Badge>
                    </td>
                    <td className={styles.dateCell}>
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className={styles.expCell}>{app.yearsOfExperience}y</td>
                    <td>
                      <div className={styles.rowActions}>
                        <Link to={`/applications/${app.id}`}>
                          <Button variant="ghost" size="sm"><Eye size={13} /></Button>
                        </Link>
                        {canEdit && app.status === 'pending' && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => handleApprove(app)}>
                              <CheckCircle size={13} style={{ color: 'var(--color-secondary)' }} />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleReject(app)}>
                              <XCircle size={13} style={{ color: 'var(--color-danger)' }} />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
